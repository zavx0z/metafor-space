/**
 # Определение контекста

 Используется при создании частицы для определения структуры и типов данных контекста.
 Каждое поле контекста должно иметь явное определение типа через утилиты t.string(), t.number() и т.д.
 */
export type ContextDefinition = Record<string, TypeDefinition>

/**
 Определение типов контекста

 Объединяет все возможные типы определений для полей контекста частицы.
 Используется для валидации и типизации данных контекста.

 @property type - Тип данных
 @property title - Описание поля для документации
 @property nullable - Флаг, может ли значение быть null
 @property default - Значение по умолчанию
 */
export type TypeDefinition =
    | StringDefinition
    | BooleanDefinition
    | NumberDefinition
    | StringEnumDefinition<string[]>
    | NumberEnumDefinition<number[]>
    | ArrayDefinition

/**
 Данные контекста

 Представляет собой реальные значения контекста во время выполнения.
 В отличие от ContextDefinition содержит конкретные JavaScript значения.
 Все поля являются опциональными (Partial) для поддержки частичных обновлений.

 @template C - Тип определения контекста
 */
 export type ContextData<C extends ContextDefinition> = {
    [K in keyof C]: C[K] extends { nullable: true }
        ? ExtractTypeValue<C[K]> | null
        : ExtractTypeValue<C[K]>
}

/**
 Извлекает тип значения из определения типа

 @template T - Определение типа
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
 Тип контекста для уведомлений об изменении значений контекста

 @template C - Тип определения контекста
 */
export type OnUpdateContextData<C extends ContextDefinition> = {
    [K in keyof C]: C[K] extends { nullable: true }
        ? ExtractTypeValue<C[K]> | null
        : ExtractTypeValue<C[K]>
}

/**
 Nullable поля для обновления контекста
 */
type UpdateNullableFields<C extends ContextDefinition> = {
    [K in keyof C as C[K] extends { nullable: true } ? K : never]?: ExtractTypeValue<C[K]> | null
}

/**
 Обычные поля для обновления контекста  
 */
type UpdateRegularFields<C extends ContextDefinition> = {
    [K in keyof C as C[K] extends { nullable: true } ? never : K]?: ExtractTypeValue<C[K]>
}

/**
 Тип параметров для обновления контекста

 @template C - Тип определения контекста
 */
export type UpdateParameters<C extends ContextDefinition> = UpdateNullableFields<C> & UpdateRegularFields<C>

/**
 Частичный тип контекста

 @template C - Тип определения контекста
 */
export type PartialContextData<C extends ContextDefinition> = UpdateParameters<C>

/**
 Функция обновления контекста
 @external

 Используется в действиях и методах ядра для обновления данных контекста.
 Принимает частичный объект с новыми значениями контекста.

 @template C - Тип контекста
 @property context - Новые данные контекста
 */
export type Update<C extends ContextDefinition> = (context: UpdateParameters<C> | Partial<Record<keyof C, any>>) => void

/**
 Функция обновления контекста
 @internal

 Используется в действиях и методах ядра для обновления данных контекста.
 Принимает частичный объект с новыми значениями контекста.

 @template C - Тип контекста
 @property ctx - Новые данные контекста
 */
export type _Update<C extends ContextDefinition> = (ctx: UpdateParameters<C>) => PartialContextData<C>

/**
 Утилиты для создания типов контекста

 Предоставляет методы для определения типов полей контекста частицы.

 @property string - Создает определение строкового типа
 @property number - Создает определение числового типа
 @property boolean - Создает определение булева типа
 @property array - Создает определение типа массива
 @property enum - Создает определение типа enum
 */
export type ContextTypes = {
    string: (params: { title?: string; nullable?: boolean; default?: string }) => StringDefinition
    number: (params: { title?: string; nullable?: boolean; default?: number }) => NumberDefinition
    boolean: (params: { title?: string; nullable?: boolean; default?: boolean }) => BooleanDefinition
    array: (params: { title?: string; default?: any[]; nullable?: boolean }) => ArrayDefinition
    enum: <T extends string | number>(
        ...values: T[]
    ) => (options?: { title?: string; nullable?: boolean; default?: T }) => EnumDefinition<T[]>
}

/**
 Определение типа булева

 Используется для создания полей с булевыми значениями в контексте частицы.

 @property type - Тип данных "boolean"
 @property title - Описание поля для документации
 @property default - Значение по умолчанию (true/false)
 @property nullable - Флаг, может ли значение быть null
 */
export type BooleanDefinition = {
    type: "boolean"
    title?: string
    default?: boolean
    nullable?: boolean
}

/**
 Определение типа числа

 Используется для создания числовых полей в контексте частицы.

 @property type - Тип данных "number"
 @property title - Описание поля для документации
 @property default - Числовое значение по умолчанию
 @property nullable - Флаг, может ли значение быть null
 */
export type NumberDefinition = {
    type: "number"
    title?: string
    default?: number
    nullable?: boolean
}

/**
 Определение типа строки

 Используется для создания строковых полей в контексте частицы.

 @property type - Тип данных "string"
 @property title - Описание поля для документации
 @property default - Строковое значение по умолчанию
 @property nullable - Флаг, может ли значение быть null
 */
export type StringDefinition = {
    type: "string"
    title?: string
    default?: string
    nullable?: boolean
}

/**
 Определение типа массива

 Используется для создания полей-массивов в контексте частицы.

 @property type - Тип данных "array"
 @property title - Описание поля для документации
 @property default - Массив значений по умолчанию
 @property nullable - Флаг, может ли значение быть null
 */
export type ArrayDefinition = {
    type: "array"
    title?: string
    default?: string[] | number[]
    nullable?: boolean
}

/**
 Определение типа enum

 @template T - Тип значений enum
 */
export type EnumDefinition<T extends readonly (string | number)[]> = {
    type: "enum"
    values: T
    title?: string
    nullable?: boolean
    default?: T[number] | null
}

/**
 Определение типа enum чисел

 @template T - Тип значений enum
 @property values - Значения enum
 */
export type NumberEnumDefinition<T extends readonly number[]> = EnumDefinition<T> & {
    type: "enum"
    values: T
}

/**
 Определение типа enum строк

 @template T - Тип значений enum
 @property values - Значения enum
 */
export type StringEnumDefinition<T extends readonly string[]> = EnumDefinition<T> & {
    type: "enum"
    values: T
}

/**
 Параметры обновления контекста
 @internal

 @template C - Тип контекста
 @property context - Данные контекста для обновления
 @property srcName - Имя источника изменения
 @property funcName - Имя функции вызвавшей изменение
 */
export type UpdateContextParams<C extends Record<string, any>> = {
    ctx: UpdateParameters<C>
    srcName?: string
    funcName?: string
}