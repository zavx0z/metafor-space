import {MetaFor} from "../../metafor.js"
import "./node-meta-operator.js"
import "./node-meta-socket.js"

export default MetaFor("node-meta-condition")
  .states('init', 'ready')
  .context(t => ({
    tag: t.string({title: "Тэг meta"}),
    from: t.string({title: "Исходное состояние"}),
    to: t.string({title: "Текущее состояние"}),
  }))
  .core(() => ({}))
  .view({
    render: ({html}) => html`
      <metafor-node-meta-socket
        data-direction="input"
        data-active=${false}
      ></metafor-node-meta-socket>
      <slot name="operators"></slot>
      <slot></slot>
      <metafor-node-meta-socket
        data-direction="output"
        data-active=${false}
      ></metafor-node-meta-socket>
    `,
    style: ({css}) => css`
      :host {
        --shadow-size: 0.5 !important;
        
        background-color: rgba(var(--surface-400));
        padding: 4px 8px;
        position: absolute;
        display: flex;
        border-radius: 8px;
        flex-direction: row;
        align-items: center;
        gap: 2px;
        width: auto;
      }

      :host(:before) {
        background-color: rgba(var(--surface-400));
      }
    `
  })
  .transitions('init', [
    {
      in: "init",
      to: [{state: "ready", when: {tag: {isNull: false}}}]
    },
    {
      in: "ready",
      to: [{state: "init", when: {tag: {isNull: true}}}]
    }
  ])
  .reactions([])
  .create()