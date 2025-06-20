import meta from "./node-meta-condition.js"
import type {Port} from "./node-meta-transition.t.ts"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-condition': Meta<typeof snapshot.state, typeof snapshot.context>
  }
}
export type MetaForNodeMetaCondition = typeof snapshot

export interface Core {
  operators?: Port['operators']
}