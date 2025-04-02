import type {
  ArrayDefinition,
  BooleanDefinition,
  ContextDefinition,
  NumberDefinition,
  NumberEnumDefinition,
  StringDefinition,
  StringEnumDefinition,
} from "./context"

/**
 # Переходы

 Система переходов предоставляет мощный инструмент для создания сложной логики изменения состояний.
 Декларативное описание логики позволяет легко добавлять новые состояния и условия изменения состояний без изменения существующей логики, а также упрощает поддержку системы.
 Возможность визуализации позволяет эффективно анализировать и документировать логику изменения состояний.
 Сериализация в JSON позволяет легко сохранять и переносить логику изменения состояний между различными системами.

 ## Преимущества переходов

 1. **Контекстно-зависимые изменения состояния**: Переходы позволяют определять сложные условия изменения состояния на основе контекста системы.

 2. **Декларативное описание логики**: Переходы позволяют описывать бизнес-логику декларативно, упрощая понимание и поддержку сложных систем.

 3. **Масштабируемость и сопровождение**: Структура переходов позволяет легко добавлять новые состояния и условия изменения состояний без изменения существующей логики, а также упрощает поддержку системы.

 4. **Возможность визуализации**: Структура переходов может быть представлена в виде графа, что позволяет эффективно анализировать и документировать логику изменения состояний.

 ## Правила срабатывания переходов

 1. **Атомарность**: Все условия в триггерах должны выполняться одновременно для срабатывания перехода.
 2. **Приоритетность**: Переходы проверяются в порядке их определения, срабатывает первый подходящий.
 3. **Валидация**: Система выполняет проверку типов данных и соответствия условиям триггеров
 при обработке во время работы приложения.
 Это обеспечивает корректность данных в момент их фактического использования.

 @template C - Проброс определения контекста для автодополнения
 @template S - Проброс состояний для автодополнения
 */
export type Transitions<C extends ContextDefinition, S> = Array<Transition<C, S>>

/**
 Переход

 Это ключевой механизм для описания логики переходов.

 @template C - Тип данных контекста
 @template S - Тип состояния
 */
export type Transition<C extends ContextDefinition, S> = {
  /**
     Исходное состояние

     Состояние, находясь в котором, производится проверка условий перехода для целевых состояний.
     */
  from: S
  /**
     Действие, выполняемое при входе в состояние

     Действие, выполняется при входе в состояние, указанное в `from`.

     @default undefined
     */
  action?: string
  /**
     Набор целевых состояний с условиями перехода

     Набор целевых состояний, в которые возможен переход из состояния, указанного в `from`.
     */
  to: To<C, S>[]
}

/**
 Целевое состояние в переходе

 @template C - Тип данных контекста
 @template S - Тип состояния
 */
type To<C extends ContextDefinition, S> = {
  /**
     Целевое состояние
     */
  state: S
  /**
     Условия сравнения для перехода
     */
  when: When<C>
}

/**
 Условия сравнения для перехода

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
    : C[K] extends ArrayDefinition
    ? any[] | { length: CondNumber }
    : never
}>

/**
 Условия для булевых значений

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

/**
 Условия для enum

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

/**
 Условия для строк

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
 | between        | [string, string]                     | Должна быть между двумя строками      |
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

/**
 Условия для чисел

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
