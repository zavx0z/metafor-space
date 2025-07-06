import type {
  ArrayDefinition,
  BooleanDefinition,
  ContextDefinition,
  NumberDefinition,
  NumberEnumDefinition,
  StringDefinition,
  StringEnumDefinition,
  ContextData,
  Update
} from "./context.ts";
import type {CoreObj} from "./core.ts";
import type {Action} from "../metafor.t.ts"
import type {ReactionKeys} from "./reaction.ts"

/** # Переходы
 @template C - Проброс определения контекста для автодополнения
 @template S - Проброс состояний для автодополнения
 @template I - Проброс ядра для автодополнения
 @template R - Проброс реакций для автодополнения ключей
 @includeExample tests/core.spec.ts
 */
export type Transitions<S extends string, C extends ContextDefinition, I extends CoreObj, R extends Record<string, any> = {}> = Partial<Record<S, Transition<S, C, I, R>>>

/** # Определение перехода для состояния

 Конфигурация переходов для конкретного состояния.
 Содержит действие при входе в состояние и возможные переходы в другие состояния.

 @template S - Тип состояния
 @template C - Тип данных контекста
 @template I - Тип ядра
 @template R - Тип реакций для автодополнения ключей
 */
export type Transition<S extends string, C extends ContextDefinition, I extends CoreObj, R extends Record<string, any> = {}> = {
  /** # Действие

   Действие, выполняется при входе в это состояние.
   Может быть использовано для выполнения побочных эффектов при переходе.

   @default undefined
   */
  action?: Action<C, I>
  /** # Реакции для запуска

   Массив ключей реакций, которые должны быть запущены при входе в это состояние.
   Ключи должны соответствовать ключам в объекте реакций актора.

   @default undefined
   */
  reaction?: ReactionKeys<R>[]
  /** # Success callback (опционально)
   * Вызывается при успешном завершении action (resolve/return)
   */
  success?: ({update, data, context, element, core}: {
    update: Update<C>
    data: any
    context: ContextData<C>
    element: HTMLElement
    core: CoreObj
  }) => void | Promise<void>
  /** # Error callback (опционально)
   * Вызывается при ошибке в action (reject/throw)
   */
  error?: ({update, data, context, element, core}: {
    update: Update<C>
    data: any
    context: ContextData<C>
    element: HTMLElement
    core: CoreObj
  }) => void | Promise<void>
  /** # Целевые состояния

   Набор целевых состояний, в которые возможен переход из текущего состояния.
   Каждое целевое состояние сопровождается набором условий, при которых переход возможен.
   */
  to?: Partial<Record<S, When<C>>>
}

/** # Условия сравнения для перехода

 Определяет набор условий для различных типов данных в контексте.
 Каждое условие может быть определено как прямое значение или как объект с набором правил сравнения.

 @template C - Тип определения контекста
 */
export type When<C extends ContextDefinition> = Partial<{
  [K in keyof C]: C[K] extends StringEnumDefinition<infer V>
    ? CondEnum<V>
    : C[K] extends NumberEnumDefinition<infer V>
      ? CondEnum<V>
      : C[K] extends StringDefinition
        ? CondString
        : C[K] extends NumberDefinition
          ? CondNumber
          : C[K] extends BooleanDefinition
            ? CondBoolean
            : C[K] extends ArrayDefinition<infer T>
              ? CondArray<T>
              : never
}>

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
type CondBoolean =
  | boolean
  | null
  | {
  isNull?: boolean
  eq?: boolean
  notEq?: boolean
  logicalEq?: boolean
  notNull?: boolean
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
type CondEnum<E extends readonly (string | number)[]> =
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
type CondString =
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
type CondNumber =
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
type CondArray<T = any> =
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
