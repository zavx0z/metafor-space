import {AttributePart, noChange} from '../html.js'
import {directive, PartType, Directive} from '../directive.js'

/**
 * Константа для обозначения важности стиля
 * @type {string}
 */
const important = 'important'

/**
 * Строка флага !important с ведущим пробелом
 * @type {string}
 */
const importantFlag = ' !' + important

/**
 * Количество символов для удаления при обработке флага
 * @type {number}
 */
const flagTrim = 0 - importantFlag.length

/**
 * Директива для применения CSS-стилей к элементу
 * @extends {Directive}
 */
class StyleMapDirective extends Directive {
  /**
   * @type {Set<string>|undefined}
   * @private
   */
  _previousStyleProperties = undefined

  /**
   * @param {import("../directive").PartInfo} partInfo
   */
  constructor(partInfo) {
    super(partInfo)
    if (
      partInfo.type !== PartType.ATTRIBUTE ||
      partInfo.name !== 'style' ||
      (partInfo.strings?.length ?? 0) > 2
    ) {
      throw new Error(
        'Директива `styleMap` должна использоваться в атрибуте `style` и быть единственной частью'
      )
    }
  }

  /**
   * @param {{[key: string]: any}} styleInfo
   * @return {string}
   */
  render(styleInfo) {
    return Object.keys(styleInfo).reduce((style, prop) => {
      const value = styleInfo[prop]
      if (value == null) return style
      const processedProp = prop.includes('-')
        ? prop
        : prop.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, '-$&').toLowerCase()
      return style + `${processedProp}:${value};`
    }, '')
  }

  /**
   * @param {import('../html.js').AttributePart} part
   * @param {[{[key: string]: any}]} params
   * @return {string|symbol}
   */
  update(part, [styleInfo]) {
    const element = /** @type {HTMLElement} */ (part.element)
    const style = element.style

    if (this._previousStyleProperties === undefined) {
      this._previousStyleProperties = new Set(Object.keys(styleInfo))
      return this.render(styleInfo)
    }

    // Удаляем старые свойства, которых больше нет в styleInfo
    for (const name of Array.from(this._previousStyleProperties)) {
      if (styleInfo[name] == null) {
        this._previousStyleProperties.delete(name)
        if (name.includes('-')) style.removeProperty(name)
        else /** @type {any} */ (style)[name] = ""
      }
    }

    // Добавляем или обновляем свойства
    for (const name in styleInfo) {
      const value = styleInfo[name]
      if (value != null) {
        this._previousStyleProperties.add(name)
        const isImportant = typeof value === 'string' && value.endsWith(importantFlag)
        if (name.includes('-') || isImportant) {
          const cleanValue = isImportant
            ? /** @type {string} */ (value).slice(0, flagTrim)
            : /** @type {string} */ (value)
          const priority = isImportant ? important : ''
          style.setProperty(name, cleanValue, priority)
        } else {
          /** @type {any} */ (style)[name] = value
        }
      }
    }

    return noChange
  }
}

/**
 * Директива, которая применяет CSS свойства к элементу.
 *
 * `styleMap` может использоваться только в атрибуте `style` и должна быть единственным
 * выражением в атрибуте. Она берет имена свойств из объекта {@link StyleInfo styleInfo}
 * и добавляет свойства в инлайн стили элемента.
 *
 * Имена свойств с дефисами (`-`) считаются валидными именами CSS свойств
 * и устанавливаются в объекте style элемента с помощью `setProperty()`.
 * Имена без дефисов считаются JavaScript именами в camelCase
 * и устанавливаются в объекте style элемента через присваивание свойств, позволяя
 * объекту style преобразовывать JavaScript-стиль имен в имена CSS свойств.
 *
 * Например, `styleMap({backgroundColor: 'red', 'border-top': '5px', '--size': '0'})`
 * устанавливает свойства `background-color`, `border-top` и `--size`.
 *
 * @param styleInfo
 */
export const styleMap = directive(StyleMapDirective)