import meta from "./node-meta-condition.js"
import type {Operators} from "./node-meta-operator.t.ts"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-condition': Meta<typeof snapshot.state, typeof snapshot.types>
  }
}
export type MetaForNodeMetaCondition = typeof snapshot

export interface Core {
  operators?: Operators
}