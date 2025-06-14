import {MetaFor} from "../../metafor.js"

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
    render: ({html, context, repeat}) => html`
      <metafor-node-meta-socket data-active=${false}></metafor-node-meta-socket>
      ${repeat(context.operators, i => html`
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