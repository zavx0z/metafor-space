import meta from "./node-meta-operator.js"
import type {Operator} from "./node-meta-transition.t.ts"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-operator': Meta<typeof snapshot.state, typeof snapshot.context>
  }
}
export type MetaForNodeMetaOperator = typeof snapshot

export interface Core {
  data?: Operator
}