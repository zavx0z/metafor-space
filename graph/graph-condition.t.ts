import GraphCondition from "./graph-condition"

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-condition': typeof GraphCondition
  }
}