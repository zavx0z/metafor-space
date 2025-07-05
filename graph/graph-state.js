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
  .core(() => ({
    /**@type{MetaAny|null}*/
    meta: null
  }))
  .reactions({
    "вычисленное положение": {
      filter: ({meta, patch}) => meta.tag === "graph-layout"
        && patch.path === "/state"
        && patch.value === "ожидание"
      ,
      action({context, update}) {
        const data = sessionStorage.getItem(context.id)
        if (!data) {
          update({error: "Нет данных разметки"})
          return
        }
        /**@type{import("./graph-layout.t").TypedLayoutResult}*/
        const layout = JSON.parse(data)
        const stateGroup = layout.children.find(group => group.id === context.state)
        if (!stateGroup) {
          update({error: `Состояние ${context.state} не найдено в layout`})
          return
        }
        update({x: stateGroup.x, y: stateGroup.y, width: stateGroup.width, height: stateGroup.height})
      }
    }
  })
  .states("рендер", "изменение размера", "перемещение")
  .transitions('рендер', {
    "рендер": {
      to: {"перемещение": {x: {isNull: false}, y: {isNull: false}}}
    },
    "перемещение": {
      action({element, context}) {
        // element.style.cssText = `width: ${context.width}px; height: ${context.height}px;`
        element.style.transform = `translate(${context.x}px, ${context.y}px)`
      },
      to: {}
    }
  })
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
