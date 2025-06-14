import meta from "./node-meta-socket.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-socket': Meta<typeof snapshot.state, typeof snapshot.context>
  }
}
export type MetaForNodeMetaSocket = typeof snapshot

export interface Core {
}