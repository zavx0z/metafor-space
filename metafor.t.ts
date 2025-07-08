import type { JsonPatch, UpdateValues } from "./context.t"

declare global {
  /** Meta */
  export interface Meta<T> extends HTMLElement {
    context: T extends { context: infer C } ? C : never
    update: T extends { update: infer U } ? U : never
    onUpdate: T extends { onUpdate: infer O } ? O : never
    states: T extends { states: infer S } ? S : never
  }
}
export {}
