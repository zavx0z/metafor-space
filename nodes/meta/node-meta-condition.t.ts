import meta from "./node-meta-condition.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-condition': Meta<typeof snapshot.state, typeof snapshot.context>
  }
}
export type MetaForNodeMetaCondition = typeof snapshot

export interface Core {
}