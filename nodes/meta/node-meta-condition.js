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
      <slot></slot>
    `,
    style: ({css}) => css`
      :host {
        --shadow-size: 0.5 !important;
        --background-color: rgba(var(--surface-400)) !important;
        position: absolute;
        display: flex;
        border-radius: 4px;
        flex-direction: row;
        align-items: stretch;
        gap: 2px;
        width: auto;
      }

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