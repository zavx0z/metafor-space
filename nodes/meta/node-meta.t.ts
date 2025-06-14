import meta from "./node-meta.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta': Meta<typeof snapshot.state, typeof snapshot.context>
  }
}
export type MetaForNodeMeta = typeof snapshot

export interface Core {
}