import {MetaFor} from "../../metafor.js"
import "./node-meta-socket.js"

export default MetaFor("node-meta-condition", {development: true})
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
  .states("рендер", "измерение", "позиционирование")
  .transitions('рендер', [
    {
      in: "рендер",
      action({element}) {

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
      to: [{state: "позиционирование", when: {x: {isNull: false}, y: {isNull: false}}}]
    },
    {
      in: "позиционирование",
      action({element, context}) {
        element.style.transform = `translate(${context.x}px, ${context.y}px)`
      },
      to: []
    },
  ])
  .reactions([
    {
      title: "вычисленное положение",
      filter: ({meta, patch}) => meta.tag === "node-layout"
        && patch.path === "/state"
        && patch.value === "ожидание"
      ,
      action({id, context, update}) {
        const data = sessionStorage.getItem(context.id)
        if (!data) {
          update({error: "Нет данных разметки"})
          return
        }
        /**@type{import("elkjs").ElkNode}*/
        const layout = JSON.parse(data)
        const layoutState = layout.children?.find(i => i.id === context.to)
        const layoutCondition = layoutState?.children?.find(i => i.id === id)

        // @ts-ignore
        update({x: layoutCondition?.x, y: layoutCondition?.y})
        // console.log(layoutCondition)
      }
    }
  ])
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
        position: fixed;
        display: flex;
        border-radius: 8px;
        flex-direction: row;
        align-items: center;
        gap: 2px;
        min-width: max-content;
        height: fit-content;
      }

      :host(:before) {
        background-color: rgba(var(--surface-400));
      }
    `
  })
