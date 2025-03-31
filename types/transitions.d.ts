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
 Она расширяет возможности классических конечных автоматов,
 позволяя описывать бизнес-процессы декларативно и учитывать широкий контекст системы,
 что упрощает разработку и поддержку сложных систем.

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

 Описывает переход между состояниями, включая исходное состояние, действие, триггеры и целевые состояния.

 @template C - Тип данных контекста
 @template S - Тип состояния

 @property from - Исходное состояние
 @property action - Действие, выполняемое при переходе
 @property to - Массив целевых состояний с условиями триггеров
 */
export type Transition<C extends ContextDefinition, S> = {
  from: S
  action?: string
  to: TransitionTo<C, S>[]
}

/**
 Переход к состоянию

 Используется для описания целевого состояния и условий триггера, необходимых для перехода.

 @template C - Тип данных контекста
 @template S - Тип состояния

 @property state - Целевое состояние
 @property trigger - Условия триггера для перехода
 */
export type TransitionTo<C extends ContextDefinition, S> = {
  state: S
  trigger: TriggerType<C>
}

/**
 Тип триггера

 @template C - Тип определения контекста
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

/**
 Условия триггера для булевых значений

 @property isNull - Является ли значение null
 @property eq - Равно указанному булеву значению
 @property notEq - Не равно указанному булеву значению
 @property logicalEq - Логическое равенство
 @property notNull - Не является ли значение null
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
 Условия триггера для enum

 @template E - Тип значений enum
 @property isNull - Является ли значение null
 @property eq - Равно указанному значению
 @property notEq - Не равно указанному значению
 @property oneOf - Одно из указанных значений
 @property notOneOf - Не одно из указанных значений
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
 Условия триггера для строк

 @property isNull - Является ли значение null
 @property startsWith - Начинается ли с указанной строки
 @property endsWith - Заканчивается ли на указанную строку
 @property include - Включает ли указанную подстроку
 @property pattern - Шаблон регулярного выражения
 @property eq - Равно указанной строке
 @property notEq - Не равно указанной строке
 @property notInclude - Не включает указанную подстроку
 @property notStartsWith - Не начинается с указанной строки
 @property notEndsWith - Не заканчивается на указанную строку
 @property length - Длина строки
 @property between - Должна быть между двумя строками
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
      length?: number | { min?: number; max?: number }
      between?: [string, string]
    }

/**
 Условия триггера для чисел

 @property isNull - Является ли значение null
 @property eq - Равно указанному числу
 @property gt - Больше указанного числа
 @property gte - Больше или равно указанному числу
 @property lt - Меньше указанного числа
 @property lte - Меньше или равно указанному числу
 @property notEq - Не равно указанному числу
 @property notGt - Не больше указанного числа
 @property notGte - Не больше или равно указанному числу
 @property notLt - Не меньше указанного числа
 @property notLte - Не меньше или равно указанному числу
 @property min - Минимальное значение
 @property max - Максимальное значение
 @property between - Должно быть между двумя числами
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
