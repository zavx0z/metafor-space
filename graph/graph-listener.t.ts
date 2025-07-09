import type GraphListener from "./graph-listener"

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-listener': typeof GraphListener
  }
}
