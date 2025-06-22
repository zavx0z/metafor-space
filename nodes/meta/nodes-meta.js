import {MetaFor} from "../../metafor.js"
import ELK from "elkjs"
import "./node-meta.js"
import {html, render} from "../../html/html.js"

export default MetaFor("nodes-meta", {
  description: "No-code система визуализации и построения системы взаимодействия мета-компонентов.",
  development: true
})
  .states(
    "ожидание патча",
    "добавление ноды",
    "удаление ноды"
  )
  .context(t => ({
    op: t.enum("add", "remove")({title: "Тип патча", nullable: true}),
    nodes: t.array({title: "Коллекция meta"}),
  }))
  .core(() => /** @type{import("./nodes-meta.t").Core} */ ({
    elk: new ELK(),
    snapshot: null,
  }))
  .view({
    render: ({html, core: {snapshot}, context, repeat}) => repeat(context.nodes, id => html`
      <link href="../meta/nodes-meta.css" rel="stylesheet">
      <metafor-node-meta
        id=${id}
        class="backdrop"
        .context=${{title: id}}
        .core=${{snapshot}}
      >
        ${repeat(snapshot.states, i => html`
          <metafor-node-meta-state
            slot="states"
            id=${i}
            .context=${{title: i}}
            .core=${{
              data: {
                types: snapshot?.types,
                context: snapshot?.context,
              }
            }}
          ></metafor-node-meta-state>
        `)}
      </metafor-node-meta>
    `)
  })
  .transitions("ожидание патча", [
    {
      in: "ожидание патча",
      to: [
        {state: "добавление ноды", when: {op: "add"}},
        {state: "удаление ноды", when: {op: "remove"}},
      ],
    },
    {
      in: "добавление ноды",
      action: ({update, core}) => {
        update({op: null})
        requestAnimationFrame(() => core.snapshot = null)
      },
      to: [{state: "ожидание патча", when: {op: null}}],
    },
    {
      in: "удаление ноды",
      action: ({update}) => {
        update({op: null, nodes: []})
      },
      to: [{state: "ожидание патча", when: {op: null}}],
    }
  ])
  .reactions([
    {
      filter: ({patch}) => patch.op === "add" && !patch.value.id.includes("node-meta"),
      action: ({context, patch, update, core, element}) => {
        render(html`<h1>hello</h1>`, element)
        core.snapshot = patch.value
        update({op: "add", nodes: [...context.nodes, patch.value.id]})
      },
    },
  ])
  .create({})
