import meta from "./node-meta-conditions.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-conditions': Meta<typeof snapshot.state, typeof snapshot.context>
  }
}
export type MetaForNodeMetaConditions = typeof snapshot

export interface Core {
}