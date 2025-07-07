/**
 * Типы для условий переходов между состояниями
 * @packageDocumentation
 */

import type { ContextSchema, ExtractValues } from "./context.t"

/** # Условия для булевых значений

 Позволяет определять условия для булевых значений в контексте.
 Поддерживает как прямое значение, так и набор правил сравнения.

 | Параметр   | Тип     | Описание                           |
 | ---------- | ------- | ---------------------------------- |
 | isNull     | boolean | Является ли значение null          |
 | eq         | boolean | Равно указанному булеву значению   |
 | notEq      | boolean | Не равно указанному булеву значению|
 | logicalEq  | boolean | Логическое равенство               |
 | notNull    | boolean | Не является ли значение null       |
 */
export type CondBoolean =
  | boolean
  | null
  | {
      isNull?: boolean
      eq?: boolean
      notEq?: boolean
      logicalEq?: boolean
    }

/** # Условия для enum

 Позволяет определять условия для enum значений в контексте.
 Поддерживает как прямое значение, так и набор правил сравнения.

 | Параметр  | Тип         | Описание                       |
 | --------- | ----------- | ------------------------------ |
 | isNull    | boolean     | Является ли значение null      |
 | eq        | E[number]   | Равно указанному значению      |
 | notEq     | E[number]   | Не равно указанному значению   |
 | oneOf     | E[number][] | Одно из указанных значений     |
 | notOneOf  | E[number][] | Не одно из указанных значений  |

 @template E - Тип значений enum
 */
export type CondEnum<E extends readonly (string | number)[]> =
  | E[number]
  | null
  | {
      isNull?: boolean
      eq?: E[number]
      notEq?: E[number]
      oneOf?: E[number][]
      notOneOf?: E[number][]
    }

/** # Условия для строк

 Позволяет определять условия для строковых значений в контексте.
 Поддерживает как прямое значение, регулярное выражение, так и набор правил сравнения.

 | Параметр       | Тип                                  | Описание                              |
 | -------------- | ------------------------------------ | ------------------------------------- |
 | isNull         | boolean                              | Является ли значение null             |
 | startsWith     | string                               | Начинается ли с указанной строки      |
 | endsWith       | string                               | Заканчивается ли на указанную строку  |
 | include        | string                               | Включает ли указанную подстроку       |
 | pattern        | RegExp                               | Шаблон регулярного выражения          |
 | eq             | string                               | Равно указанной строке                |
 | notEq          | string                               | Не равно указанной строке             |
 | notInclude     | string                               | Не включает указанную подстроку       |
 | notStartsWith  | string                               | Не начинается с указанной строки      |
 | notEndsWith    | string                               | Не заканчивается на указанную строку  |
 | length         | number \| { min?: number; max?: number } | Длина строки                      |
 | between        | [string, string]                     | Должно быть между двумя строками      |
 */
export type CondString =
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
      length?: number | { min?: number; max?: number }
      between?: [string, string]
    }

/** # Условия для чисел

 Позволяет определять условия для числовых значений в контексте.
 Поддерживает как прямое значение, так и набор правил сравнения.

 | Параметр | Тип              | Описание                              |
 | -------- | ---------------- | ------------------------------------- |
 | isNull   | boolean          | Является ли значение null             |
 | eq       | number           | Равно указанному числу                |
 | gt       | number           | Больше указанного числа               |
 | gte      | number           | Больше или равно указанному числу     |
 | lt       | number           | Меньше указанного числа               |
 | lte      | number           | Меньше или равно указанному числу     |
 | notEq    | number           | Не равно указанному числу             |
 | notGt    | number           | Не больше указанного числа            |
 | notGte   | number           | Не больше или равно указанному числу  |
 | notLt    | number           | Не меньше указанного числа            |
 | notLte   | number           | Не меньше или равно указанному числу  |
 | between  | [number, number] | Должно быть между двумя числами       |
 */
export type CondNumber =
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

/** # Условия для массивов

 Позволяет определять условия для массивов в контексте.
 Поддерживает как прямое значение, так и набор правил сравнения.

 | Параметр    | Тип              | Описание                              |
 | ----------- | ---------------- | ------------------------------------- |
 | isNull      | boolean          | Является ли значение null             |
 | length      | number \| { min?: number; max?: number } | Длина массива                    |
 | includes    | any              | Содержит ли массив указанный элемент  |
 | notIncludes | any              | Не содержит ли массив указанный элемент|
 | every       | (item: any) => boolean | Все элементы удовлетворяют условию  |
 | some        | (item: any) => boolean | Хотя бы один элемент удовлетворяет условию |
 | isEmpty     | boolean          | Является ли массив пустым             |
 */
export type CondArray<T = any> =
  | T[]
  | null
  | {
      isNull?: boolean
      length?: number | { min?: number; max?: number }
      includes?: T
      notIncludes?: T
      every?: (item: T) => boolean
      some?: (item: T) => boolean
      isEmpty?: boolean
    }

/** # Универсальный тип условий

 Определяет условия для любого типа значения в контексте.
 Автоматически выбирает подходящий тип условий на основе типа поля.
 */
export type Condition<T> =
  T extends boolean ? CondBoolean :
  T extends string ? CondString :
  T extends number ? CondNumber :
  T extends (infer U)[] ? CondArray<U> :
  T extends readonly (infer U)[] ? CondArray<U> :
  T extends null ? null :
  never

/** # Условия перехода

 Определяет условия для перехода к конкретному состоянию.
 Ключи - это имена полей контекста, значения - условия для этих полей.
 */
export type TransitionConditions<T extends ContextSchema> = {
  [K in keyof T]?: Condition<ExtractValues<T>[K]>
} 