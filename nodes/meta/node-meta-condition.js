import {MetaFor} from "../../metafor.js"
import "./node-meta-operator.js"
import "./node-meta-socket.js"

export default MetaFor("node-meta-condition", {development: true})
  .states("рендер", "измерение", "установка положения")
  .context(t => ({
    id: t.string({title: "ID meta"}),
    from: t.string({title: "Исходное состояние"}),
    to: t.string({title: "Текущее состояние"}),
    param: t.string({title: "Ключ параметра"}),
    error: t.string({nullable: true}),
    width: t.number({nullable: true}),
    height: t.number({nullable: true}),
    x: t.number({nullable: true}),
    y: t.number({nullable: true}),
  }))
  .core(() => ({}))
  .transitions('рендер', [
    {
      in: "рендер",
      action({element}){

      },
      to: [{state: "измерение", when: {error: null}}]
    },
    {
      in: "измерение",
      action({element, update}) {
        requestAnimationFrame(() => {
          const {width, height} = element.getBoundingClientRect()
          update({width: Math.round(width), height: Math.round(height)})
        })
      },
      to: [{state: "установка положения", when: {x: {isNull: false}, y: {isNull: false}}}]
    },
    {
      in: "установка положения",
      action() {
        console.log()
      },
      to: []
    },
  ])
  .reactions([])
  .view({
    render: ({html, context}) => html`
      <metafor-node-meta-socket
        context=${{
      id: context.id,
      state: context.to,
      param: context.param,
      parent: "condition",
      direction: "west"
    }}
        data-direction="input"
        data-active=${false}
      ></metafor-node-meta-socket>
      <slot></slot>
      <metafor-node-meta-socket
        context=${{
      id: context.id,
      state: context.to,
      param: context.param,
      parent: "condition",
      direction: "east"
    }}
        data-direction="output"
        data-active=${false}
      ></metafor-node-meta-socket>
    `,
    style: ({css}) => css`
      :host {
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
