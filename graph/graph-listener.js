import {MetaFor} from "../metafor.js"
import {render} from "../html/html.js"
import {template} from "./graph-listener.actions.js"

export default MetaFor("graph-listener", {
  description: "Отслеживает добавление и удаление акторов",
  development: true
})
  .context(t => ({
    op: t.enum("add")({title: "Тип патча", nullable: true}),
    nodes: t.array({title: "Коллекция meta"}),
    error: t.string({title: "Ошибка", nullable: true}),
  }))
  .core(({self, context, update}) => { // TODO: update перенести в функции
    document.addEventListener("channel", (ev) => {
      const {detail} = /** @type {CustomEvent} */ (ev)
      const {meta, patch} =  /**@type {import("../metafor.js").BroadcastMessage}*/(detail)
      if (
        patch.op === "add"
        && !meta.tag.includes("graph-")
        && !meta.tag.includes("input-")
      ) {
        self.snapshot = patch.value
        self.instance = ev.target
        update({op: "add", nodes: [...context.nodes, patch.value.id]})
      }
    })
    return {
      /**@type{SnapshotAny|null}*/
      snapshot: null,
      /**@type{MetaAny|null}*/
      instance: null
    }
  })
  .reactions({})
  .states("ожидание патча", "добавление актора")
  .transitions("ожидание патча", {
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
  .view({
    render: ({html}) => html`
      <slot></slot>`
  })
