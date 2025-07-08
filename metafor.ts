/**
 * MetaFor — фасад для создания динамических типизированных контекстов
 * @packageDocumentation
 */

import { createContext } from "./context"
import type { ContextSchema, ContextTypes, ContextInstance } from "./context.t"
import type { StateConfig } from "./state.t"
import type { ViewConfig as ViewConfig } from "./view.t"

/**
 * Основная функция MetaFor
 * Создает экземпляр MetaFor с указанным именем (имя используется только для идентификации, не влияет на логику).
 * Возвращает объект с методом context для создания типизированного контекста.
 *
 * @param tag - Имя актора
 * @returns Объект с методом context для создания типизированного контекста
 *
 * @example
 * const userContext = MetaFor('user').context(types => ({
 *   name: types.string.required({ default: 'Гость' }),
 *   age: types.number.optional()
 * })).state({})
 * userContext.context // доступ к значениям
 * userContext.update({ name: 'Иван' })
 */
export function MetaFor(tag: string) {
  return {
    /**
     * Создает типизированный контекст на основе схемы.
     * @template T - Схема контекста
     * @param schema - Функция, принимающая types и возвращающая схему, либо сама схема
     * @returns Объект с методом state для создания состояния
     *
     * @example
     * const context = MetaFor('user').context(types => ({
     *   name: types.string.required({ default: 'Гость' }),
     *   role: types.enum('user', 'admin').required({ default: 'user' }),
     *   nickname: types.string(),
     *   tags: types.array.optional()
     * })).state({})
     * context.context.name // string (required)
     * context.context.role // 'user' | 'admin' (required)
     * context.context.nickname // string | null (optional)
     * context.context.tags // string[] | null (optional)
     */
    context<const T extends ContextSchema>(schema: ((types: ContextTypes) => T) | T) {
      const { context, update, onUpdate } = createContext(schema) as ContextInstance<T>
      return {
        /**
         * Создает состояние контекста с возможностью управления переходами
         * @param states - Конфигурация состояний и переходов
         * @returns Объект с иммутабельным контекстом и методами update и onUpdate
         */
        states<S extends string>(states: StateConfig<S, T>) {
          return {
            view(view?: ViewConfig<T>) {
              return {
                context,
                update,
                onUpdate,
                stateConfig: states
              }
            },
          }
        },
      }
    },
  }
}
