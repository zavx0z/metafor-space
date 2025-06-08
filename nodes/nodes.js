import {MetaFor} from "../metafor.js"
import ELK from "elkjs"
import {repeat} from "../html/directives/repeat.js"
import ID, {atomId, parseStateId, stateId} from "./id.js"

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
  // snapshots: /** @type {Map<string, import("../types/meta.js").Snapshot>} */ new Map()
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
    action: ({context, patch, update, core}) => {
      console.log(patch)
      if (patch.value.id !== "nodes") {
        update({nodes: [...context.nodes, patch.value]})
        // core.snapshots.set(patch.value.id, patch)
      }
    },
  },
]).view({
  // isolated: false,
  render: ({html, update, context}) => {
    const borderRadius = "7px"
    const width = "1000px"
    const height = "4444px"
    const nodeHeaderHeight = "36px"
    return html`
      ${repeat(context.nodes, node => node.id, node => html`
        <div class="node backdrop" id="${ID.atomId({atom: node.id})}">
          <header data-drag-selector="graph-atom">
            <div><!--кнопки слева--></div>
            <h2 class="noselect">${node.id}</h2>
            <div>
              <!--кнопки справа-->
              <button aria-label="Редактировать">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor">
                  <path
                      d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"/>
                </svg>
              </button>
            </div>
          </header>
          <section class="content" data-drag-selector="graph-atom">
            <atom-svg></atom-svg>
          </section>
        </div>
      `)}
      <style>
        :host {
          color: rgb(var(--surface-50));
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          position: relative;

          & .node {
            --font-color: rgb(var(--surface-50));

            --background-color: rgba(var(--surface-100) / calc(var(--background-alpha) * 0.1));

            .theme-dark & {
              --background-color: rgba(var(--surface-900) / var(--background-alpha));
            }

            position: absolute;
            user-select: none;
            will-change: transform;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            border-radius: ${borderRadius};

            /*opacity: 0;*/
            transition: opacity 0.2s ease-in-out;

            & > section {
              display: flex;
              position: relative;
              background-color: var(--background-color);
              width: ${width};
              height: ${height};
              border-bottom-right-radius: inherit;
              border-bottom-left-radius: inherit;
            }

            header {
              --background-color: rgba(var(--surface-500) / var(--background-alpha));

              height: ${nodeHeaderHeight};
              position: relative;
              z-index: 2;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background-color: var(--background-color);
              box-sizing: border-box;
              user-select: none;
              border-top-left-radius: inherit;
              border-top-right-radius: inherit;

              & > div:first-child {
                flex: 1;
                display: flex;
                gap: 4px;
                padding-left: 4px;
              }

              & > h2 {
                flex: 1;
                text-align: center;
                margin: 0;
                padding: 0;
              }

              & > div:last-child {
                flex: 1;
                display: flex;
                justify-content: flex-end;
                padding-right: 4px;
                gap: 4px;
              }

              button {
                background: none;
                border: none;
                padding: 4px;
                cursor: pointer;
                border-radius: 4px;
                color: var(--font-color);

                &:hover {
                  background-color: rgba(0, 0, 0, 0.05);
                }

                & svg {
                  display: block;
                }
              }
            }

            svg.connections path {
              &.next {
                stroke: rgb(var(--secondary-500));
              }

              &.active {
                stroke: rgb(var(--secondary-500));
              }

              &.preview {
                stroke: rgb(var(--primary-500));
              }
            }

            trigger-parameter {
              &.next:before {
                background-color: rgb(var(--secondary-700) / var(--background-alpha)) !important;
              }

              &.preview:before {
                background-color: rgb(var(--primary-700)) !important;
              }
            }

            graph-state {
              &.active {
                &:before {
                  --border-color: rgba(var(--secondary-50)) !important;
                  box-shadow: 0 0 4px 2px rgba(var(--secondary-500));
                }

                & > state-header {
                  background: rgb(var(--secondary-500) / var(--background-alpha));
                }
              }

              &.next {
                /* box-shadow: 0 0 var(--node-shadow-size) rgba(var(--tertiary-900)); */

                & > state-header {
                  background-color: rgba(var(--secondary-500) / var(--background-alpha));
                }
              }

              &.preview {
                &:before {
                  box-shadow: 0 0 var(--node-shadow-size) rgba(var(--primary-500));
                }

                &:hover {
                  & > state-header {
                    background-color: rgba(var(--primary-500) / var(--background-alpha));
                  }
                }

                &:not(:hover) {
                  & > state-header {
                    background-color: rgba(var(--primary-700) / var(--background-alpha));
                  }
                }
              }
            }
          }

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


        /
        /

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

        /
        /

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
      </style>
    `
  },
})
