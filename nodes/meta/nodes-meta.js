import {MetaFor} from "../../metafor.js"
import ELK from "elkjs"
import {repeat} from "../../html/directives/repeat.js"
import "./node-meta.js"

export default MetaFor("nodes-meta", {description: "Nodes", development: true})
  .states("ожидание патча", "добавление ноды", "удаление ноды")
  .context((t) => ({
    op: t.enum("add", "remove")({title: "Тип патча", nullable: true}),
    nodes: t.array({title: "Коллекция meta", default: []}),
  }))
  .core(() => /** @type{import("./nodes-meta.t").Core} */ ({
    elk: new ELK(),
    snapshot: null,
  }))
  .view({
    render: ({html, core, context}) => html`
      ${repeat(context.nodes, id => id, id => {
        return html`
          <metafor-node-meta
              id=${id}
              class="backdrop"
              .context=${{title: id}}
              .core=${{data: core.snapshot}}
          />
        `
      })} `,
    style: ({css}) => {
      const borderRadius = "7px"
      return css`
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

        svg.connections {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;

          & path {
            stroke: rgb(var(--surface-300));
            stroke-width: 4px;
            fill: none;
            transition: stroke 0.3s ease;
            stroke-dasharray: var(--dash-length) var(--gap-length);
            stroke-dashoffset: 0;
          }
        }
      `
    }
  })
  .transitions("ожидание патча", [
    {
      in: "ожидание патча",
      action: ({core}) => {
        core.snapshot = null
      },
      to: [
        {state: "добавление ноды", when: {op: "add"}},
        {state: "удаление ноды", when: {op: "remove"}},
      ],
    },
    {
      in: "добавление ноды",
      action: ({update}) => {
        update({op: null})
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
      filter: ({patch}) =>
        patch.op === "add" &&
        patch.value.id !== "node-meta" &&
        patch.value.id !== "node-meta-state" &&
        patch.value.id !== "node-meta-socket" &&
        patch.value.id !== "node-meta-conditions" &&
        patch.value.id !== "node-meta-condition" &&
        patch.value.id !== "node-meta-param",
      action: ({context, patch, update, core}) => {
        core.snapshot = patch.value
        update({op: "add", nodes: [...context.nodes, patch.value.id]})
      },
    },
  ])
  .create({})
