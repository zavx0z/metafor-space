import {MetaFor} from "../../metafor.js"
import "./node-meta-operator.js"

export default MetaFor("node-meta-condition")
  .states('init', 'ready')
  .context(t => ({
    port: t.string({title: "ID порта"}),
    operators: t.array({title: "Операторы сравнения"})
  }))
  .core(() => ({}))
  .view({
    render: ({html}) => html`
      <metafor-node-meta-socket data-active=${false}></metafor-node-meta-socket>
      <slot name="operators"></slot>
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
      to: [{state: "ready", when: {operators: {isEmpty: false}}}]
    },
    {
      in: "ready",
      to: [{state: "init", when: {operators: {isEmpty: true}}}]
    }
  ])
  .reactions([])
  .create()