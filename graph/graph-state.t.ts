import meta from "./graph-state.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-state': Meta<typeof snapshot.state, typeof snapshot.types>
  }
}
