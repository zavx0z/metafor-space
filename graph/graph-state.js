import { MetaFor } from "../metafor.js"

export default MetaFor("graph-state")
  .context((t) => ({
    id: t.string.required()({ title: "ID meta" }),
    state: t.string.required()({ title: "Состояние" }),
    error: t.string.optional()({ title: "Ошибка" }),
    width: t.number.optional()({ title: "Ширина" }),
    height: t.number.optional()({ title: "Высота" }),
    x: t.number.optional()({ title: "X" }),
    y: t.number.optional()({ title: "Y" }),
  }))
  .states({
    рендер: {
      перемещение: { x: { null: false }, y: { null: false } },
    },
    перемещение: {},
  })
  .core(() => ({
    /**@type{any}*/
    meta: null,
  }))
  .processes((process) => ({
    перемещение: process().action(({ element, context }) => {
      element.style.transform = `translate(${context.x}px, ${context.y}px)`
    }),
  }))
  .reactions((reaction) => [
    [
      ["рендер", "перемещение"],
      reaction({ title: "Вычисленное положение" })
        .filter({
          tag: "graph-layout",
          path: "/state",
          value: "ожидание",
        })
        .equal(({ context, update }) => {
          const data = sessionStorage.getItem(context.id)
          if (!data) {
            update({ error: "Нет данных разметки" })
            return
          }
          /**@type{import("./graph-layout.t").TypedLayoutResult}*/
          const layout = JSON.parse(data)
          const stateGroup = layout.children.find((group) => group.id === context.state)
          if (!stateGroup) {
            update({ error: `Состояние ${context.state} не найдено в layout` })
            return
          }
          update({ x: stateGroup.x, y: stateGroup.y, width: stateGroup.width, height: stateGroup.height })
        }),
    ],
  ])
  .view({
    render: ({ html }) => html` <slot></slot> `,
    style: ({ css }) => css`
      :host {
        position: relative;
        height: fit-content;
      }
    `,
  })
