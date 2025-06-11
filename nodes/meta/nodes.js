/**
 * @typedef {import("../../types/meta.ts").Snapshot<any, any, any>} Snapshot
 */
import {MetaFor} from "../../metafor.js"
import ELK from "elkjs"
import {repeat} from "../../html/directives/repeat.js"
import "./node.js"

export default MetaFor("nodes", {description: "Nodes", development: true}
).states(
  "ожидание патча",
  "добавление ноды",
  "удаление ноды"
).context((t) => ({
  op: t.enum("add", "remove")({title: "Тип патча", nullable: true}),
  nodes: t.array({title: "Коллекция meta", default: []}),
})).core(() => ({
  elk: new ELK(),
  /** @type {Snapshot | undefined} */
  snapshot: undefined,
})).transitions("ожидание патча", [
  {
    from: "ожидание патча",
    action: ({context, core}) => {
      core.snapshot = undefined
      console.log(context)
    },
    to: [
      {state: "добавление ноды", when: {op: "add"}},
      {state: "удаление ноды", when: {op: "remove"}},
    ],
  },
  {
    from: "добавление ноды",
    action: ({update}) => {
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
    action: ({context, patch, update, core}) => {
      if (patch.value.id !== "nodes" && patch.value.id !== "node" && patch.value.id !== "state") {
        console.log(patch)
        core.snapshot = patch.value
        update({op: "add", nodes: [...context.nodes, patch.value.id]})
      }
    },
  },
]).view({
  render: ({html, core, context}) => html`
    ${repeat(context.nodes, id => id, id => {
      return html`
        <metafor-node
            class="backdrop"
            id=${id}
            .context=${{
              title: id,
              states: core.snapshot?.states
            }}
            .core=${{
              transitions: core.snapshot?.transitions
            }}
        >
        </metafor-node>
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

      graph-state {
        --background-color: rgba(var(--surface-600) / var(--background-alpha));

        position: absolute;
        display: flex;
        flex-direction: column;
        border-radius: ${borderRadius};
        transition: box-shadow 0.3s ease-in-out;
        box-sizing: border-box;

        & > section {
          background: var(--background-color);
        }

        &:has(> :nth-child(2)) {
          & > state-header {
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;

            &::before {
              border-bottom-left-radius: 0 !important;
              border-bottom-right-radius: 0 !important;
            }
          }
        }

        &:has(> :nth-child(2)) {
          section {
            padding: 8px 8px 0 8px;
            display: flex;
            flex-direction: column;
            position: relative;
            background-color: var(--background-color);

            &:last-child {
              padding-bottom: 8px;
              border-bottom-left-radius: ${borderRadius};
              border-bottom-right-radius: ${borderRadius};
            }
          }
        }
      }
    `
  }
}).create({
  onTransition: (preview, current, snapshot) => console.log(`${snapshot.id}: ${preview} => ${current}`),
  onUpdate: (value) => console.log(value)
})
