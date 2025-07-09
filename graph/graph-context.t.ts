import GraphContext from "./graph-context.js"

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-context': typeof GraphContext
  }
}

/**
 * Типы для актора graph-context
 */

/** Параметры контекста */
export interface Params {
  [key: string]: any
}

/** Сокеты контекста */
export interface Sockets {
  [key: string]: any
}

/** Состояния актора */
export type States =
  | "рендер"
  | "измерение"
  | "позиционирование"
  | "неактивно"
  | "активно"
  | "в процессе"

/** Контекст актора */
export interface Context {
  id: string
  state: string
  error: string | null
  width: number | null
  height: number | null
  x: number | null
  y: number | null
  layout: boolean
  active: boolean
  process: boolean
}

/** Пример использования нового формата переходов */
export interface TransitionExample {
  to: {
    "позиционирование": { layout: true }
    "неактивно": { error: null, active: false }
    "активно": { error: null, active: true }
    "в процессе": { error: null, active: true, process: true }
  }
}
