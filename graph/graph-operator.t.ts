import meta from "./graph-operator.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-operator': Meta<typeof snapshot.state, typeof snapshot.types>
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