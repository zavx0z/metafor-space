import meta from "./node-meta-transition.js"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-transition': Meta<typeof snapshot.state, typeof snapshot.context>
  }
}
export type MetaForNodeMetaTransition = typeof snapshot

export interface Core {
  conditions: ConditionsTransitionPortsData | null
}

/** Данные условий перехода для входных портов. */
export type ConditionsTransitionPortsData = {
  id: string,
  ports: Array<{
    id: string,
    operators: {
      [key: string]: {
        symbol: string,
        title: string,
        value: any
      }
    }
  }>
}
