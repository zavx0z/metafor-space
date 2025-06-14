import meta from "./node-meta-state.js"
import type {ContextDefinition, ContextData} from "../../types/context.ts"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-state': Meta<typeof snapshot.state, typeof snapshot.context>
  }
}

export interface Core {
  data: null | {
    types: ContextDefinition
    context: ContextData<any>
  }
}