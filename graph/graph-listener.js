// @ts-nocheck
import {MetaFor} from "../metafor.js"
import {template} from "./graph-listener.actions.js"

export default MetaFor("graph-listener", {
  description: "Отслеживает добавление и удаление акторов",
})
  .context(t => ({
    op: t.enum("add").optional()({title: "Тип патча"),
    nodes: t.array.required()({title: "Коллекция meta"}),
    error: t.string.optional()({title: "Ошибка"}),
  }))
  .states({
    "ожидание патча": {
      to: {"добавление актора": {op: "add"}}
    },
    "добавление актора": {
      action: ({element, core, context}) => {
        if (!core.snapshot) throw new Error(`Отсутствует снимок meta - ${context.nodes[context.nodes.length]}`)
        /**@type{import("../metafor").Snapshot<any, any, any>}*/
        const snapshot = core.snapshot
        render(template(snapshot, core.instance), element)
        core.snapshot = null
        return {nodes: context.nodes.slice(1)}
      },
      to: {
        "ожидание патча": {nodes: {isEmpty: true}},
        "добавление актора": {nodes: {isEmpty: false}}
      }
    }
  })
  .core(() => { // TODO: update перенести в функции
    // document.addEventListener("channel", (ev) => {
    //   const {detail} = /** @type {CustomEvent} */ (ev)
    //   const {meta, patch} =  /**@type {import("../metafor.d.ts").Message}*/(detail)
    //   if (
    //     patch.op === "add"
    //     && !meta.tag.includes("graph-")
    //     && !meta.tag.includes("input-")
    //   ) {
    //     self.snapshot = patch.value
    //     self.instance = ev.target
    //     update({op: "add", nodes: [...context.nodes, patch.value.id]})
    //   }
    // })
    return {
      /**@type{SnapshotAny|null}*/
      snapshot: null,
      /**@type{MetaAny|null}*/
      instance: null
    }
  })
  .processes(process => ({
    "добавление актора": process().action(({element, core, context}) => {
      if (!core.snapshot) throw new Error(`Отсутствует снимок meta - ${context.nodes[context.nodes.length]}`)
      /**@type{import("../metafor").Snapshot<any, any, any>}*/
      const snapshot = core.snapshot
      render(template(snapshot, core.instance), element)
      core.snapshot = null
    })
  }))
  .reactions({})

  .view({
    render: ({html}) => html`
      <slot></slot>`
  })
