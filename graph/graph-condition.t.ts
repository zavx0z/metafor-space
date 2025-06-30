import meta from "./graph-condition.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-condition': Meta<typeof snapshot.state, typeof snapshot.types>
  }
}