import meta from "./node-meta-context.js"
import type NodeMetaParam from "./node-meta-param"
import type NodeMetaSocket from "./node-meta-socket"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-context': Meta<typeof snapshot.state, typeof snapshot.types>
  }
}
export type Params = Map<typeof NodeMetaParam['id'], {
  param: typeof NodeMetaParam['context']['param']
  width: number
  height: number
  x: number
  y: number
}>

export type Sockets = Map<typeof NodeMetaSocket['id'], {
  direction: "west" | "east"
  param: string
  size: number
  x: number
  y: number
}>
