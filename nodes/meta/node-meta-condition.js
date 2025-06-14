import {MetaFor} from "../../metafor.js"
import {repeat} from "../../html/directives/repeat.js"

export default MetaFor("node-meta-condition")
  .states('init','ready')
  .context(t => ({
    id: t.string({}),
    port: t.string({title: "ID порта"}),
    operators: t.array({default: []})
  }))
  .core(() => /**@type{import("./node-meta-condition.t").Core}*/ ({
    data: null
  }))
  .view({
    render: ({html, context}) => html`
      <metafor-node-meta-socket data-active=${false}></metafor-node-meta-socket>
      ${repeat(context.operators, i => i, i => html`
        <span class="noselect">
          <span>${"symbol"}</span>
          <span>${String("name")} - ${String("value")}</span>
        </span>
      `)}
    `,
    style: ({css}) => css`
      :host(:before) {
        --background-color: rgba(var(--surface-400));
      }
    `
  })
  .transitions('init', [])
  .reactions([])
  .create()