import type GraphNodes from "./graph-nodes"

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-nodes': typeof GraphNodes
  }
}
