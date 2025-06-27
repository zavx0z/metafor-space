import {MetaFor} from "../../metafor.js"

export default MetaFor("node-meta-state", {development: true})
  .context(t => ({
    id: t.string({title: "ID meta"}),
    state: t.string({title: "Состояние"}),
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
    // {
    //   title: "вычисленное положение",
    //   filter: ({meta, patch}) => meta.tag === "node-layout"
    //     && patch.path === "/state"
    //     && patch.value === "ожидание"
    //   ,
    //   action({id, context, update}) {
    //     const data = sessionStorage.getItem(context.id)
    //     if (!data) {
    //       update({error: "Нет данных разметки"})
    //       return
    //     }
    //     /**@type{import("elkjs").ElkNode}*/
    //     const layout = JSON.parse(data)
    //     const layoutState = layout.children?.find(i => i.id === context.to)
    //     const layoutCondition = layoutState?.children?.find(i => i.id === id)
    //
    //     // @ts-ignore
    //     update({x: layoutState?.x + layoutCondition?.x, y: layoutState?.y + layoutCondition?.y})
    //     // console.log(layoutCondition)
    //   }
    // }
  ])
  .view({
    render: ({html}) => html`
      <slot></slot>
    `,
    style: ({css}) => css`
      :host {
        position: relative;
        display: flex;
        border-radius: 8px;
        flex-direction: row;
        align-items: center;
        gap: 2px;
        width: auto;
      }
    `
  })
