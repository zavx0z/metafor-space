import meta from "./node-meta-condition.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-condition': Meta<typeof snapshot.state, typeof snapshot.types>
  }
}

export interface Core<C extends Record<string, unknown>> {
  operators: Record<keyof C['operators'], {
    symbol: string,
    title: string,
    value: any
  }>
}