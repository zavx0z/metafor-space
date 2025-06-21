import {MetaFor} from "../../metafor.js"

export default MetaFor("node-meta-operator", {development: true})
  .states('init', 'ready')
  .context(t => ({
    title: t.string({title: "Название оператора", nullable: true}),
    value: t.string({title: "Значение", nullable: true}),
    op: t.enum("eq", "notEq", "gt", "gte", "lt", "lte", "between", "notGt", "notGte", "notLt", "notLte",
      "notMin", "notMax", "startsWith", "endsWith", "notStartsWith", "notEndsWith", "include",
      "notInclude", "pattern", "includes", "length", "every", "some", "logicalEq", "not",
      "isNull", "notNull")({title: "Операция сравнения", nullable: true})
  }))
  .core(() =>/**@type{import("./node-meta-operator.t").Core}*/ ({
    data: undefined,
    operators: operatorSymbols,
  }))
  .view({
    render: ({context, html, state, core}) => state !== "ready" || !context.op ? null : html`
      <span class="noselect">
          <span>${core.operators[context.op]}</span>
          <span>${context.title} - ${context.value}</span>
      </span>
    `
  })
  .transitions('init', [
    {
      in: "init",
      action({core, update, context}) {
        if (core.data) {
          update({...core.data})
        }
        core.data = undefined
      },
      to: [{
        state: "ready", when: {
          title: {isNull: false},
          value: {isNull: false}
        }
      }]
    }
  ])
  .create()

export const operatorSymbols = {
  // Числовые операторы
  eq: {
    symbol: '⊜',
    title: 'Равно',
    description: 'Проверяет равенство двух числовых значений'
  },
  notEq: {
    symbol: '≠',
    title: 'Не равно',
    description: 'Проверяет неравенство двух значений'
  },
  gt: {
    symbol: '⊐',
    title: 'Больше',
    description: 'Проверяет, что значение больше указанного числа'
  },
  gte: {
    symbol: '⊒',
    title: 'Больше или равно',
    description: 'Проверяет, что значение больше или равно указанному числу'
  },
  lt: {
    symbol: '⊏',
    title: 'Меньше',
    description: 'Проверяет, что значение меньше указанного числа'
  },
  lte: {
    symbol: '⊑',
    title: 'Меньше или равно',
    description: 'Проверяет, что значение не меньше или равно указанного числа'
  },
  between: {
    symbol: '⋈',
    title: 'Между значениями',
    description: 'Проверяет, что значение находится в указанном диапазоне'
  },
  notGt: {
    symbol: '≯',
    title: 'Не больше',
    description: 'Проверяет, что значение не больше указанного числа'
  },
  notGte: {
    symbol: '≱',
    title: 'Не больше или равно',
    description: 'Проверяет, что значение не больше или равно указанному числу'
  },
  notLt: {
    symbol: '≮',
    title: 'Не меньше',
    description: 'Проверяет, что значение не меньше указанного числа'
  },
  notLte: {
    symbol: '≰',
    title: 'Не меньше или равно',
    description: 'Проверяет, что значение не меньше или равно указанного числа'
  },
  notMin: {
    symbol: '⊀',
    title: 'Не минимальное',
    description: 'Проверяет, что значение не является минимальным'
  },
  notMax: {
    symbol: '⊁',
    title: 'Не максимальное',
    description: 'Проверяет, что значение не является максимальным'
  },

  // Строковые операторы
  startsWith: {
    symbol: '⊰',
    title: 'Начинается с',
    description: 'Проверяет, начинается ли строка с указанного значения'
  },
  endsWith: {
    symbol: '⊱',
    title: 'Заканчивается на',
    description: 'Проверяет, заканчивается ли строка указанным значением'
  },
  notStartsWith: {
    symbol: '⋪',
    title: 'Не начинается с',
    description: 'Проверяет, что строка не начинается с указанного значения'
  },
  notEndsWith: {
    symbol: '⋫',
    title: 'Не заканчивается на',
    description: 'Проверяет, что строка не заканчивается указанным значением'
  },
  include: {
    symbol: '⊆',
    title: 'Содержит',
    description: 'Проверяет наличие подстроки в строке'
  },
  notInclude: {
    symbol: '⊈',
    title: 'Не содержит',
    description: 'Проверяет отсутствие подстроки в строке'
  },
  pattern: {
    symbol: '⋊',
    title: 'Регулярное выражение',
    description: 'Проверяет соответствие строки регулярному выражению'
  },

  // Операторы массивов
  includes: {
    symbol: '⊂',
    title: 'Содержит элемент',
    description: 'Проверяет наличие элемента в массиве'
  },
  length: {
    symbol: '⊢',
    title: 'Длина массива',
    description: 'Проверяет длину массива'
  },
  every: {
    symbol: '⋀',
    title: 'Все элементы',
    description: 'Проверяет условие для всех элементов массива'
  },
  some: {
    symbol: '⋁',
    title: 'Хотя бы один',
    description: 'Проверяет условие хотя бы для одного элемента массива'
  },

  // Логические операторы
  logicalEq: {
    symbol: '⊨',
    title: 'Логическое равно',
    description: 'Проверяет логическое равенство'
  },
  not: {
    symbol: '⊭',
    title: 'Не равно',
    description: 'Инвертирует логическое значение'
  },

  // Операторы проверки на null
  isNull: {
    symbol: '∅',
    title: 'Проверка на null',
    description: 'Проверяет, является ли значение null или undefined'
  },
  notNull: {
    symbol: '¬∅',
    title: 'Проверка на не null',
    description: 'Проверяет, что значение не является null или undefined'
  }
}
