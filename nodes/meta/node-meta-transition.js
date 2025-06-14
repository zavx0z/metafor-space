import {MetaFor} from "../../metafor.js"
import "./node-meta-condition.js"
import {repeat} from "../../html/directives/repeat.js"

export default MetaFor("node-meta-transition")
  .states('init', 'ready')
  .context(t => ({
    conditions: t.array({default: []})
  }))
  .core(() => /**@type{import("./node-meta-transition.t.js").Core}*/({
    conditions: null
  }))
  .view({
    render: ({html, context}) => repeat(context.conditions, c => html`
      <metafor-meta-condition id=${c}/>
    `),
    style: ({css}) => css`
      :host {
        --shadow-size: 0.5 !important;
        --background-color: rgba(var(--surface-400)) !important;
        position: absolute;
        display: flex;
        border-radius: 4px;
        flex-direction: column;
        align-items: stretch;
        gap: 2px;
        width: auto;
      }
    `
  })
  .transitions('init', [
    {
      in: "init",
      action: ({core, update}) => {

      },
      to: [{state: "ready", when: {conditions: {isEmpty: false}}}]
    }
  ])
  .reactions([])
  .create()