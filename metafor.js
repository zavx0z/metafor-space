/**
 * @typedef {import("./types/context").ContextDefinition} ContextDefinition
 * @typedef {import("./types/core").CoreObj} CoreObj
 */
import {html, render} from "./html/html.js"
import {ref} from "./html/directives/ref.js"

let devChannel = null
/**
 * Установка канала для разработки
 * @param {BroadcastChannel} channel - Канал для разработки
 */
const setDevChannel = (channel) => {
  devChannel = channel
  devChannel.onmessage = ({data}) => console.warn(`${data.id}: ${data.message}`)
  console.debug("Режим разработки активирован")
}

/** @type {import("./metafor").MetaFor} */
export const MetaFor = (tag, conf = {}) => {
  const {development, description} = conf
  if (development) {
    import("./core/validator/index.js")
    setDevChannel(new BroadcastChannel("validator"))
    // todo: добавить проверку имени
  }
  return {
    states(...states) {
      development && import("./core/validator/index.js").then((module) => module.validateStates({tag, states}))
      return {
        context(context) {
          const contextDefinition = context({
            string: (params) => ({type: "string", ...params}),
            number: (params) => ({type: "number", ...params}),
            boolean: (params) => ({type: "boolean", ...params}),
            array: (params) => ({type: "array", ...params}),
            enum: (...values) => (params = {}) => ({type: "enum", values, ...params})
          })
          development && import("./core/validator/index.js").then((module) =>
            module.validateContextDefinition({tag, context: contextDefinition})
          )

          const contextData = Object.keys(contextDefinition).reduce((acc, key) => {
            const defaultValue = "default" in contextDefinition[key] ? contextDefinition[key].default : undefined
            if (typeof defaultValue !== "undefined") return {...acc, [key]: defaultValue}
            else return {...acc, [key]: "nullable" in contextDefinition[key] ? null : undefined}
          }, {})

          return {
            core(core) {
              const coreDefinition = core || (() => Object.create({}))
              development &&
              import("./core/validator/index.js").then((module) => module.validateCore({tag, core: coreDefinition}))
              return {
                transitions(initialState, transitions) {
                  if (development) {
                    const data = {tag, transitions: [...transitions], contextDefinition}
                    import("./core/validator/index.js").then((module) => module.validateTransitions(data))
                  }
                  return {
                    reactions: (reactions) => ({
                      create: (options) => createMeta({
                        states,
                        initialState,
                        contextDefinition,
                        contextData,
                        transitions,
                        development,
                        description,
                        tag,
                        options,
                        coreDefinition,
                        reactions
                      }),
                      view: (view) => {
                        return {
                          create: (options) => createMeta({
                            states,
                            initialState,
                            contextDefinition,
                            contextData,
                            transitions,
                            development,
                            description,
                            tag,
                            options,
                            coreDefinition,
                            reactions,
                            view
                          })
                        }
                      },
                    }),
                    create: (options) => createMeta({
                      states,
                      initialState,
                      contextDefinition,
                      contextData,
                      transitions,
                      development,
                      description,
                      tag,
                      options,
                      coreDefinition,
                    }),
                    view: (view) => {
                      return {
                        create: (options) => createMeta({
                          states,
                          initialState,
                          contextDefinition,
                          contextData,
                          transitions,
                          development,
                          description,
                          tag,
                          options,
                          coreDefinition,
                          view
                        })
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

/**
 * Фильтр реакций
 *
 * @template {ContextDefinition} C
 * @template {CoreObj} I
 *
 * @param {import("./types/reaction").Reaction<C, I>} reaction
 * @param {import("./types/meta").Patch} patch
 * @returns {boolean}
 */
const reactionFilter = (reaction, patch) => {
  if (reaction.path === patch.path && reaction.op === patch.op) return true
  if (reaction.op === patch.op) return true
  return Object.keys(reaction).length === 1 && "action" in reaction;
}

/**
 @template {string} S - состояние
 @template {ContextDefinition} C - контекст
 @template {CoreObj} I - ядро

 @param {import("./types/create").FabricCallbackCreateFuncHelper<S, C, I>} parameters
 @return {Meta<S, C>}
 */
const createMeta = (
  {
    development,
    description = "",
    tag,
    options,
    states,
    initialState,
    contextDefinition,
    contextData,
    transitions,
    coreDefinition,
    reactions = [],
    view
  }) => {
  development && import("./core/validator/index.js").then(
    (module) => module.validateCreateOptions({tag, options, states}))
  const {onTransition, onUpdate} = options
  const ContextKeys = Object.keys(contextData).map(camelToKebab)

  // Создаем карту соответствия между kebab-case и camelCase ключами
  /** @type {Record<string, string>} */
  const kebabToCamelMap = Object.keys(contextData).reduce((map, key) => {
    map[camelToKebab(key)] = key
    return map
  }, /** @type {Record<string, string>} */ ({}))

  customElements.define("metafor-" + tag,
    class extends HTMLElement {
      #shadow = this.attachShadow({mode: "open"})
      #process = false
      #core = /** @type{import("./types/core").Core<I>} */ ({})
      #channel = new BroadcastChannel('channel')
      #state = this.#createSignal(initialState)
      #states = states
      #parsedCore = /** @type {Record<string, ParsedResult>} */ ({})
      context = contextData

      get state() {
        return this.#state?.value()
      }

      get process() {
        return this.#process
      }

      set process(value) {
        this.#process = value
        if (!value) this.update(this.context)
      }

      constructor() {
        super()
        // console.log("connected ", this.tagName.toLowerCase(), this.context)
        this.dataset.state = initialState
        view?.style?.({
          css: (strings, ...values) => {
            const sheet = new CSSStyleSheet()
            const result = strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "")
            sheet.replaceSync(result)
            this.#shadow.adoptedStyleSheets.push(sheet)
            return sheet
          },
        })
        this.#core = /** @type {import("./types/core").Core<I>} */ ((() => {
          let /** @type {string | null} */ currentCaller = null
          const self = /** @type {import("./types/core").Core<I>} */ ({})
          const coreObj = coreDefinition({
            update: (ctx) => this._updateExternal({
              ctx,
              srcName: "core",
              funcName: currentCaller || "unknown"
            }), context: this.context, self
          })
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
      }

      connectedCallback() {
        this.#channel.onmessage = ({data: {meta, patch}}) => {
          reactions.forEach((reaction) => {
            if (reactionFilter(reaction, patch)) {
              reaction.action({
                patch,
                context: this.context,
                meta,
                update: (ctx) => this.#updateContext({ctx, srcName: "reaction", funcName: meta.name}),
                core: this.#core,
              })
            }
          })
        }
        // TODO: при восстановлении входить в состояние без вызова действия
        this.#channel.postMessage({
          meta: {meta: tag, func: "constructor", target: "meta", timestamp: Date.now()},
          patch: {path: "/", op: "add", value: this.snapshot()},
        })

        if (onTransition) {
          this.#state.onChange((oldValue, newValue) => {
            if (newValue !== undefined) onTransition(oldValue, newValue, this.snapshot())
          })
        }
        if (onUpdate) this.onUpdate(onUpdate)

        const transition = transitions.find((i) => i.from === initialState)
        if (transition?.action) {
          this.process = true
          this.#runAction(transition.action)
        } else this.#transition()
        // console.log("connectedCallback")
        const updateView = () => {
          this.dataset.state = String(this.state)
          const result = view?.render({
            update: (ctx) =>
              this._updateExternal({
                ctx,
                srcName: "component",
                funcName: "handler",
              }),
            context: this.context,
            state: this.state,
            core: this.#core,
            html: html,
            ref: ref,
          })
          console.log(result, this.tagName)
          const rendered = render(result, this.#shadow)
          // console.log(rendered, this.tagName)
        }
        if (view) {
          this.onUpdate(updateView)
          this.onTransition(updateView) // TODO: оптимизировать обновление
          updateView()
        }
        view?.onMount?.({
          component: this.#shadow.host, core: this.#core, update: (ctx) =>
            this._updateExternal({
              ctx,
              srcName: "component",
              funcName: "handler",
            }),
        })
      }

      disconnectedCallback() {
        view?.onDestroy?.({component: this.#shadow.host, core: this.#core})
        // meta.destroy()
      }

      static get observedAttributes() {
        return ContextKeys
      }

      /**
       * @param {string} name
       * @param {string} oldValue
       * @param {string} newValue */
      attributeChangedCallback(name, oldValue, newValue) {
        // Преобразуем kebab-case обратно в camelCase для обновления контекста
        const camelCaseName = kebabToCamelMap[name]
        if (camelCaseName) {
          const propType = contextDefinition[camelCaseName].type
          if (propType === "boolean") {
            // @ts-ignore - Принудительное приведение типа для boolean атрибута
            this.update({[camelCaseName]: newValue !== null})
          } else if (propType === "string") {
            console.log(name, oldValue, newValue)
          }
        }
      }

      /** @type {import('./types/context').Update<C>} */
      update = (ctx) => {
        this.#updateContext({ctx})
        if (this.process) return
        this.#transition()
      }

      /**
       * @param {S} state
       * @returns {import('./types/state').Signal<S>}
       */
      #createSignal(state) {
        const listeners = new Set()
        return {
          setValue: (next) => {
            if (state !== next) {
              const oldValue = state
              state = next
              listeners.forEach((listener) => listener(oldValue, next))
              this.#channel.postMessage({
                meta: {particle: this.id, timestamp: Date.now()},
                patch: {path: "/state", op: "replace", value: next},
              })
            }
          },
          value: () => state,
          onChange: (listener) => {
            listeners.add(listener)
            return () => {
              listeners.delete(listener)
            }
          },
          clear: listeners.clear,
        }
      }

      /**
       * Проверка условий перехода и выполнение действия
       */
      #transition() {
        const transitionFrom = transitions.find((t) => t.from === this.state)
        if (transitionFrom) {
          for (const transition of transitionFrom.to) {
            if (Object.keys(transition.when).length === 0) break
            if (conditions(transition.when, this.context, contextDefinition)) {
              const actionDefinition = transitions.find((i) => i.from === transition.state && i.action)
              if (actionDefinition?.action) {
                this.#process = true
                this.#state.setValue(transition.state)
                this.#runAction(actionDefinition.action)
              } else this.#state.setValue(transition.state)
            }
          }
        }
      }

      /**
       * Обновление контекста из внешнего источника (core, reaction)
       * @param {import("./types/context").UpdateContextParams<C>} params - параметры обновления контекста
       */
      _updateExternal = ({ctx, srcName = "core", funcName = "unknown"}) => {
        const updCtx = this.#updateContext({ctx, srcName, funcName})
        if (updCtx && !this.process) this.#transition()
      }

      /**
       * Выполнение действия с последующим отключением блокировки переходов
       * @param {import('./types/actions').Action<C, I>} action
       */
      #runAction(action) {
        const result = action({
          context: this.context,
          update: (ctx) => this.#updateContext({ctx, srcName: "action"}),
          core: this.#core,
        })
        const finallyFn = () => (this.process = false)
        if (result?.then) result.finally(finallyFn)
        else finallyFn()
      }

      #updateListeners = new Set()

      /** @type {import('./types/meta').OnUpdate<C>}*/
      onUpdate(cb) {
        this.#updateListeners.add(cb)
        return () => {
          this.#updateListeners.delete(cb)
        }
      }

      /** @type {import('./types/meta').OnTransition<S>}*/
      onTransition = (cb) => this.#state.onChange((oldValue, newValue) => {
        if (newValue !== undefined) cb(oldValue, newValue)
      })

      /** @param {import("./types/context").UpdateContextParams<C>} params */
      #updateContext = ({ctx, srcName = "unknown", funcName = "unknown"}) => {
        const updCtx = Object.keys(ctx).reduce((acc, /** @type {keyof C} */ key) => {
          if (this.context[key] !== ctx[key]) {
            this.context[key] = ctx[key]
            return {...acc, [key]: ctx[key]}
          }
          return acc
        }, {})
        if (Object.keys(updCtx).length > 0) {
          this.#updateListeners.forEach((listener) => listener(updCtx, srcName, funcName))
          this.#channel.postMessage(
            /** @type {import('./types/meta').BroadcastMessage} */ ({
              meta: {meta: this.id, func: funcName, target: srcName, timestamp: Date.now()},
              patch: {path: `/context`, op: "replace", value: updCtx},
            })
          )
        }
        return updCtx
      }

      snapshot() {
        return {
          id: tag,
          description,
          state: this.state,
          states: this.#states,
          core: this.#parsedCore,
          context: this.context,
          types: contextDefinition,
          transitions: transitions.map((t) => ({
            from: t.from,
            to: t.to.map((toState) => ({
              state: toState.state,
              when: toState.when,
            })),
          })),
        }
      }
    }
  )
  return /** @type{Meta<S, C>} */ (document.querySelector("metafor-" + tag))
}
/**
 * Преобразует строку из camelCase в kebab-case
 * @param {string} str - Строка в формате camelCase
 * @return {string} Строка в формате kebab-case
 */
const camelToKebab = (str) => str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()

/**
 @template {ContextDefinition} C
 @param {import('./types/transitions').When<C>} when
 @param {import('./types/context').ContextData<C>} context
 @param {ContextDefinition} types
 */
export function conditions(when, context, types) {
  for (const key in when) {
    const condition = when[key]
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
  return {read: Array.from(readProperties), write: Array.from(writeProperties)}
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
