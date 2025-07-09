import type GraphState from "./graph-state"

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-state': typeof GraphState
  }
}
