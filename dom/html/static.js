import {html as coreHtml, mathml as coreMathml, svg as coreSvg} from "./html.js"

/**
 * @typedef {import("./static").StaticValue} StaticValue
 */

const brand = Symbol.for("")

/** Безопасно извлекает строковую часть из StaticValue
 @param {unknown} value*/
const unwrapStaticValue = (value) => {
  if (/** @type {Partial<StaticValue>}**/(value)?.r !== brand) return undefined
  return /** @type {Partial<StaticValue>}**/ (value)?.["_$htmlStatic$"]
}

/** @type {import('./static').unsafeStatic} */
export const unsafeStatic = (value) => ({["_$htmlStatic$"]: value, r: brand})

/** @param {StaticValue} value **/
const textFromStatic = (value) => {
  if (value["_$htmlStatic$"] !== undefined) return value["_$htmlStatic$"]
  throw new Error(`Значение, переданное в функцию 'literal', должно быть результатом 'literal': ${value}. Используйте 'unsafeStatic' для передачи не литеральных значений, но позаботьтесь о безопасности страницы.`)
}

/** @type {import('./static').literal} */
export const literal = (strings, ...values) => ({
  ["_$htmlStatic$"]: /**@type{string}**/(values.reduce(
    (acc, v, idx) => acc + textFromStatic(/**@type{StaticValue}**/(v)) + strings[idx + 1],
    strings[0]
  )),
  r: brand
})

/**@type{Map<string, TemplateStringsArray>}**/
const stringsCache = new Map()

/** @type{import("./static").withStatic} */
export const withStatic = (coreTag) => (strings, ...values) => {
  const l = values.length
  let /**@type{string | undefined}**/ staticValue
  let /**@type{unknown}**/ dynamicValue
  const /**@type{Array<string>}**/ staticStrings = []
  const /**@type{Array<unknown>}**/ dynamicValues = []
  let i = 0
  let hasStatics = false
  let /**@type{string}**/ s

  while (i < l) {
    s = strings[i]
    // Собираем все значения unsafeStatic и следующие за ними строки шаблона,
    // чтобы обработать последовательность строк шаблона и небезопасных
    // статических значений как одну строку шаблона.
    while (i < l && ((dynamicValue = values[i]), (staticValue = unwrapStaticValue(dynamicValue))) !== undefined) {
      s += staticValue + strings[++i]
      hasStatics = true
    }
    // Если последнее значение статично, мы не должны его добавлять.
    if (i !== l) dynamicValues.push(dynamicValue)
    staticStrings.push(s)
    i++
  }
  // Если последнее значение не статично (которое бы потребило последнюю строку), то мы должны добавить последнюю строку.
  if (i === l) staticStrings.push(strings[l])

  if (hasStatics) {
    const key = staticStrings.join("$$html$$")
    strings = /**@type{TemplateStringsArray}**/(stringsCache.get(key))
    if (strings === undefined) {
      // Внимание: в целом этот паттерн небезопасен и может обойти проверки
      // безопасности @metafor/html, позволяя злоумышленнику выполнять произвольный
      // код и внедрять произвольный контент.
      /**@type{any}**/(staticStrings).raw = staticStrings
      stringsCache.set(key, (strings = /**@type{TemplateStringsArray}**/ (/**@type{unknown}**/ (staticStrings))))
    }
    values = dynamicValues
  }
  return coreTag(strings, ...values)
}

/** Интерпретирует строковый литерал как HTML шаблон, который может эффективно рендериться и обновлять контейнер.
 * Включает поддержку статических значений из `@metafor/html/static.js`. */
export const html = withStatic(coreHtml)

/** Интерпретирует строковый литерал как SVG шаблон, который может эффективно рендериться и обновлять контейнер.
 * Включает поддержку статических значений из `@metafor/html/static.js`. */
export const svg = withStatic(coreSvg)

/** Интерпретирует строковый литерал как фрагмент MathML, который может эффективно рендериться и обновлять контейнер.
 * Включает поддержку статических значений из `@metafor/html/static.js`. */
export const mathml = withStatic(coreMathml)
