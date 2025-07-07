/**
 * Тип StateTransitions — переходы только к ключам из T
 */
export type StateTransitions<T extends string> = {
  [K in T]?: {} // второй уровень — пустой объект
}

/**
 * Конфигурация одного состояния
 */
import type { UpdateValues, ExtractValues, ContextSchema } from "./context.t"

export type StateProcess<T extends ContextSchema = any> = {
  action: (params: { context: ExtractValues<T> }) => void
  error: (params: { update: (values: UpdateValues<ExtractValues<T>>) => ExtractValues<T> }) => void
  success?: (params: { update: (values: UpdateValues<ExtractValues<T>>) => ExtractValues<T> }) => void
}

export type StateDefinition<T extends string, C extends ContextSchema = any> = {
  process?: StateProcess<C>
  to: StateTransitions<T>
}

/**
 * Конфигурация всех состояний
 */
export type StateConfig<T extends string, C extends ContextSchema = any> = Record<T, StateDefinition<T, C>>
