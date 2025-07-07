/**
 * MetaFor - библиотека для создания динамических контекстов с типизированными параметрами
 * @packageDocumentation
 */

import { types } from "./context"
import type { ContextSchema, ExtractValues, UpdateValues, ContextTypes } from "./context.t"

/**
 * Основная функция MetaFor
 * Создает экземпляр MetaFor с указанным именем
 * @param name - имя контекста
 * @returns Объект с методом context для создания типизированного контекста
 *
 * @example
 * ```typescript
 * const userContext = MetaFor('user').context(types => ({
 *   name: types.string.required({ default: 'Гость' }),
 *   age: types.number.optional()
 * }))
 * ```
 */
export function MetaFor(name: string) {
  return {
    /**
     * Создает типизированный контекст на основе схемы
     * @template T - схема контекста
     * @param schema - функция, принимающая types и возвращающая схему
     * @returns Объект с контекстом и методом update
     *
     * @example
     * ```typescript
     * const context = MetaFor('user').context(types => ({
     *   name: types.string.required({ default: 'Гость' }),
     *   role: types.enum('user', 'admin').required({ default: 'user' }),
     *   nickname: types.string(),
     *   tags: types.array<string>()
     * }))
     *
     * // context.context.name - string (required)
     * // context.context.role - 'user' | 'admin' (required)
     * // context.context.nickname - string | null (optional)
     * // context.context.tags - string[] | null (optional)
     * ```
     */
    context<const T extends ContextSchema>(
      schema: ((types: ContextTypes) => T) | T
    ): {
      /** Текущее состояние контекста */
      context: ExtractValues<T>
      /**
       * Обновляет значения в контексте
       * @param values - объект с новыми значениями
       * @returns Обновленный контекст
       *
       * @example
       * ```typescript
       * context.update({ name: 'Новое имя', nickname: 'nick' })
       * context.update({ nickname: null }) // для optional полей
       */
      update: (values: UpdateValues<ExtractValues<T>>) => ExtractValues<T>
    } {
      const actualSchema = typeof schema === "function" ? (schema as any)(types) : schema as T
      const context = {} as ExtractValues<T>
      for (const key in actualSchema) {
        const definition = actualSchema[key]
        if (!definition) continue
        if ("default" in definition && definition.default !== undefined) {
          ;(context as any)[key] = definition.default
        } else {
          const isRequired = definition.required === true
          switch (definition.type) {
            case "string": (context as any)[key] = isRequired ? "" : null; break
            case "number": (context as any)[key] = isRequired ? 0 : null; break
            case "boolean": (context as any)[key] = isRequired ? false : null; break
            case "array": (context as any)[key] = isRequired ? [] : null; break
            case "enum":
              const enumDef = definition as any
              ;(context as any)[key] = isRequired ? enumDef.values[0] : null
              break
          }
        }
      }
      function update(values: UpdateValues<ExtractValues<T>>): ExtractValues<T> {
        const filteredValues = Object.fromEntries(
          Object.entries(values).filter(([_, value]) => value !== undefined)
        ) as Partial<ExtractValues<T>>
        Object.assign(context, filteredValues)
        return { ...context }
      }
      return { context, update }
    },
  }
}
