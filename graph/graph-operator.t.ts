import GraphOperator from "./graph-operator"

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-operator': typeof GraphOperator
  }
}

export interface Core<C extends Record<string, unknown>> {
  operators: Record<keyof C['op'], {
    symbol: string,
    title: string,
    value: any
  }>
  data?: { op: keyof C['op'], value: unknown }
  // init({op, value}: { op: keyof C['op'], value: unknown }): void
}

export type Operators = Record<string, {
  symbol: string,
  title: string,
  value: any
}>