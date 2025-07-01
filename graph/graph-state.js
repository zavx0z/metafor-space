import {MetaFor} from "../metafor.js"

export default MetaFor("graph-state", {development: true})
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
  .states("рендер", "изменение размера", "перемещение")
  .transitions('рендер', [
    {
      in: "рендер",
      action({element}) {

      },
      to: [{state: "перемещение", when: {x: {isNull: false}, y: {isNull: false}}}]
    },
    {
      in: "перемещение",
      action({element, context}) {
        // element.style.cssText = `width: ${context.width}px; height: ${context.height}px;`
        element.style.transform = `translate(${context.x}px, ${context.y}px)`
      },
      to: []
    },
  ])
  .reactions([
    {
      title: "вычисленное положение",
      filter: ({meta, patch}) => meta.tag === "graph-layout"
        && patch.path === "/state"
        && patch.value === "ожидание"
      ,
      action({id, context, update}) {
        const data = sessionStorage.getItem(context.id)
        if (!data) {
          update({error: "Нет данных разметки"})
          return
        }
        /**@type{import("./graph-layout.t").LayoutResult}*/
        const layout = JSON.parse(data)
        const layoutState = layout.children?.find(i => i.id === context.state)
        if (!layoutState) {
          update({error: `Состояние ${context.state} не найдено в layout`})
          return
        }
        // console.log(layoutState)
        update({x: layoutState.x, y: layoutState.y, width: layoutState.width, height: layoutState.height})
        // console.log(layoutCondition)
      }
    }
  ])
  .view({
    render: ({html}) => html`
      <slot></slot>
    `,
    style: ({css}) => css`
      :host {
        position: relative;
        height: fit-content;
      }
    `
  })
