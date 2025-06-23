import ELK from "elkjs"
import {MetaFor} from "../../metafor.js"

export default MetaFor("node-elk")
  .states('init')
  .context(t => ({}))
  .core(() => ({
    elk: new ELK(),
    /**@type{Map<string, Map<number, any>>}*/
    meta: new Map()
  }))
  .transitions('init', [])
  .reactions([
    {
      title: "начало создания meta",
      filter: ({patch, meta}) =>
        meta.tag === "nodes-meta"
        && patch.path === '/context'
        // && patch.op === 'add'
        && patch.op === 'replace'
        && Object.hasOwn(patch.value, 'nodes')
        && patch.value.nodes.length
      ,
      action({patch, core}) {
        console.log("начало создания meta", patch)
      }
    },
    {
      title: "создание meta",
      filter: ({patch, meta}) =>
        meta.tag.includes('node-meta')
        && patch.path === "/"
        && patch.op === "add"
      ,
      action({meta, patch, core}) {
        let metaTag = core.meta.get(meta.tag)
        if (metaTag) {
          metaTag.set(meta.index, patch.value)
        } else {
          core.meta.set(meta.tag, new Map([[meta.index, patch.value]]))
          metaTag = core.meta.get(meta.tag)
        }
      }
    },
    {
      title: "конец создания meta",
      filter: ({patch, meta}) =>
        meta.tag === "nodes-meta"
        && patch.path === '/context'
        // && patch.op === 'remove'
        && patch.op === 'replace'
        && Object.hasOwn(patch.value, 'nodes')
        && !patch.value.nodes.length
      ,
      action({patch, core}) {
        console.log("конец создания meta", patch)
      }
    }
  ])
  .create()