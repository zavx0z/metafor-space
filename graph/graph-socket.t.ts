import GraphSocket from "./graph-socket"

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-socket': GraphSocket
  }
}