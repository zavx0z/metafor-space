import type {ArrayDefinition, BooleanDefinition, ContextDefinition, EnumDefinition, NumberDefinition, NumberEnumDefinition, StringDefinition, StringEnumDefinition} from "./context.d.ts"

/**
 * Условия триггера для enum
 * 
 * Триггеры — это ключевой механизм в MetaFor, который определяет, при каких условиях 
 * происходит переход между состояниями. Они обеспечивают декларативное описание 
 * логики, гарантируя предсказуемость и простоту управления состояниями.
 * 
 * Триггеры enum позволяют проверять значения перечислений на равенство, вхождение в список,
 * или проверять значение на null.
 * 
 * @interface EnumTriggerCondition
 * @template E - Тип значений enum
 * @property isNull - Является ли значение null
 * @property eq - Равно указанному значению
 * @property notEq - Не равно указанному значению
 * @property oneOf - Одно из указанных значений
 * @property notOneOf - Не одно из указанных значений
 * 
 * @example
 * ```
 * { role: "admin" } // Проверка на равенство значению "admin"
 * { role: { oneOf: ["admin", "moderator"] } } // Проверка на вхождение в список
 * { role: { isNull: true } } // Проверка на null
 * ```
 */
export type EnumTriggerCondition<E extends readonly (string | number)[]> =
  | E[number]
  | null
  | {
      isNull?: boolean
      eq?: E[number]
      notEq?: E[number]
      oneOf?: E[number][]
      notOneOf?: E[number][]
    }
/**
 * Условия триггера для строк
 * 
 * Позволяют проверять строковые значения на различные условия, такие как равенство, 
 * совпадение с регулярным выражением, начало или конец строки и другие.
 * 
 * @interface StringTriggerCondition
 * @property isNull - Является ли значение null
 * @property startsWith - Начинается ли с указанной строки
 * @property endsWith - Заканчивается ли на указанную строку
 * @property include - Включает ли указанную подстроку
 * @property pattern - Шаблон регулярного выражения
 * @property eq - Равно указанной строке
 * @property notEq - Не равно указанной строке
 * @property notInclude - Не включает указанную подстроку
 * @property notStartsWith - Не начинается с указанной строки
 * @property notEndsWith - Не заканчивается на указанную строку
 * @property length - Длина строки
 * @property between - Должна быть между двумя строками
 * 
 * @example
 * ```
 * { name: "John" } // Проверка на равенство строке "John"
 * { name: { startsWith: "J" } } // Строка начинается с "J"
 * { name: { pattern: /^J.*n$/ } } // Соответствует регулярному выражению
 * { name: { length: { gt: 3 } } } // Длина строки больше 3
 * ```
 */
export type StringTriggerCondition =
  | string
  | RegExp
  | null
  | {
      isNull?: boolean
      startsWith?: string
      endsWith?: string
      include?: string
      pattern?: RegExp
      eq?: string
      notEq?: string
      notInclude?: string
      notStartsWith?: string
      notEndsWith?: string
      length?: number | {min?: number; max?: number}
      between?: [string, string]
    }
/**
 * Условия триггера для чисел
 * 
 * Позволяют проверять числовые значения на различные условия, такие как равенство,
 * больше/меньше, диапазон и другие.
 * 
 * @interface NumberTriggerCondition
 * @property isNull - Является ли значение null
 * @property eq - Равно указанному числу
 * @property gt - Больше указанного числа
 * @property gte - Больше или равно указанному числу
 * @property lt - Меньше указанного числа
 * @property lte - Меньше или равно указанному числу
 * @property notEq - Не равно указанному числу
 * @property notGt - Не больше указанного числа
 * @property notGte - Не больше или равно указанному числу
 * @property notLt - Не меньше указанного числа
 * @property notLte - Не меньше или равно указанному числу
 * @property between - Должно быть между двумя числами
 * 
 * @example
 * ```
 * { age: 18 } // Проверка на равенство числу 18
 * { age: { gt: 18 } } // Число больше 18
 * { age: { between: [18, 65] } } // Число в диапазоне от 18 до 65
 * ```
 */
export type NumberTriggerCondition =
  | number
  | null
  | {
      isNull?: boolean
      eq?: number
      gt?: number
      gte?: number
      lt?: number
      lte?: number
      notEq?: number
      notGt?: number
      notGte?: number
      notLt?: number
      notLte?: number
      between?: [number, number]
    }
/**
 * Условия триггера для булевых значений
 * 
 * Позволяют проверять булевы значения на различные условия, такие как равенство,
 * логическое равенство и другие.
 * 
 * @interface BooleanTriggerCondition
 * @property isNull - Является ли значение null
 * @property eq - Равно указанному булеву значению
 * @property notEq - Не равно указанному булеву значению
 * @property logicalEq - Логическое равенство
 * @property notNull - Не является ли значение null
 * 
 * @example
 * ```
 * { isActive: true } // Проверка на равенство true
 * { isActive: { eq: true } } // Проверка на равенство true
 * { isActive: { notNull: true } } // Проверка на не-null
 * ```
 */
export type BooleanTriggerCondition =
  | boolean
  | null
  | {
      isNull?: boolean
      eq?: boolean
      notEq?: boolean
      logicalEq?: boolean
      notNull?: boolean
    }

/**
 * Тип триггера
 * 
 * Объединяет все возможные условия триггеров для разных типов данных контекста.
 * Триггеры используются в переходах для определения условий перехода между состояниями.
 * 
 * Основные принципы работы триггеров:
 * 1. Декларативность - триггеры описываются в виде условий, связанных с параметрами контекста
 * 2. Единичность срабатывания - в каждый момент времени может сработать только один триггер
 * 3. Приоритет проверки - условие isNull проверяется в первую очередь
 * 4. Валидация на этапе разработки - все триггеры проверяются на пересечения
 * 
 * @interface TriggerType
 * @template C - Тип определения контекста
 * 
 * @example
 * ```
 * .transitions([
 *   {
 *     from: "IDLE",
 *     to: "LOADING",
 *     trigger: { isLoading: true }, // Триггер: переход произойдет, когда isLoading станет true
 *   },
 *   {
 *     from: "LOADING",
 *     to: "LOADED",
 *     trigger: { items: { length: { gt: 0 } } }, // Триггер: переход произойдет, когда длина массива items станет больше 0
 *   }
 * ])
 * ```
 */
export type TriggerType<C extends ContextDefinition> = Partial<{
  [K in keyof C]: C[K] extends StringEnumDefinition<infer V>
    ? EnumTriggerCondition<V>
    : C[K] extends NumberEnumDefinition<infer V>
    ? EnumTriggerCondition<V>
    : C[K] extends StringDefinition
    ? StringTriggerCondition
    : C[K] extends NumberDefinition
    ? NumberTriggerCondition
    : C[K] extends BooleanDefinition
    ? BooleanTriggerCondition
    : C[K] extends ArrayDefinition
    ? any[] | { length: NumberTriggerCondition }
    : never
}>
