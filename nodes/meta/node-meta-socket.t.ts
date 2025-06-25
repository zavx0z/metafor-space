import meta from "./node-meta-socket.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-socket': Meta<typeof snapshot.state, typeof snapshot.types>
  }
}
export type MetaSocket = typeof snapshot

export interface Core {
}