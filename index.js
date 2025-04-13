/**
 @template {string} S - состояние
 @template {import("./types/context").ContextDefinition} C - контекст
 @template {Record<string, any>} I - ядро
 */
export class Meta {
  title = ""
  description = ""
  graph = /** @type {() => Promise<any>} */ () => Promise.resolve(/** @type {any} */ (undefined))
  component = /**@type {HTMLElement | Element} */ (/** @type {unknown} */ (null))
  #process = false
  #parsedCore = /** @type {Record<string, ParsedResult>} */ ({})

  get state() {
    return this.$state?.value()
  }

  /** @param {import('./types/meta').MetaConstructor<S, C, I>} params */ // prettier-ignore
  constructor({ channel, id, states, contextDefinition, transitions, initialState, contextData, actions, core, coreData, reactions, onTransition, onUpdate, destroy }) {
    this.channel = channel
    this.id = id
    this.actions = actions
    this.reactions = reactions
    this.$state = this.#createSignal(initialState)
    this.destroy = () => {
      this.channel.postMessage({
        meta: { particle: this.id, func: "destroy", target: "particle", timestamp: Date.now() },
        patch: { path: "/", op: "remove" },
      })
      this.channel.close()
      this.#updateListeners.clear()
      this.$state.clear()
      this.types = {}
      this.context = {}
      this.core = /** @type {import("./types/core").Core<I>} */ ({})
      this.actions = {}
      this.transitions.length = 0
      this.reactions.length = 0
      this.#parsedCore = {}
      if (typeof destroy === "function") destroy(this)
    }
    this.states = states
    this.context = /** @type {import('./types/context').ContextData<C>} */ (
      Object.keys(contextDefinition).reduce((acc, key) => {
        const createValue = contextData && contextData[key]
        const defaultValue = "default" in contextDefinition[key] ? contextDefinition[key].default : undefined
        if (typeof createValue !== "undefined") return { ...acc, [key]: createValue }
        else if (typeof defaultValue !== "undefined") return { ...acc, [key]: defaultValue }
        else return { ...acc, [key]: "nullable" in contextDefinition[key] ? null : undefined }
      }, {})
    )

    this.types = contextDefinition
    this.transitions = transitions || []

    this.core = /** @type {import("./types/core").Core<I>} */ ((() => {
      let /** @type {string | null} */ currentCaller = null
      const self = /** @type {import("./types/core").Core<I>} */ ({})
      const coreObj = core({ update: (ctx) => this._updateExternal({ context: ctx, srcName: "core", funcName: currentCaller || "unknown" }), context: this.context, self })
      // Прокси для self, для синхронизации значений
      Object.entries(coreObj).forEach(([key, value]) => {
        if (typeof value !== "function") {
          Object.defineProperty(self, key, {
            get: () => coreObj[key],
            //@ts-ignore
            set: (newValue) => (coreObj[key] = newValue),
            enumerable: true,
            configurable: true,
          })//@ts-ignore
        } else self[key] = value
      })
      const wrappedCore = Object.entries(coreObj).reduce((acc, [name, value]) => {
        if (typeof value === "function") {
          //@ts-ignore
          acc[name] = (...args) => {
            currentCaller = name
            const result = value.apply(coreObj, args)
            currentCaller = null
            return result
          }
        } else Object.defineProperty(acc, name, {
          get: () => coreObj[name],
          //@ts-ignore
          set: (newValue) => coreObj[name] = newValue,
          enumerable: true,
          configurable: true,
        })
        return acc
      }, {})
      Object.assign(self, wrappedCore)
      return wrappedCore
    })())
    //@ts-ignore присваивание свойству ядра переданного объекта, массива или карты
    Object.entries(coreData || {}).forEach(
      ([key, value]) =>
        this.core[key] !== undefined && //@ts-ignore
        (this.core[key] = Array.isArray(value)
          ? value //@ts-ignore
          : (this.core[key] = Object.isFrozen(value) ? value : Object.freeze(value)))
    )
    this.channel.onmessage = ({ data: { meta, patch } }) => {
      this.reactions.forEach((reaction) => {
        if (reaction.particle && reaction.particle === meta.name) {
          reaction.action({
            patch,
            context: this.context,
            meta,
            update: (ctx) => this.#updateContext({ context: ctx, srcName: "reaction", funcName: meta.name }),
            core: this.core,
          })
        }
      })
    }
    // TODO: при восстановлении входить в состояние без вызова действия
    this.channel.postMessage({
      meta: { particle: this.id, func: "constructor", target: "particle", timestamp: Date.now() },
      patch: { path: "/", op: "add", value: this.snapshot() },
    })

    if (onTransition) {
      this.$state.onChange((oldValue, newValue) => {
        if (newValue !== undefined) onTransition(oldValue, newValue, this)
      })
    }
    if (onUpdate) this.onUpdate(onUpdate)
    const actionDefinition = this.transitions.find((i) => i.from === initialState && i.action)
    const action = actionDefinition?.action && this.actions[actionDefinition.action]
    if (action) {
      this.process = true
      const result = action({
        context: this.context,
        update: (ctx) => this.#updateContext({ context: ctx, srcName: "action", funcName: action.name }),
        core: this.core,
      })
      const finallyFn = () => {
        this.process = false
      }
      if (result?.then) result.finally(finallyFn)
      else finallyFn()
    } else {
      this.process = false
    }
  }

  get process() {
    return this.#process
  }

  set process(value) {
    this.#process = value
    if (!value) this.update(this.context)
  }

  /** Проверка триггеров и выполнение действия */
  #transition() {
    const transitions = this.transitions.find((t) => t.from === this.state)
    if (transitions) {
      for (const transition of transitions.to) {
        if (Object.keys(transition.when).length === 0) break
        if (matchTrigger(transition.when, this.context, this.types)) {
          const actionDefinition = this.transitions.find((i) => i.from === transition.state && i.action)
          const action = actionDefinition?.action && this.actions[actionDefinition.action]
          if (!action) {
            this.$state.setValue(transition.state)
            break
          }
          this.process = true
          this.$state.setValue(transition.state)
          this.#runAction(action)
          break
        }
      }
    }
  }

  /**  Обновление контекста из внешнего источника (core, reaction)
   * @param {import("./types/context").UpdateContextParams<C>} params - параметры обновления контекста */
  _updateExternal = ({ context, srcName = "core", funcName = "unknown" }) => {
    const updCtx = this.#updateContext({ context, srcName, funcName })
    if (updCtx && !this.process) this.#transition()
  }

  /** @param {import('./types/actions').Action<C, I>} action */
  #runAction(action) {
    this.process = true
    const result = action({
      context: this.context,
      update: (ctx) => this.#updateContext({ context: ctx, srcName: "action", funcName: action.name }),
      core: this.core,
    })
    const finallyFn = () => (this.process = false)
    if (result?.then) result.finally(finallyFn)
    else finallyFn()
  }

  /** @param {import("./types/context").UpdateContextParams<C>} params */
  #updateContext = ({ context, srcName = "unknown", funcName = "unknown" }) => {
    const updCtx = Object.keys(context).reduce((acc, /** @type {keyof C} */ key) => {
      if (this.context[key] !== context[key]) {
        this.context[key] = context[key]
        return { ...acc, [key]: context[key] }
      }
      return acc
    }, {})
    if (Object.keys(updCtx).length > 0) {
      this.#updateListeners.forEach((listener) => listener(updCtx, srcName, funcName))
      this.channel.postMessage(
        /** @type {import('./types/meta.js').BroadcastMessage} */ ({
          meta: { particle: this.id, func: funcName, target: srcName, timestamp: Date.now() },
          patch: { path: `/context`, op: "replace", value: updCtx },
        })
      )
    }
    return updCtx
  }

  /** @type {import('./types/context').Update<C>} */
  update = (context) => {
    this.#updateContext({ context })
    if (this.process) return
    this.#transition()
  }

  #updateListeners = new Set()

  /** @type {import('./types/meta').OnUpdate<C>}*/
  onUpdate(cb) {
    this.#updateListeners.add(cb)
    return () => {
      this.#updateListeners.delete(cb)
    }
  }

  /** @type {import('./types/meta').OnTransition<S, C, I>}*/
  onTransition = (cb) =>
    this.$state.onChange((oldValue, newValue) => {
      if (newValue !== undefined) cb(oldValue, newValue)
    })

  /** @returns {import('./types/meta.js').Snapshot<C, S>} */
  snapshot() {
    const parsedActions = parseFunctions(this.actions)
    return {
      id: this.id,
      title: this.title || "",
      description: this.description || "",
      state: this.state,
      states: this.states,
      actions: parsedActions,
      core: this.#parsedCore,
      context: this.context,
      types: this.types,
      transitions: this.transitions.map((t) => ({
        from: t.from,
        to: t.to.map((toState) => ({
          state: toState.state,
          when: toState.when,
        })),
        action: t.action,
      })),
    }
  }

  /** @type {import('./types/state').CreateSignal<S>} */
  #createSignal(value) {
    const listeners = new Set()
    return {
      value: () => value,
      setValue: (next) => {
        if (value !== next) {
          const oldValue = value
          value = next
          listeners.forEach((listener) => listener(oldValue, next))
          this.channel.postMessage({
            meta: { particle: this.id, timestamp: Date.now() },
            patch: { path: "/state", op: "replace", value: next },
          })
        }
      },
      onChange: (listener) => {
        listeners.add(listener)
        return () => listeners.delete(listener)
      },
      clear: listeners.clear,
    }
  }
}

let devChannel = null
/**
 Установка канала для разработки
 @param {BroadcastChannel} channel - Канал для разработки
 */
const setDevChannel = (channel) => {
  devChannel = channel
  devChannel.onmessage = ({ data }) => console.warn(`${data.id}: ${data.message}`)
  console.debug("Режим разработки активирован")
}

/** @type {import("./types").MetaFor} */ // prettier-ignore
export function MetaFor(tag, conf = {}) {
  const {development, description} = conf
  if (development) {
      import("./core/validator/index.js")
      setDevChannel(new BroadcastChannel("validator"))
      // todo: добавить проверку имени частицы
  }
  return {
    states(...states) {
      development && import("./core/validator/index.js").then((module) => module.validateStates({ tag, states }))
      return {
        context(context) {
          const contextDefinition = context({
            string: params => ({type: "string", ...params}),
            number: params => ({type: "number", ...params}),
            boolean: params => ({type: "boolean", ...params}),
            array: params => ({type: "array", ...params}),
            enum: (...values) => (params = {}) => ({type: "enum", values, ...params})
          })
          development && import("./core/validator/index.js").then((module) => module.validateContextDefinition({ tag, context: contextDefinition }))
          return {
            transitions(transitions) {
                if (development) {
                    const data = {tag, transitions: [...transitions], contextDefinition}
                    import("./core/validator/index.js").then((module) => module.validateTransitions(data))
                }
              return {
                core(core = () => Object.create({})) {
                  const coreDefinition = core
                  development && import("./core/validator/index.js").then((module) => module.validateCore({ tag, core: coreDefinition }))
                  return {
                    actions(actions) {
                      return {
                        reactions: (reactions = []) => ({
                          create: (options) => {
                            return createParticle({development, description, tag, options, states, contextDefinition, transitions, actions, coreDefinition, reactions})
                          },
                          view: (view) => {
                            return {
                              create: (options) => {
                                const particle = createParticle({development, description, tag, options, states, contextDefinition, transitions, actions, coreDefinition, reactions})

                                if (view.isolated === undefined) view.isolated = true
                                if (options.view?.isolated === false) view.isolated = false
                                import("./core/web/component.js").then((module) => module.default({ view,  particle }))

                                return particle
                              },
                            }
                          },
                        }),
                        create: (options) => {
                          return createParticle({development, description, tag, options, states, contextDefinition, transitions, actions, coreDefinition, reactions: []})
                        },
                        view: (view) => {
                          return {
                            create: (options) => {
                              const particle = createParticle({development, description, tag, options, states, contextDefinition, transitions, actions, coreDefinition, reactions: []})

                              if (view.isolated === undefined) view.isolated = true
                              if (options.view?.isolated === false) view.isolated = false
                              import("./core/web/component.js").then((module) => module.default({ view, particle }))

                              return particle
                            },
                          }
                        },
                      }
                    },
                  }
                },
              }
            },
          }
        },
      }
    },
  }
}

/**
 @template {string} S - состояние
 @template {import('./types/context').ContextDefinition} C - контекст
 @template {Record<string, any>} I - ядро
 @param {import("./types/create").FabricCallbackCreateFuncHelper<S, C, I>} parameters
 */ // prettier-ignore
const createParticle = ({development, description, tag, options, states, contextDefinition, transitions, actions, coreDefinition, reactions=[]}) => {
  development && import("./core/validator/index.js").then((module) => module.validateCreateOptions({ tag, options, states }))
  const { meta, state, context = {}, debug, graph, onTransition, core, onUpdate } = options
  const channel = new BroadcastChannel("channel")
  const particle = new Meta({ channel, id: meta?.name || tag, states, contextDefinition, transitions, initialState: state, contextData: context, actions, core: coreDefinition, coreData: /** @type {Partial<any>} */ (core), reactions, onTransition, onUpdate })
  particle.description = description || options.description || ""
  if (graph) particle.graph = () => import("./core/web/graph.js").then((module) => module.default(particle))
  if (debug) import("./core/debug.js").then((module) => module.default(particle, debug))
  return particle
}

/**
 @template {import('./types/context').ContextDefinition} C
 @param {import('./types/transitions').When<C>} trigger
 @param {import('./types/context').ContextData<C>} context
 @param {import('./types/context').ContextDefinition} types
 */
export function matchTrigger(trigger, context, types) {
  for (const key in trigger) {
    const condition = trigger[key]
    const value = context[key]
    const contextParam = types[key]
    const contextParamType = contextParam?.type

    // Проверка null значений
    if (condition === null) {
      if (!contextParam?.nullable) return false
      if (value !== null) return false
      continue
    }

    //Проверка isNull в объектных условиях
    if (typeof condition === "object" && "isNull" in condition) {
      const isNullCheck = condition.isNull
      const valueIsNull = value === null || value === undefined

      if (!isNullCheck && valueIsNull) return false
      if (isNullCheck && !valueIsNull) return false

      // Если isNull: false и значение не null, продолжаем проверять другие условия
      if (isNullCheck) continue
    }

    // Если значение null, а условие не проверяет null - возвращаем false
    if (value === null) return false

    // Проверка прямых значений
    if (typeof condition !== "object") {
      if (value !== condition) return false
      continue
    }

    // Проверка объектных условий по типам
    switch (contextParamType) {
      case "string":
        if ("include" in condition && !value?.includes(condition.include)) return false
        if ("startsWith" in condition && !value?.startsWith(condition.startsWith)) return false
        if ("endsWith" in condition && !value?.endsWith(condition.endsWith)) return false
        if ("notEndsWith" in condition && value?.endsWith(condition.notEndsWith)) return false
        continue
      case "number":
        if ("eq" in condition && value !== condition.eq) return false
        if (
          "gt" in condition &&
          condition.gt !== undefined &&
          condition.gt !== null &&
          Number(value) <= Number(condition.gt)
        )
          return false
        if (
          "gte" in condition &&
          condition.gte !== undefined &&
          condition.gte !== null &&
          Number(value) < Number(condition.gte)
        )
          return false
        if (
          "lt" in condition &&
          condition.lt !== undefined &&
          condition.lt !== null &&
          Number(value) >= Number(condition.lt)
        )
          return false
        if (
          "lte" in condition &&
          condition.lte !== undefined &&
          condition.lte !== null &&
          Number(value) > Number(condition.lte)
        )
          return false
        if ("between" in condition && Array.isArray(condition.between)) {
          const [min, max] = condition.between
          // @ts-ignore
          if (value < min || value > max) return false
        }
        continue
      case "boolean":
        if ("eq" in condition && value !== condition.eq) return false
        if ("notEq" in condition && value === condition.notEq) return false
        if ("logicalEq" in condition && Boolean(value) !== Boolean(condition.logicalEq)) return false
        continue
      case "enum":
        if ("eq" in condition && value !== condition.eq) return false
        if ("notEq" in condition && value === condition.notEq) return false
        // @ts-ignore
        if ("oneOf" in condition && Array.isArray(condition.oneOf) && !condition.oneOf.includes(value)) return false
        // @ts-ignore
        if ("notOneOf" in condition && Array.isArray(condition.notOneOf) && condition.notOneOf.includes(value))
          return false
        continue
      case "array":
        if ("length" in condition) {
          // @ts-ignore
          if (typeof condition.length === "number" && value.length !== condition.length) return false
          if (typeof condition.length === "object") {
            // @ts-ignore
            if ("min" in condition.length && value.length < condition.length.min) return false
            // @ts-ignore
            if ("max" in condition.length && value.length > condition.length.max) return false
          }
        }
        // @ts-ignore
        if ("includes" in condition && !value.includes(condition.includes)) return false
        // @ts-ignore
        if ("notIncludes" in condition && value.includes(condition.notIncludes)) return false
        // @ts-ignore
        if ("empty" in condition && condition.empty !== (value.length === 0)) return false
        continue
      default:
        return false
    }
  }
  return true
}

const pattern = {
  dot: /context\.(\w+)/g,
  destructParams: /context:\s*{([^}]+)}/g,
  destructBody: /(?:const|let|var)\s*{([^}]+)}\s*=\s*context(?:\s*,\s*{([^}]+)}\s*=\s*context)*/g,
  update: /update\(\s*{([^}]+)}\s*\)/g,
}

/**
 Парсит функцию и извлекает читаемые и обновляемые свойства контекста
 @typedef {Object} ParsedResult
 @property {string[]} read - Список читаемых свойств контекста
 @property {string[]} write - Список обновляемых свойств контекста
 @param {Function} func - Функция для анализа
 @returns {ParsedResult} Результат парсинга
 */
export function parseFunction(func) {
  const code = func.toString()
  // Множества для хранения уникальных свойств
  const readProperties = new Set()
  const writeProperties = new Set()
  // Поиск всех обращений к параметрам контекста
  let match
  while ((match = pattern.dot.exec(code)) !== null) readProperties.add(match[1])
  // Поиск деструктуризации контекста в параметрах функции
  while ((match = pattern.destructParams.exec(code)) !== null) {
    const props = match[1]
      .split(",")
      .map((prop) => prop.trim())
      .filter((prop) => prop.length > 0)
    props.forEach((prop) => readProperties.add(prop))
  }
  // Обработка всех деструктуризаций в теле функции
  const destructMatches = [...code.matchAll(pattern.destructBody)]
  destructMatches.forEach((match) => {
    const allProps = [match[1], match[2]].filter(Boolean).join(",")
    const props = allProps
      .split(",")
      .map((prop) => prop.trim().split(":")[0].trim())
      .filter((prop) => prop.length > 0)
    props.forEach((prop) => readProperties.add(prop))
  })
  // Поиск всех обновлений через update
  while ((match = pattern.update.exec(code)) !== null) {
    const props = match[1]
      .split(",")
      .map((prop) => prop.split(":")[0].trim())
      .filter((prop) => prop.length > 0)
    props.forEach((prop) => writeProperties.add(prop))
  }
  return { read: Array.from(readProperties), write: Array.from(writeProperties) }
}

/**
 Парсит все функции объекта (действия или ядро)
 @param {Record<string, Function>} funcs - Объект с функциями
 @returns {Record<string, ParsedResult>} Результаты парсинга для каждой функции
 */
export const parseFunctions = (funcs) =>
  Object.entries(funcs).reduce((/** @type {Record<string, ParsedResult>} */ acc, [name, func]) => {
    acc[name] = parseFunction(func)
    return acc
  }, {})
