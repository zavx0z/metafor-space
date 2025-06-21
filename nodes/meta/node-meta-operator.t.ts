import meta, {operatorSymbols} from "./node-meta-operator.js"
import type {StringEnumDefinition} from "../../types/context.ts"

const snapshot = meta.snapshot()
type ContextTypes = typeof snapshot.types
type ContextData = typeof snapshot.context.op

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-operator': Meta<typeof snapshot.state, ContextTypes>
  }
}
export type MetaForNodeMetaOperator = typeof snapshot

export interface Core {
  data?: Operators
  // data?: Record<keyof typeof operatorSymbols, string>
  operators: typeof operatorSymbols
  // operators: Record<StringEnumDefinition<any, any>>
}
export type Operators = Record<string, {
  symbol: string,
  title: string,
  value: any
}>