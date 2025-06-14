import meta from "./meta.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-test': Meta<State, Context>
  }
}
export type MetaForTest = typeof snapshot

export type State = typeof snapshot.state
export type Context = typeof snapshot.context
export type Types = typeof snapshot.types
export type Transitions = typeof snapshot.transitions

export interface Core {
}