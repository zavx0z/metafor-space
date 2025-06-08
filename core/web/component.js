import {html, render} from "../../html/html.js"
import {ref} from "../../html/directives/ref.js"


/**
 * Преобразует строку из camelCase в kebab-case
 * @param {string} str - Строка в формате camelCase
 * @return {string} Строка в формате kebab-case
 */
const camelToKebab = (str) => str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()

/**
 * @template {import("../../types/core").CoreObj} I
 * @template {import("../../types/context").ContextDefinition} C
 * @template {string} S
 * @param {import("../../types/view").ComponentParams<I, C, S>} params
 */
const createMeta = ({view, meta}) => {
  const ContextKeys = Object.keys(meta.context).map(camelToKebab)

  // Создаем карту соответствия между kebab-case и camelCase ключами
  /** @type {Record<string, string>} */
  const kebabToCamelMap = Object.keys(meta.context).reduce((map, key) => {
    map[camelToKebab(key)] = key
    return map
  }, /** @type {Record<string, string>} */ ({}))

  customElements.define(
    "metafor-" + meta.id,
    class extends HTMLElement {
      constructor() {
        super()
        if (view.isolated) {
          this.shadow = this.attachShadow({mode: "open"})
        }
        view.style?.({
          css: (strings, ...values) => {
            const sheet = new CSSStyleSheet()
            const result = strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "")
            sheet.replaceSync(result)
            if (this.shadow) {
              this.shadow.adoptedStyleSheets.push(sheet)
            } else {
              document.adoptedStyleSheets.push(sheet)
            }
            return sheet
          },
        })
      }

      connectedCallback() {
        // console.log("connectedCallback")
        const updateView = () => {
          const result = view.render({
            update: (context) =>
              meta._updateExternal({
                context: context,
                srcName: "component",
                funcName: "handler",
              }),
            context: meta.context,
            state: meta.state,
            core: meta.core,
            html: html,
            ref: ref,
          })
          // @ts-ignore
          render(result, this.shadow ?? this)
        }
        meta.component = this.shadow?.host ?? this

        meta.onUpdate(updateView)
        meta.onTransition(updateView) // TODO: оптимизировать обновление
        updateView()

        view.onMount?.({component: /** @type {HTMLElement} */ (this.shadow?.host ?? this), core: meta.core})
      }

      disconnectedCallback() {
        view.onDestroy?.({component: /** @type {HTMLElement} */ (this.shadow?.host ?? this), core: meta.core})
        // meta.destroy()
      }

      static get observedAttributes() {
        return ContextKeys
      }

      /** @param {string} name @param {string} oldValue @param {string} newValue */
      attributeChangedCallback(name, oldValue, newValue) {
        // Преобразуем kebab-case обратно в camelCase для обновления контекста
        const camelCaseName = kebabToCamelMap[name]
        if (camelCaseName) {
          const propType = meta.types[camelCaseName].type
          if (propType === "boolean") {
            // @ts-ignore - Принудительное приведение типа для boolean атрибута
            meta.update({[camelCaseName]: newValue !== null})
          }
        }
      }
    }
  )
}
export default createMeta