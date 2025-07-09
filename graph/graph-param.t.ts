import GraphParam from "./graph-param"

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-param': typeof GraphParam
  }
}