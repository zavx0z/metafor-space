/**
 * Модуль для создания типизированных контекстов и схем параметров
 * @packageDocumentation
 */

import type { ContextTypes, ContextSchema, ExtractValues, UpdateValues } from './context.t'

const createStringType = {
  required: (params = {}) => ({ type: 'string' as const, required: true as const, ...params }),
  optional: (params = {}) => ({ type: 'string' as const, required: false as const, ...params }),
}
const createNumberType = {
  required: (params = {}) => ({ type: 'number' as const, required: true as const, ...params }),
  optional: (params = {}) => ({ type: 'number' as const, required: false as const, ...params }),
}
const createBooleanType = {
  required: (params = {}) => ({ type: 'boolean' as const, required: true as const, ...params }),
  optional: (params = {}) => ({ type: 'boolean' as const, required: false as const, ...params }),
}
const createArrayType = {
  required: (params = {}) => ({ type: 'array' as const, required: true as const, ...params }),
  optional: (params = {}) => ({ type: 'array' as const, required: false as const, ...params }),
}

/**
 * Набор фабрик для создания описаний типов параметров контекста.
 * Используется для построения схемы контекста.
 *
 * @example
 * const schema = {
 *   name: types.string.required({ default: 'Гость' }),
 *   age: types.number.optional(),
 *   role: types.enum('user', 'admin').required({ default: 'user' })
 * }
 */
export const types: ContextTypes = {
  string: Object.assign((params = {}) => createStringType.optional(params), createStringType),
  number: Object.assign((params = {}) => createNumberType.optional(params), createNumberType),
  boolean: Object.assign((params = {}) => createBooleanType.optional(params), createBooleanType),
  array: Object.assign((params = {}) => createArrayType.optional(params), createArrayType),
  enum: <const T extends readonly (string | number)[]>(...values: T) => {
    const enumBase = {
      required: (options = {}) => ({ type: 'enum' as const, required: true as const, values, ...options }),
      optional: (options = {}) => ({ type: 'enum' as const, required: false as const, values, ...options }),
    }
    return Object.assign((options = {}) => enumBase.optional(options), enumBase)
  }
}

/**
 * Класс для работы с типизированными контекстами.
 * Позволяет создавать, читать, обновлять и клонировать контекст на основе схемы.
 *
 * @typeParam T - Схема контекста (ContextSchema)
 *
 * @example
 * const schema = { name: types.string.required() }
 * const ctx = new Context(schema)
 * ctx.context // доступ к значениям
 * ctx.update({ name: 'Новое имя' })
 */
export class Context<T extends ContextSchema> {
  /** @internal */
  private contextData: ExtractValues<T>
  /** @internal */
  private immutableContext: ExtractValues<T>

  /**
   * Создает новый экземпляр контекста на основе схемы.
   * @param schema - Схема контекста
   */
  constructor(schema: T) {
    this.contextData = {} as ExtractValues<T>
    this.initializeContext(schema)
    this.immutableContext = this.createImmutableContext()
  }

  /**
   * Инициализирует значения контекста по умолчанию согласно схеме.
   * @param schema - Схема контекста
   */
  private initializeContext(schema: T): void {
    for (const key in schema) {
      const definition = schema[key]
      if (!definition) continue
      
      if ("default" in definition && definition.default !== undefined) {
        ;(this.contextData as any)[key] = definition.default
      } else {
        const isRequired = definition.required === true
        switch (definition.type) {
          case "string": 
            ;(this.contextData as any)[key] = isRequired ? "" : null
            break
          case "number": 
            ;(this.contextData as any)[key] = isRequired ? 0 : null
            break
          case "boolean": 
            ;(this.contextData as any)[key] = isRequired ? false : null
            break
          case "array": 
            ;(this.contextData as any)[key] = isRequired ? [] : null
            break
          case "enum":
            const enumDef = definition as any
            ;(this.contextData as any)[key] = isRequired ? enumDef.values[0] : null
            break
        }
      }
    }
  }

  /**
   * Создает иммутабельный (только для чтения) прокси-объект для доступа к значениям контекста.
   * @returns Иммутабельный объект контекста
   */
  private createImmutableContext(): ExtractValues<T> {
    const immutableContext = new Proxy({} as ExtractValues<T>, {
      get: (target, prop) => {
        return (this.contextData as any)[prop]
      },
      set: (target, prop, value) => {
        throw new Error(`Прямое изменение контекста запрещено. Используйте метод update() для изменения значений. Попытка изменить: ${String(prop)}`)
      },
      deleteProperty: (target, prop) => {
        throw new Error(`Удаление свойств контекста запрещено. Попытка удалить: ${String(prop)}`)
      }
    })

    Object.freeze(immutableContext)
    return immutableContext
  }

  /**
   * Текущее состояние контекста (только для чтения).
   * @readonly
   */
  get context(): ExtractValues<T> {
    return this.immutableContext
  }

  /**
   * Обновляет значения в контексте.
   * Только переданные значения будут обновлены, остальные останутся без изменений.
   *
   * @param values - Объект с новыми значениями
   * @returns Обновленный контекст
   *
   * @example
   * context.update({ name: 'Новое имя', age: 30 })
   */
  update(values: UpdateValues<ExtractValues<T>>): ExtractValues<T> {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== undefined)
    ) as Partial<ExtractValues<T>>
    Object.assign(this.contextData, filteredValues)
    return { ...this.contextData }
  }

  /**
   * Создает новый экземпляр контекста с текущими значениями (глубокое копирование).
   * @returns Новый экземпляр Context
   */
  clone(): Context<T> {
    const newContext = new Context({} as T)
    newContext.contextData = { ...this.contextData }
    newContext.immutableContext = newContext.createImmutableContext()
    return newContext
  }
}

/**
 * Фабричная функция для создания типизированного контекста.
 * Позволяет создавать контекст на основе схемы или функции, принимающей types.
 *
 * @typeParam T - Схема контекста (ContextSchema)
 * @param schema - Схема контекста или функция, принимающая types и возвращающая схему
 * @returns Объект с иммутабельным контекстом и методом update
 *
 * @example
 * const ctx = createContext(types => ({ name: types.string.required() }))
 * ctx.context // доступ к значениям
 * ctx.update({ name: 'Новое имя' })
 */
export function createContext<const T extends ContextSchema>(
  schema: ((types: ContextTypes) => T) | T
): {
  /** Текущее состояние контекста (только для чтения) */
  context: ExtractValues<T>
  /**
   * Обновляет значения в контексте
   * @param values - объект с новыми значениями
   * @returns Обновленный контекст
   */
  update: (values: UpdateValues<ExtractValues<T>>) => ExtractValues<T>
} {
  const actualSchema = typeof schema === "function" ? (schema as any)(types) : schema as T
  const contextInstance = new Context(actualSchema)
  
  return {
    get context() {
      return contextInstance.context
    },
    update: (values: UpdateValues<ExtractValues<T>>) => contextInstance.update(values)
  }
}


