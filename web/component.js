import { html, render } from "../dom/html/html"
import { ref } from "../dom/html/directives/ref"


/**
 * Преобразует строку из camelCase в kebab-case
 * @param {string} str - Строка в формате camelCase
 * @return {string} Строка в формате kebab-case
 */
const camelToKebab = (str) => {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
}

/**
 * @template {import("../types/core").CoreObj} I
 * @template {import("../types/context").ContextDefinition} C
 * @template {string} S
 * @param {import("../types/view").ComponentParams<I, C, S>} params
 */
export default ({ view, particle }) => {
  const particleContextKeys = Object.keys(particle.context).map(camelToKebab)

  // Создаем карту соответствия между kebab-case и camelCase ключами
  /** @type {Record<string, string>} */
  const kebabToCamelMap = Object.keys(particle.context).reduce((map, key) => {
    map[camelToKebab(key)] = key
    return map
  }, /** @type {Record<string, string>} */ ({}))

  customElements.define(
    "metafor-" + particle.id,
    class extends HTMLElement {
      constructor() {
        super()
        if (view.isolated) {
          this.shadow = this.attachShadow({ mode: "open" })
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
        console.log("connectedCallback")
        const updateView = () => {
          const result = view.render({
            update: (context) =>
              particle._updateExternal({
                context: context,
                srcName: "component",
                funcName: "handler",
              }),
            context: particle.context,
            state: particle.state,
            core: particle.core,
            html: html,
            ref: ref,
          })
          // @ts-ignore
          render(result, this.shadow ?? this)
        }
        particle.component = this.shadow?.host ?? this

        particle.onUpdate(updateView)
        particle.onTransition(updateView) // TODO: оптимизировать обновление
        updateView()

        view.onMount?.({ component: /** @type {HTMLElement} */ (this.shadow?.host ?? this), core: particle.core })
      }

      disconnectedCallback() {
        view.onDestroy?.({ component: /** @type {HTMLElement} */ (this.shadow?.host ?? this), core: particle.core })
        // particle.destroy()
      }

      static get observedAttributes() {
        return particleContextKeys
      }
      /** @param {string} name @param {string} oldValue @param {string} newValue */
      attributeChangedCallback(name, oldValue, newValue) {
        // Преобразуем kebab-case обратно в camelCase для обновления контекста
        const camelCaseName = kebabToCamelMap[name]
        if (camelCaseName) {
          const propType = particle.types[camelCaseName].type
          if (propType === "boolean") {
            // @ts-ignore - Принудительное приведение типа для boolean атрибута
            particle.update({ [camelCaseName]: newValue !== null })
          }
        }
      }
    }
  )
}
