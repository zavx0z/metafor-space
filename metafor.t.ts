import type { ContextSchema, ContextInstance, ExtractValues, UpdateValues } from "./context.t"
import type { StateConfig } from "./state.t"

export type ContextWithStateConfig<T extends ContextSchema, S extends string> = {
  view(): {
    context: ExtractValues<T>
    update: (values: UpdateValues<ExtractValues<T>>) => ExtractValues<T>
    onUpdate: (callback: (patches: any[]) => void) => () => void
    stateConfig: StateConfig<S, T>
  }
}
