/**
 * Определение контекста
 *
 * Используется при создании частицы для определения структуры и типов данных контекста.
 * Каждое поле контекста должно иметь явное определение типа через утилиты t.string(), t.number() и т.д.
 * Контекст является центральным элементом управления состояниями и данными в MetaFor.
 * Он служит единым источником истины для частицы и определяет её поведение, 
 * а также автоматические переходы между состояниями.
 * 
 * В отличие от классического подхода к управлению состояниями, где:
 * - Состояние меняется в ответ на события
 * - Логика переходов описывается условными операторами
 * - Данные разбросаны по разным частям приложения
 *
 * В MetaFor:
 * - Состояние вычисляется напрямую из контекста
 * - Логика переходов описывается декларативно с помощью триггеров
 * - Контекст является единым источником всех данных, связанных с частицей
 *
 * @interface ContextDefinition
 * @template Record - Тип для определения структуры и типов данных контекста
 * 
 * @example
 * ```js
 * .context({
 *   // Данные для списка задач
 *   items: [], // массив задач
 *   filter: 'all', // фильтр отображения (all, active, completed)
 *   
 *   // Состояние интерфейса
 *   isLoading: false,
 *   error: null,
 *   
 *   // Метаданные для управления состоянием
 *   state: 'idle',
 *   trigger: null
 * })
 * ```
 */
export type ContextDefinition = Record<string, TypeDefinition>

/**
 * Тип функции для определения контекста
 * Принимает объект с утилитами типов и возвращает определение контекста
 * 
 * @template C - Тип определения контекста
 * @example
 * ```
 * Atom("user").context((t) => ({
 *   name: t.string({ title: "Имя пользователя", nullable: true, default: "Guest" }),
 *   age: t.number({ title: "Возраст", default: 18 }),
 *   role: t.enum("guest", "user", "admin")({ title: "Роль пользователя", default: "guest" }),
 * }))
 * ```
 */
export type ContextCallback<C extends ContextDefinition> = (types: ContextTypes) => C
/**
 * Данные контекста
 *
 * Представляет собой реальные значения контекста во время выполнения.
 * В отличие от ContextDefinition содержит конкретные JavaScript значения.
 * Все поля являются опциональными (Partial) для поддержки частичных обновлений.
 * Контекст обновляется только с помощью метода `update()` внутри действия.
 *
 * @interface ContextData
 * @template C - Тип определения контекста
 */
export type ContextData<C extends Record<string, any>> = Partial<{ [K in keyof C]: any }>

/**
 * Извлекает тип значения из определения типа
 * @interface ExtractTypeValue
 * @template T - Определение типа
 * @private
 */
type ExtractTypeValue<T extends TypeDefinition> = T extends StringDefinition
  ? string
  : T extends NumberDefinition
    ? number
    : T extends BooleanDefinition
      ? boolean
      : T extends NumberEnumDefinition<infer V>
        ? V[number]
        : T extends StringEnumDefinition<infer V>
          ? V[number]
          : T extends ArrayDefinition
            ? any[]
            : never

/**
 * Тип контекста для уведомлений об изменении значений контекста
 * Используется в системе подписок для отслеживания изменений контекста
 * 
 * @interface OnUpdateContextData
 * @template C - Тип определения контекста
 */
export type OnUpdateContextData<C extends ContextDefinition> = {
  [K in keyof C]: C[K] extends EnumDefinition<infer T>
    ? C[K]["nullable"] extends true
      ? T[number] | null
      : T[number]
    : C[K] extends TypeDefinition
      ? C[K]["nullable"] extends true
        ? ExtractTypeValue<C[K]> | null
        : ExtractTypeValue<C[K]>
      : never
}
// FIXME: не должен обновлять на null если не nullable
/**
 * Тип параметров для обновления контекста
 * Используется в функции update() для обновления контекста
 * Все поля являются опциональными для поддержки частичных обновлений
 * 
 * @interface UpdateParameters
 * @template C - Тип определения контекста
 */
export type UpdateParameters<C extends ContextDefinition> = Partial<{
  [K in keyof C]: C[K] extends EnumDefinition<infer T>
    ? C[K]["nullable"] extends true
      ? T[number] | null
      : T[number] | null
    : C[K] extends TypeDefinition
      ? C[K]["nullable"] extends true
        ? ExtractTypeValue<C[K]> | null
        : ExtractTypeValue<C[K]> | null
      : never
}>
/**
 * Частичный тип контекста
 * Представляет подмножество полей контекста
 * 
 * @interface PartialContextData
 * @template C - Тип определения контекста
 */
export type PartialContextData<C extends ContextDefinition> = Partial<{
  [K in keyof C]: C[K] extends EnumDefinition<infer T> ? T[number] | null : ExtractTypeValue<C[K]> | null
}>

/**
 * Функция обновления контекста
 *
 * Используется в действиях и методах ядра для обновления данных контекста.
 * Принимает частичный объект с новыми значениями контекста.
 * Действия не принимают внешних аргументов и могут взаимодействовать только с ядром и контекстом.
 * 
 * Рекомендуется группировать связанные изменения в одном вызове update() для минимизации
 * количества обновлений.
 *
 * @template C - Тип контекста
 * @param context - Новые данные контекста
 * 
 * @example
 * ```
 * update({ 
 *   isLoading: true,
 *   error: null
 * });
 * ```
 */
export type Update<C extends ContextDefinition> = (context: UpdateParameters<C>) => void

/**
 * Определение типа булева
 *
 * Используется для создания полей с булевыми значениями в контексте частицы.
 * Подходит для флагов, переключателей и индикаторов состояния.
 *
 * @interface BooleanDefinition
 * @extends TypeDefinition
 * @property type - Тип данных "boolean"
 * @property title - Описание поля для документации (обязательно указывать)
 * @property default - Значение по умолчанию (true/false)
 * @property nullable - Флаг, может ли значение быть null
 * 
 * @example
 * ```
 * t.boolean({ title: "Активен", default: true })
 * ```
 */
export type BooleanDefinition = {
  type: "boolean"
  title?: string
  default?: boolean
  nullable?: boolean
}

/**
 * Определение типа числа
 *
 * Используется для создания числовых полей в контексте частицы.
 * Подходит для счетчиков, индексов, идентификаторов и числовых значений.
 *
 * @interface NumberDefinition
 * @extends TypeDefinition
 * @property type - Тип данных "number"
 * @property title - Описание поля для документации (обязательно указывать)
 * @property default - Числовое значение по умолчанию
 * @property nullable - Флаг, может ли значение быть null
 * 
 * @example
 * ```
 * t.number({ title: "Возраст", default: 18 })
 * ```
 */
export type NumberDefinition = {
  type: "number"
  title?: string
  default?: number
  nullable?: boolean
}

/**
 * Определение типа строки
 *
 * Используется для создания строковых полей в контексте частицы.
 * Подходит для названий, описаний, сообщений и текстовых данных.
 *
 * @interface StringDefinition
 * @extends TypeDefinition
 * @property type - Тип данных "string"
 * @property title - Описание поля для документации (обязательно указывать)
 * @property default - Строковое значение по умолчанию
 * @property nullable - Флаг, может ли значение быть null
 * 
 * @example
 * ```
 * t.string({ title: "Имя пользователя", nullable: true, default: "Guest" })
 * ```
 */
export type StringDefinition = {
  type: "string"
  title?: string
  default?: string
  nullable?: boolean
}

/**
 * Определение типа массива
 *
 * Используется для создания полей-массивов в контексте частицы.
 * Подходит для списков, коллекций и наборов данных.
 *
 * @interface ArrayDefinition
 * @extends TypeDefinition
 * @property type - Тип данных "array"
 * @property title - Описание поля для документации (обязательно указывать)
 * @property default - Массив значений по умолчанию
 * @property nullable - Флаг, может ли значение быть null
 * 
 * @example
 * ```
 * t.array({ title: "Теги", default: ["new"] })
 * ```
 */
export type ArrayDefinition = {
  type: "array"
  title?: string
  default?: any[]
  nullable?: boolean
}

/**
 * Определение типов контекста
 *
 * Объединяет все возможные типы определений для полей контекста частицы.
 * Используется для валидации и типизации данных контекста.
 *
 * @interface TypeDefinition
 * @property type - Тип данных
 * @property title - Описание поля для документации (обязательно указывать)
 * @property nullable - Флаг, может ли значение быть null
 * @property default - Значение по умолчанию
 */
export type TypeDefinition = StringDefinition | BooleanDefinition | NumberDefinition | StringEnumDefinition<string[]> | NumberEnumDefinition<number[]> | ArrayDefinition

/**
 * Утилиты для создания типов контекста
 *
 * Предоставляет методы для определения типов полей контекста частицы.
 * Используется для создания типизированных полей контекста с поддержкой документации,
 * значений по умолчанию и null-значений.
 *
 * @interface ContextTypes
 * @property string - Создает определение строкового типа
 * @property number - Создает определение числового типа
 * @property boolean - Создает определение булева типа
 * @property array - Создает определение типа массива
 * @property enum - Создает определение типа enum
 * 
 * @example
 * ```
 * Atom("user").context((t) => ({
 *   name: t.string({ title: "Имя пользователя", nullable: true, default: "Guest" }),
 *   age: t.number({ title: "Возраст", default: 18 }),
 *   role: t.enum("guest", "user", "admin")({ title: "Роль пользователя", default: "guest" }),
 *   tags: t.array({ title: "Теги", default: ["new"] }),
 *   isActive: t.boolean({ title: "Активен", default: true }),
 * }))
 * ```
 */
export type ContextTypes = {
  string: (params: { title?: string; nullable?: boolean; default?: string }) => StringDefinition
  number: (params: { title?: string; nullable?: boolean; default?: number }) => NumberDefinition
  boolean: (params: { title?: string; nullable?: boolean; default?: boolean }) => BooleanDefinition
  array: (params: { title?: string; nullable?: boolean; default?: any[] }) => ArrayDefinition
  enum: <T extends string | number>(...values: T[]) => (options?: { title?: string; nullable?: boolean; default?: T }) => EnumDefinition<T[]>
}

/**
 * Определение типа enum
 * Используется для создания перечислений в контексте частицы
 * 
 * @interface EnumDefinition
 * @template T - Тип значений enum
 * @property type - Тип данных "enum"
 * @property values - Массив возможных значений
 * @property title - Описание поля для документации (обязательно указывать)
 * @property nullable - Флаг, может ли значение быть null
 * @property default - Значение по умолчанию
 * 
 * @example
 * ```
 * t.enum("guest", "user", "admin")({ title: "Роль пользователя", default: "guest" })
 * ```
 */
export type EnumDefinition<T extends readonly (string | number)[]> = {
  type: "enum"
  values: T
  title?: string
  nullable?: boolean
  default?: T[number] | null
}

/**
 * Определение типа enum чисел
 * @interface NumberEnumDefinition
 * @extends TypeDefinition
 * @property type - Тип данных "enum"
 * @property values - Массив возможных числовых значений
 */
export type NumberEnumDefinition<T extends readonly number[]> = EnumDefinition<T> & {
  type: "enum"
  values: T
}

/**
 * Определение типа enum строк
 * @interface StringEnumDefinition
 * @extends TypeDefinition
 * @property type - Тип данных "enum"
 * @property values - Массив возможных строковых значений
 */
export type StringEnumDefinition<T extends readonly string[]> = EnumDefinition<T> & {
  type: "enum"
  values: T
}
