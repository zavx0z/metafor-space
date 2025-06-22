import ELK from "elkjs"
import {MetaFor} from "../../metafor.js"

export default MetaFor("node-elk")
  .states('init')
  .context(t => ({}))
  .core(() => ({
    elk: new ELK(),
  }))
  .transitions('init', [])
  .reactions([
    {
      filter: ({patch}) => patch.value.id === 'nodes-meta',
      action() {
      }
    }
  ])
  .create()