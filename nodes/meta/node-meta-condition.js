import {MetaFor} from "../../metafor.js"
import "./node-meta-operator.js"

export default MetaFor("node-meta-condition")
  .states('init', 'ready')
  .context(t => ({
    port: t.string({title: "ID порта"}),
    operators: t.array({title: "Операторы сравнения", default: []})
  }))
  .core(() => /**@type{import("./node-meta-condition.t").Core}*/ ({
    operators: undefined
  }))
  .view({
    render: ({html, context, repeat, core}) => html`
      <metafor-node-meta-socket data-active=${false}></metafor-node-meta-socket>
      ${repeat(context.operators, id => html`
        <metafor-node-meta-operator
          id=${id}
          .core=${{data: core.operators?.[id]}}
        />
      `)}
    `,
    style: ({css}) => css`
      :host(:before) {
        --background-color: rgba(var(--surface-400));
      }
    `
  })
  .transitions('init', [
    {
      in: "init",
      action({update, core}) {
        if (core.operators)
          update({operators: Object.keys(core.operators)})
      },
      to: [{state: "ready", when: {operators: {isEmpty: false}}}]
    },
    {
      in: "ready",
      to: [{state: "init", when: {operators: {isEmpty: true}}}]
    }
  ])
  .reactions([])
  .create()