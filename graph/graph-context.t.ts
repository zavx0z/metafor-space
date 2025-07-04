import meta from "./graph-context.js"
import type  GraphParam from "./graph-param"
import type GraphSocket from "./graph-socket"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-graph-context': Meta<typeof snapshot.state, typeof snapshot.types>
  }
}

export type Params = Map<typeof GraphParam['id'], {
  param: typeof GraphParam['context']['param']
  width: number
  height: number
  x: number
  y: number
}>

export type Sockets = Map<typeof GraphSocket['id'], {
  direction: "west" | "east"
  param: string
  size: number
  x: number
  y: number
}>
