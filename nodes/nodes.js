import {MetaFor} from "../metafor.js"
import ELK from "elkjs"
import {repeat} from "../html/directives/repeat.js"

export const Nodes = MetaFor("nodes", {description: "Nodes", development: true}
).states(
  "ожидание патча",
  "добавление ноды",
  "удаление ноды"
).context((t) => ({
  op: t.enum("add", "remove")({title: "Тип патча", nullable: true}),
  nodes: t.array({title: "Коллекция meta", default: []}),
})).core(() => ({
  elk: new ELK(),
})).transitions([
  {
    from: "ожидание патча",
    action: ({context}) => {
      console.log(context)
    },
    to: [
      {state: "добавление ноды", when: {op: "add"}},
      {state: "удаление ноды", when: {op: "remove"}},
    ],
  },
  {
    from: "добавление ноды",
    action: ({context, update}) => {
      console.log(context)
      update({op: null})
    },
    to: [{state: "ожидание патча", when: {op: null}}],
  },
  {
    from: "удаление ноды",
    action: ({context, update}) => {
      console.log(context)
      update({op: null, nodes: []})
    },
    to: [{state: "ожидание патча", when: {op: null}}],
  },
]).reactions([
  {
    op: "add",
    action: ({context, patch, update}) => {
      console.log(patch)
      update({nodes: [...context.nodes, patch.value]})
    },
  },
]).view({
  render: ({html, update, context}) => html`
      <div>
          <h1>Nodes</h1>
          <button @click=${() => update({op: "add"})}>Add</button>
          <button @click=${() => update({op: "remove"})}>Remove</button>
          ${context.nodes.map(/** @param {{id: string}} i */(i) => html`
              <div>${i.id}</div>
          `)}
          ${repeat(context.nodes, node => node.id, node => html`
              <div>${node.id}</div>
          `)}
      </div>
  `,
  style: ({css}) => css`
      :host {
          color: white;
      }

      h1,
      p {
          color: red;
      }
  `,
})
