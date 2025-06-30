import meta from "./graph-meta.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta': Meta<typeof snapshot.state, typeof snapshot.types>
  }
}