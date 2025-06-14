import meta from "./node-meta-state.js"
import type {Context, Types} from "../dev/meta.t.ts"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-state': Meta<typeof snapshot.state, typeof snapshot.context>
  }
}

export interface Core {
  data: null | {
    types: Types
    context: Context
  }
}