import type { ContextSchema, ContextInstance } from "./context.t"
import type { StateConfig } from "./state.t"

export type ContextWithStateConfig<T extends ContextSchema, S extends string> = ContextInstance<T> & {
  stateConfig: StateConfig<S>
}
