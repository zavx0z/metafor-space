import meta from "./nodes-meta.js"
import type {ELK} from "elkjs/lib/elk-api"
import type {MetaForTest} from "../dev/meta.t.ts"

const snapshot = meta.snapshot()

export type MetaForNodesMeta = Meta<typeof snapshot.state, typeof snapshot.context>

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-nodes-meta': MetaForNodesMeta
  }
}

export interface Core {
  elk: ELK
  snapshot: null | MetaForTest
}