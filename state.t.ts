/**
 * Тип StateTransitions — переходы только к ключам из T
 */
export type StateTransitions<T extends string> = {
  [K in T]?: {} // второй уровень — пустой объект
}

export type StateConfig<T extends string> = Record<T, StateTransitions<T>>
