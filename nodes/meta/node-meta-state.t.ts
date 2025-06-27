import meta from "./node-meta-state.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-state': Meta<typeof snapshot.state, typeof snapshot.types>
  }
}
