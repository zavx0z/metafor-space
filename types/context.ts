/**
 # Строгая система типов для MetaFor

 Обеспечивает полную типизацию на этапе компиляции для всех компонентов системы.
 */

// ============================================================================
// БАЗОВЫЕ ТИПЫ ОПРЕДЕЛЕНИЙ
// ============================================================================

/**
 Базовое определение типа с метаданными
 */
type BaseTypeDefinition = {
  title?: string
  nullable?: boolean
}

/**
 Определение строкового типа
 */
export type StringDefinition = BaseTypeDefinition & {
  type: "string"
  default?: string
}

/**
 Определение числового типа
 */
export type NumberDefinition = BaseTypeDefinition & {
  type: "number"
  default?: number
}

/**
 Определение булевого типа
 */
export type BooleanDefinition = BaseTypeDefinition & {
  type: "boolean"
  default?: boolean
}

/**
 Определение типа массива
 */
export type ArrayDefinition<T = any> = BaseTypeDefinition & {
  type: "array"
  default?: T[]
  elementType?: "string" | "number" | "boolean"
}

/**
 Определение enum типа
 */
export type EnumDefinition<T extends readonly (string | number)[]> = BaseTypeDefinition & {
  type: "enum"
  values: T
  default?: T[number]
}

/**
 Определение числового enum
 */
export type NumberEnumDefinition<T extends readonly number[]> = EnumDefinition<T>

/**
 Определение строкового enum
 */
export type StringEnumDefinition<T extends readonly string[]> = EnumDefinition<T>

/**
 Объединение всех типов определений
 */
export type TypeDefinition =
  | StringDefinition
  | NumberDefinition
  | BooleanDefinition
  | ArrayDefinition<any>
  | NumberEnumDefinition<readonly number[]>
  | StringEnumDefinition<readonly string[]>

// ============================================================================
// ТИПЫ КОНТЕКСТА
// ============================================================================

/**
 Определение контекста
 */
export type ContextDefinition = Record<string, TypeDefinition>

/**
 Извлечение типа значения из определения типа
 */
type ExtractType<T extends TypeDefinition> = 
  T extends StringDefinition
    ? string
    : T extends NumberDefinition
      ? number
      : T extends BooleanDefinition
        ? boolean
        : T extends NumberEnumDefinition<infer V>
          ? V[number]
          : T extends StringEnumDefinition<infer V>
            ? V[number]
            : T extends ArrayDefinition<infer E>
              ? E[]
              : never

/**
 Типизированные данные контекста
 */
export type ContextData<T extends ContextDefinition> = {
  [K in keyof T]: T[K] extends { nullable: true }
    ? ExtractType<T[K]> | null
    : ExtractType<T[K]>
}

/**
 Типизированные параметры обновления (разрешает null для nullable полей)
 */
export type UpdateParameters<T extends ContextDefinition> = {
  [K in keyof T]: T[K] extends { nullable: true }
    ? ExtractType<T[K]> | null | undefined
    : ExtractType<T[K]> | undefined
}

/**
 Частичные данные контекста (алиас для обратной совместимости)
 */
export type PartialContextData<T extends ContextDefinition> = Partial<ContextData<T>>

// ============================================================================
// УТИЛИТЫ ТИПОВ
// ============================================================================

/**
 Типизированные утилиты для создания контекста
 */
export type ContextTypes = {
  string: <T extends string = string>(
    params?: { title?: string; nullable?: boolean; default?: T }
  ) => StringDefinition
  
  number: <T extends number = number>(
    params?: { title?: string; nullable?: boolean; default?: T }
  ) => NumberDefinition
  
  boolean: <T extends boolean = boolean>(
    params?: { title?: string; nullable?: boolean; default?: T }
  ) => BooleanDefinition
  
  array: <T = any>(
    params?: { title?: string; default?: T[]; nullable?: boolean }
  ) => ArrayDefinition<T>
  
  enum: <T extends readonly (string | number)[]>(
    ...values: T
  ) => (options?: { title?: string; nullable?: boolean; default?: T[number] }) => 
    EnumDefinition<T>
}

// ============================================================================
// ФУНКЦИИ ОБНОВЛЕНИЯ
// ============================================================================

/**
 Типизированная функция обновления контекста
 */
export type Update<T extends ContextDefinition> = (
  context: Partial<UpdateParameters<T>>
) => void

/**
 Внутренняя типизированная функция обновления
 */
export type _Update<T extends ContextDefinition> = (
  ctx: Partial<UpdateParameters<T>>
) => Partial<UpdateParameters<T>>

/**
 Параметры для внутреннего обновления
 */
export type UpdateContextParams<T extends ContextDefinition> = {
  ctx: Partial<UpdateParameters<T>>
  srcName?: string
  funcName?: string
}