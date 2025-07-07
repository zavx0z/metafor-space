/**
 * MetaFor — фасад для создания динамических типизированных контекстов
 * @packageDocumentation
 */

import { createContext } from "./context"
import type { ContextSchema, ExtractValues, UpdateValues, ContextTypes, JsonPatch } from "./context.t"

/**
 * Основная функция MetaFor
 * Создает экземпляр MetaFor с указанным именем (имя используется только для идентификации, не влияет на логику).
 * Возвращает объект с методом context для создания типизированного контекста.
 *
 * @param name - Имя контекста (произвольная строка, для идентификации)
 * @returns Объект с методом context для создания типизированного контекста
 *
 * @example
 * const userContext = MetaFor('user').context(types => ({
 *   name: types.string.required({ default: 'Гость' }),
 *   age: types.number.optional()
 * }))
 * userContext.context // доступ к значениям
 * userContext.update({ name: 'Иван' })
 */
export function MetaFor(name: string) {
  return {
    /**
     * Создает типизированный контекст на основе схемы.
     * @template T - Схема контекста
     * @param schema - Функция, принимающая types и возвращающая схему, либо сама схема
     * @returns Объект с иммутабельным контекстом и методом update
     *
     * @example
     * const context = MetaFor('user').context(types => ({
     *   name: types.string.required({ default: 'Гость' }),
     *   role: types.enum('user', 'admin').required({ default: 'user' }),
     *   nickname: types.string(),
     *   tags: types.array.optional()
     * }))
     * context.context.name // string (required)
     * context.context.role // 'user' | 'admin' (required)
     * context.context.nickname // string | null (optional)
     * context.context.tags // string[] | null (optional)
     */
    context<const T extends ContextSchema>(
      schema: ((types: ContextTypes) => T) | T
    ): {
      /** Текущее состояние контекста (только для чтения) */
      context: ExtractValues<T>
      /**
       * Обновляет значения в контексте
       * @param values - объект с новыми значениями
       * @returns Обновленный контекст
       *
       * @example
       * context.update({ name: 'Новое имя', nickname: 'nick' })
       * context.update({ nickname: null }) // для optional полей
       */
      update: (values: UpdateValues<ExtractValues<T>>) => ExtractValues<T>
      /**
       * Подписка на обновления контекста
       * @param cb - функция, вызываемая при обновлении контекста
       * @returns функция для отписки
       */
      onUpdate: (cb: (patches: JsonPatch[]) => void) => () => void
    } {
      return createContext(schema) as any
    },
  }
}
