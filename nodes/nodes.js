import {MetaFor} from "../metafor.js"
import ELK from "elkjs"
import {repeat} from "../html/directives/repeat.js"
import {node} from "./node.js"

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
      if (patch.value.id !== "node") {
        update({nodes: [...context.nodes, patch.value]})
        node.create({
          state: "видима",
        })
      }
    },
  },
]).view({
  // isolated: false,
  render: ({html, update, context}) => html`
      <div>
          <h1>Nodes</h1>
          <button @click=${() => update({op: "add"})}>Add</button>
          <button @click=${() => update({op: "remove"})}>Remove</button>
          ${repeat(context.nodes, node => node.id, node => html`
              <metafor-node id=${node.id}>${node.id}</metafor-node>
          `)}
      </div>
  `,
  style: ({css}) => css`
      :host {
          color: rgb(var(--surface-50));
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          position: relative;
      }


      /* Стили для кнопки */

      button {
          /* Определяем переменные для цветов кнопки */
          --button-border-color: rgb(var(--surface-400));
          --background-color: rgb(var(--surface-500));
          --button-hover-background: rgb(var(--surface-400));
          --button-active-background: rgb(var(--surface-500));
          --button-disabled-background: rgb(var(--surface-800));
          /* height: 26px; */
          border: 1px solid var(--button-border-color);
          border-radius: 4px;
          background-color: var(--background-color);
          color: rgba(var(--surface-50));
          cursor: pointer;
          font-size: inherit;
          transition: all 0.3s ease;


          &:hover {
              background-color: var(--button-hover-background);
              border-color: var(--button-border-color);
          }

          &:active {
              background-color: var(--button-active-background);
              border-color: var(--button-border-color);
          }

          &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
              background-color: var(--button-disabled-background);
              border-color: var(--button-border-color);
          }
      }
  `,
})
