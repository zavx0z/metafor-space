import { MetaFor } from "../metafor.js"
import ELK from "elkjs"
import { map } from "../dom/html/directives/map.js"

export const Nodes = MetaFor("nodes", {
  description: "Nodes",
  development: true,
})
  .states("ожидание патча", "добавление ноды", "удаление ноды")
  .context((t) => ({
    op: t.enum("add", "remove")({ title: "Operation", nullable: true }),
    nodes: t.array({ title: "Коллекция meta", default: [] }),
  }))
  .core(() => ({
    elk: new ELK(),
  }))
  .transitions([
    {
      from: "ожидание патча",
      action: ({ context }) => {
        console.log(context)
      },
      to: [
        { state: "добавление ноды", when: { op: "add" } },
        { state: "удаление ноды", when: { op: "remove" } },
      ],
    },
    {
      from: "добавление ноды",
      action: ({ context, update }) => {
        console.log(context)
        update({ op: null })
      },
      to: [{ state: "ожидание патча", when: { op: null } }],
    },
    {
      from: "удаление ноды",
      action: ({ context, update }) => {
        console.log(context)
        update({ op: null })
      },
      to: [{ state: "ожидание патча", when: { op: null } }],
    },
  ])
  .reactions([
    {
      op: "add",
      action: ({ context, patch, update }) => {
        console.log(patch)
        update({ nodes: [...context.nodes, patch.value] })
      },
    },
  ])
  .view({
    render: ({ html, update, context }) => html`
      <div>
        <h1>Nodes</h1>
        <button @click=${() => update({ op: "add" })}>Add</button>
        <button @click=${() => update({ op: "remove" })}>Remove</button>
      </div>
    `,
    style: ({ css }) => css`
      h1,
      p {
        color: red;
      }
    `,
  })
