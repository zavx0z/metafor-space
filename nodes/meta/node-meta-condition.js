import {MetaFor} from "../../metafor.js"

export default MetaFor("node-meta-condition")
  .states('ready')
  .context(t => ({}))
  .core()
  .view({
    render: ({html}) => html``,
    style: ({css}) => css``
  })
  .transitions('ready', [])
  .reactions([])
  .create()