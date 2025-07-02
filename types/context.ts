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
// СТРОГИЕ ТИПЫ КОНТЕКСТА
// ============================================================================

/**
 Строгое определение контекста
 */
export type StrictContextDefinition = Record<string, TypeDefinition>

/**
 Извлечение типа значения из определения типа
 */
type ExtractStrictType<T extends TypeDefinition> = 
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
 Строго типизированные данные контекста
 */
export type StrictContextData<T extends StrictContextDefinition> = {
  [K in keyof T]: T[K] extends { nullable: true }
    ? ExtractStrictType<T[K]> | null
    : ExtractStrictType<T[K]>
}

/**
 Строго типизированные параметры обновления
 */
export type StrictUpdateParameters<T extends StrictContextDefinition> = Partial<StrictContextData<T>>

// ============================================================================
// СТРОГИЕ УТИЛИТЫ ТИПОВ
// ============================================================================

/**
 Строго типизированные утилиты для создания контекста
 */
export type StrictContextTypes = {
  string: <T extends string = string>(
    params?: { title?: string; nullable?: boolean; default?: T }
  ) => StringDefinition & { __inferredType: T }
  
  number: <T extends number = number>(
    params?: { title?: string; nullable?: boolean; default?: T }
  ) => NumberDefinition & { __inferredType: T }
  
  boolean: <T extends boolean = boolean>(
    params?: { title?: string; nullable?: boolean; default?: T }
  ) => BooleanDefinition & { __inferredType: T }
  
  array: <T = any>(
    params?: { title?: string; default?: T[]; nullable?: boolean }
  ) => ArrayDefinition<T> & { __inferredType: T[] }
  
  enum: <T extends readonly (string | number)[]>(
    ...values: T
  ) => (options?: { title?: string; nullable?: boolean; default?: T[number] }) => 
    EnumDefinition<T> & { __inferredType: T[number] }
}

// ============================================================================
// ФУНКЦИИ ОБНОВЛЕНИЯ
// ============================================================================

/**
 Строго типизированная функция обновления контекста
 */
export type StrictUpdate<T extends StrictContextDefinition> = (
  context: StrictUpdateParameters<T>
) => void

/**
 Внутренняя строго типизированная функция обновления
 */
export type StrictInternalUpdate<T extends StrictContextDefinition> = (
  ctx: StrictUpdateParameters<T>
) => StrictUpdateParameters<T>

/**
 Параметры для внутреннего обновления
 */
export type StrictUpdateContextParams<T extends StrictContextDefinition> = {
  ctx: StrictUpdateParameters<T>
  srcName?: string
  funcName?: string
}

// ============================================================================
// ОБРАТНАЯ СОВМЕСТИМОСТЬ
// ============================================================================

/**
 Совместимость со старой системой типов
 */
export type ContextDefinition = StrictContextDefinition
export type ContextData<T> = StrictContextData<T>
export type UpdateParameters<T> = StrictUpdateParameters<T>
export type Update<T> = StrictUpdate<T>
export type _Update<T> = StrictInternalUpdate<T>
export type UpdateContextParams<T> = StrictUpdateContextParams<T>
export type ContextTypes = StrictContextTypes