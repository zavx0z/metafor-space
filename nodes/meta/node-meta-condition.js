import {MetaFor} from "../../metafor.js"
import "./node-meta-operator.js"

export default MetaFor("node-meta-condition")
  .states('init', 'ready')
  .context(t => ({
    port: t.string({title: "ID порта"}),
    operators: t.array({title: "Операторы сравнения"})
  }))
  .core(({context}) => /**@type{import("./node-meta-condition.t").Core<typeof context>}*/ ({
    data: {},
  }))
  .view({
    render: ({html, context, repeat, core}) => html`
      <metafor-node-meta-socket data-active=${false}></metafor-node-meta-socket>
      ${repeat(context.operators, id => html`
        <metafor-node-meta-operator
          id=${id}
          data=${{op: id, value: core.data[id].value}}
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
        update({operators: Object.keys(core.data)})
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