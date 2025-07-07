/**
 * Тип StateTransitions — переходы только к ключам из T
 */
export type StateTransitions<T extends string> = {
  [K in T]?: {} // второй уровень — пустой объект
}

/**
 * Конфигурация одного состояния
 */
export type StateDefinition<T extends string> = {
  action?: () => void
  to: StateTransitions<T>
}

/**
 * Конфигурация всех состояний
 */
export type StateConfig<T extends string> = Record<T, StateDefinition<T>>
