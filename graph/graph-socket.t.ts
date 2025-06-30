import meta from "./graph-socket.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-socket': Meta<typeof snapshot.state, typeof snapshot.types>
  }
}