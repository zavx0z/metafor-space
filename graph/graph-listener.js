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
      snapshot: null,
      /**@type{MetaAny}*/
      instance: null
    }
  })
  .states("ожидание патча", "добавление актора")
  .transitions("ожидание патча", [
    {
      in: "ожидание патча",
      to: [{state: "добавление актора", when: {op: "add"}}],
    },
    {
      in: "добавление актора",
      action: ({update, element, core, context}) => {
        if (!core.snapshot) {
          update({error: `Отсутствует снимок meta - ${context.nodes[context.nodes.length]}`})
          return
        }
        /**@type{import("../metafor").Snapshot<any, any, any>}*/
        const snapshot = core.snapshot
        render(template(snapshot, core.instance), element)
        update({nodes: context.nodes.slice(1)})
        core.snapshot = null
      },
      to: [
        {state: "ожидание патча", when: {nodes: {isEmpty: true}}},
        {state: "добавление актора", when: {nodes: {isEmpty: false}}}
      ],
    }
  ])
  .reactions([])
  .view({
    render: ({html}) => html`
      <slot></slot>`
  })
