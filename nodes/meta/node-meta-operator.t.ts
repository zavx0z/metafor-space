import meta from "./node-meta-operator.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-operator': Meta<typeof snapshot.state, typeof snapshot.context>
  }
}
export type MetaForNodeMetaOperator = typeof snapshot

export interface Core {
  data?: Operators
}

export type Operators = Record<string, {
  symbol: string,
  title: string,
  value: any
}>