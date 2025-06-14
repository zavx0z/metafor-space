/** @typedef {import("./types/context").ContextDefinition} ContextDefinition
 * @typedef {import("./types/core").CoreObj} CoreObj */
import {html, render} from "./html/html.js"
import {ref} from "./html/directives/ref.js"
import {repeat} from "./html/directives/repeat.js"

const debug = false
let log = /** @type {(message: import("./metafor").BroadcastMessage, core: CoreObj)=>void}*/(message, core) => void {}
if (debug) log = (await import('./core/console.js')).log

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
                        transitions,
                        development,
                        description,
                        tag,
                        options,
                        coreDefinition,
                        reactions
                      }),
                    }),
                    create: (options) => createMeta({
                      states,
                      initialState,
                      contextDefinition,
                      transitions,
                      development,
                      description,
                      tag,
                      options,
                      coreDefinition,
                    }),
                  }
                },
                view(view) {
                  return {
                    transitions(initialState, transitions) {
                      if (development) {
                        const data = {tag, transitions: [...transitions], contextDefinition}
                        import("./core/validator/index.js").then((module) => module.validateTransitions(data))
                      }
                      return {
                        reactions: (reactions) => ({
                          create: (options = {}) => createMeta({
                            states,
                            initialState,
                            contextDefinition,
                            view,
                            transitions,
                            development,
                            description,
                            tag,
                            options,
                            coreDefinition,
                            reactions
                          }),
                        }),
                        create: (options) => createMeta({
                          states,
                          initialState,
                          contextDefinition,
                          view,
                          transitions,
                          development,
                          description,
                          tag,
                          options,
                          coreDefinition,
                        }),
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
 @template {string} S - состояние
 @template {ContextDefinition} C - контекст
 @template {CoreObj} I - ядро

 @param {import("./types/create").FabricCallbackCreateFuncHelper<S, C, I>} parameters
 @return {Meta<S, C>}
 */
function createMeta(
  {
    development,
    description = "",
    tag,
    options,
    states,
    initialState,
    contextDefinition,
    transitions,
    coreDefinition,
    reactions = [],
    view
  }) {
  development && import("./core/validator/index.js").then(
    (module) => module.validateCreateOptions({tag, options, states}))
  const {onTransition, onUpdate} = options

  customElements.define("metafor-" + tag,
    class extends HTMLElement {
      #shadow = this.attachShadow({mode: "open"})
      /**@type{BroadcastChannel|undefined}*/
      #channel = undefined
      #process = false
      context = /** @type {import("./types/context").ContextData<C>} */(Object.keys(contextDefinition).reduce((acc, key) => {
        const defaultValue = "default" in contextDefinition[key] ? contextDefinition[key].default : undefined
        if (typeof defaultValue !== "undefined") return {...acc, [key]: defaultValue}
        else return {...acc, [key]: "nullable" in contextDefinition[key] ? null : undefined}
      }, {}))
      #core = /** @type {import("./types/core").Core<I>} */ ((() => {
        let /** @type {string | null} */ currentCaller = null
        const self = /** @type {import("./types/core").Core<I>} */ ({})
        const coreObj = coreDefinition({
          update: (ctx) => this._update({
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
      #parsedCore = /** @type {Record<string, ParsedResult>} */ ({})
      #states = states
      #state = /** @type {import('./types/state').Signal<S>} */ (((state) => {
        const listeners = new Set()
        return {
          setValue: (next) => {
            if (state !== next) {
              const oldValue = state
              state = next
              listeners.forEach((listener) => listener(oldValue, next))
              this.#sendPatches({path: "/state", op: "replace", value: next})
            }
          },
          value: () => state,
          onChange: (listener) => {
            listeners.add(listener)
            return () => {
              listeners.delete(listener)
            }
          },
          clear: () => listeners.clear(),
        }
      })(initialState))

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
      }

      connectedCallback() {
        this.#channel = new BroadcastChannel('channel')
        if (reactions.length) this.#channel.onmessage = ({data: {meta, patch}}) => {
          reactions.forEach((reaction) => {
            if (reaction.filter({meta, patch, context: this.context})) {
              reaction.action({
                patch, context: this.context, meta, core: this.#core,
                update: (ctx) => this._update({ctx, srcName: "reaction", funcName: "unknown"}),
              })
            }
          })
        }

        this.#sendPatches({path: "/", op: "add", value: this.snapshot()}) // TODO: при восстановлении входить в состояние без вызова действия
        if (onTransition) {
          this.#state.onChange((oldValue, newValue) => {
            if (newValue !== undefined) onTransition(oldValue, newValue, this.snapshot())
          })
        }
        if (onUpdate) this.onUpdate(onUpdate)

        const transition = transitions.find((i) => i.in === initialState)
        if (transition?.action) {
          this.process = true
          this.#runAction(transition.action) // FIXME: если в действии нет вызова update, то #updateView не происходит
        } else this.#transition()
        if (view) {
          // Обновляем представление только если нет переходов или они не сработали
          // if (!transition?.action) {
          //   this.#updateView()
          // }
          this.#updateView() //FIXME: временное решение
          view.onMount?.({
            update: (ctx) => this._update({ctx, srcName: "view", funcName: "onMount"}),
            component: this.#shadow.host,
            core: this.#core
          })
        }
      }

      /**@type{import("./types/view").UpdateView} */
      #updateView = () => {
        if (!view?.render) return
        render(view.render({
          update: (ctx) => this._update({ctx, srcName: "component", funcName: "handler"}),
          context: this.context,
          state: this.state,
          core: this.#core,
          html, ref, repeat
        }), this.#shadow)
      }

      disconnectedCallback() {
        this.#sendPatches({op: "remove", path: "/", value: null})
        if (this.#channel) { // TODO: перед удалением остановить асинхронные функции
          this.#channel.onmessage = null
          this.#channel.close()
          this.#channel = undefined
        }
        this.#shadow.adoptedStyleSheets = []
        this.#core =/**@type{import("./types/core").Core<I>}*/(/**@type{unknown}*/(undefined))
        view?.onDestroy?.({component: this.#shadow.host, core: this.#core})
        // meta.destroy()
      }

      /**@param {PatchMetaFor} patches*/
      #sendPatches = (patches) => {
        /**@type {import("./metafor").BroadcastMessage}*/
        const message = {meta: {tag, timestamp: Date.now()}, patch: patches}
        if (!this.#channel) {
          console.warn("Нет канала!", message)
          return
        }
        this.#channel.postMessage(message)
        if (debug) log(message, this.#core)
      }

      /** @param {import("./types/core").CoreData<I>} value*/
      _updateCore(value) {
        Object.keys(value).forEach(key => {
          if (key in this.#core) {
            // @ts-ignore
            this.#core[key] = value[key]
          }
        })
      }

      /** @type {import('./types/context').Update<C>} */
      update = (ctx) => {
        const upd = this.#updateContext({ctx})
        this.#update(upd)
      }

      /**
       * Обновление контекста из core, reaction
       * @param {import("./types/context").UpdateContextParams<C>} params - параметры обновления контекста
       */
      _update = ({ctx, srcName = "core", funcName = "unknown"}) => {
        const upd = this.#updateContext({ctx, srcName, funcName})
        this.#update(upd)
      }

      /** @param {import("./types/context").UpdateContextParams<C>} params */
      #updateContext = ({ctx, srcName = "unknown", funcName = "unknown"}) => {
        const updCtx = this._updateContext(ctx)
        if (Object.keys(updCtx).length > 0) {
          this.#updateListeners.forEach((listener) => listener(updCtx, srcName, funcName))
          this.#sendPatches({path: `/context`, op: "replace", value: updCtx})
        }
        return updCtx
      }

      /** @param {import("./types/context").PartialContextData<C>} upd */
      #update = (upd) => {
        if (this.process) {
          if (view?.render && Object.keys(upd).length) this.#updateView()
          return
        }
        const state = this.state
        this.#transition()
        if (view?.render && Object.keys(upd).length && state === this.state) this.#updateView()
      }

      /** @type {import('./types/context')._Update<C>} */
      _updateContext(ctx) {
        return Object.keys(ctx).reduce((acc, /** @type {keyof C} */ key) => {
          if (!(key in this.context)) {
            console.warn(`${String(key)} отсутствует в контексте!`, this.context)
            return acc
          }
          if (this.context[key] !== ctx[key]) {
            this.context[key] = ctx[key]
            return {...acc, [key]: ctx[key]}
          }
          return acc
        }, {})
      }

      #updateListeners = new Set()

      /** @type {import('./types/meta').OnUpdate<C>}*/
      onUpdate = (cb) => {
        this.#updateListeners.add(cb)
        return () => {
          this.#updateListeners.delete(cb)
        }
      }

      /**
       * Выполнение действия с последующим отключением блокировки переходов
       * @param {import('./types/actions').Action<C, I>} action
       */
      #runAction = (action) => {
        const result = action({
          context: this.context,
          update: (ctx) => this.#updateContext({ctx, srcName: "action"}),
          core: this.#core,
        })
        const finallyFn = () => (this.process = false)
        if (result?.then) result.finally(finallyFn)
        else finallyFn()
      }

      /** Проверка условий перехода и выполнение действия */
      #transition = () => {
        const transitionFrom = transitions.find((t) => t.in === this.state)
        if (transitionFrom) {
          for (const transition of transitionFrom.to) {
            if (Object.keys(transition.when).length === 0) break
            if (conditions(transition.when, this.context, contextDefinition)) {
              const actionDefinition = transitions.find((i) => i.in === transition.state && i.action)
              if (actionDefinition?.action) {
                this.#process = true
                this.#state.setValue(transition.state)
                if (view) this.#updateView()
                this.#runAction(actionDefinition.action)
              } else {
                this.#state.setValue(transition.state)
                if (view) this.#updateView()
              }
              if (view) this.dataset.state = String(this.state)
            }
          }
        }
      }

      /** @type {import('./types/meta').OnTransition<S>}*/
      onTransition = (cb) => this.#state.onChange((oldValue, newValue) => {
        if (newValue !== undefined) cb(oldValue, newValue)
      })

      snapshot = () => {
        return {
          id: tag,
          description,
          state: this.state,
          states: this.#states,
          core: this.#parsedCore,
          context: this.context,
          types: contextDefinition,
          transitions: transitions.map((t) => ({
            in: t.in,
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
        if ("isEmpty" in condition && condition.isEmpty !== (value.length === 0)) return false
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
