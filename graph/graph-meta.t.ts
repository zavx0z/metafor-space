import type GraphMeta from "./graph-meta"

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta': typeof GraphMeta
  }
}

/**
 * Типы для актора graph-meta
 */

/**
 * Точка координат
 */
export interface Point {
  x: number
  y: number
}

/**
 * Ребро графа с типизированными точками
 */
export interface Edge {
  id: string
  points: Point[]
  type: "east-input" | "west" | "other"
  internal?: boolean
}

/**
 * Результат layout для graph-meta
 */
export interface MetaLayoutResult {
  width: number
  height: number
  edges?: Edge[]
}

/**
 * Создает SVG путь с простыми скруглениями
 */
export type GetSimpleRoundedPath = (points: Point[], radius: number) => string

/**
 * Собирает все рёбра из ELK layout
 */
export type CollectEdges = (layout: import('elkjs').ElkNode) => Edge[]