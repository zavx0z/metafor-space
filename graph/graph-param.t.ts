import meta from "./graph-param.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-param': Meta<typeof snapshot.state, typeof snapshot.types>
  }
}