import meta from "./node-meta-param.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-param': Meta<typeof snapshot.state, typeof snapshot.types>
  }
}
export type MetaForNodeMetaParam = typeof snapshot

export interface Core {
}