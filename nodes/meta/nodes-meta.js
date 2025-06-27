import {html, render} from "../../html/html.js"
import {MetaFor} from "../../metafor.js"
import "./node-meta.js"
import "./node-meta-state.js"
import "./node-meta-context.js"
import "./node-meta-param.js"
import "./node-meta-condition.js"
import "./node-meta-operator.js"

export default MetaFor("nodes-meta", {
  description: "No-code система визуализации и построения системы взаимодействия мета-компонентов.",
  development: true
})
  .context(t => ({
    op: t.enum("add")({title: "Тип патча", nullable: true}),
    nodes: t.array({title: "Коллекция meta"}),
    error: t.string({title: "Ошибка", nullable: true}),
  }))
  .core(({self, context, update}) => {
    document.addEventListener("channel", (ev) => {
      const {detail} = /** @type {CustomEvent} */ (ev)
      const {meta, patch} =  /**@type {import("../../metafor").BroadcastMessage}*/(detail)
      if (patch.op === "add" && meta.tag !== "nodes-meta" && !meta.tag.includes("node-meta") && meta.tag !== "node-elk") {
        self.snapshot = patch.value
        update({op: "add", nodes: [...context.nodes, patch.value.id]})
      }
    })
    return {
      snapshot: null
    }
  })
  .states("ожидание патча", "добавление ноды")
  .transitions("ожидание патча", [
    {
      in: "ожидание патча",
      to: [{state: "добавление ноды", when: {op: "add"}}],
    },
    {
      in: "добавление ноды",
      action: ({update, element, core, context}) => {
        if (!core.snapshot) {
          update({error: `Отсутствует снимок meta - ${context.nodes[context.nodes.length]}`})
          return
        }
        /**@type{SnapshotMetaForAny}*/
        const snapshot = core.snapshot
        render(html`
          <metafor-node-meta context=${{
            id: snapshot.id
          }} class="backdrop"
          >
            ${snapshot.states.map(i => html`
              <metafor-node-meta-state context=${{
                id: snapshot.id,
                state: i
              }}>
                ${snapshot.transitions.map((transition) => transition.to
                  .filter(c => c.state !== i)
                  .map(condition =>
                    Object.entries(condition.when).map(([key, value]) => {
                      let op
                      let val
                      if (typeof value === "object" && value !== null) {
                        return html`${Object.entries(/**@param{[string, string]} param*/([key, value]) => html`
                          <metafor-node-meta-operator context=${{
                            id: snapshot.id,
                            from: transition.in,
                            to: condition.state,
                            op: key,
                            value: value
                          }}>
                          </metafor-node-meta-operator>
                        `)}`
                      } else if (value === null) {
                        op = "isNull"
                        value = true
                      } else {
                        op = "eq"
                        val = value
                      }
                      return html`
                        <metafor-node-meta-condition context=${{
                          id: snapshot.id,
                          from: transition.in,
                          to: condition.state,
                          param: key
                        }}>
                          <metafor-node-meta-operator context=${{
                            id: snapshot.id,
                            from: transition.in,
                            to: condition.state,
                            op: op,
                            value: val
                          }}>
                          </metafor-node-meta-operator>
                        </metafor-node-meta-condition>
                      `
                    })))}
                <metafor-node-meta-context context=${{
                  id: snapshot.id,
                  state: i
                }}>
                  ${Object.keys(snapshot.types).map(key => html`
                    <metafor-node-meta-param context=${{
                      id: snapshot.id,
                      state: i,
                      param: key,
                      title: snapshot.types[key].title,
                      value: snapshot.context[key]
                    }}></metafor-node-meta-param>
                  `)}
                </metafor-node-meta-context>
              </metafor-node-meta-state>
            `)}
          </metafor-node-meta>
        `, element)
        update({nodes: context.nodes.slice(1)})
        core.snapshot = null
      },
      to: [
        {state: "ожидание патча", when: {nodes: {isEmpty: true}}},
        {state: "добавление ноды", when: {nodes: {isEmpty: false}}}
      ],
    }
  ])
  .reactions([])
  .view({
    render: ({html}) => html`
      <slot></slot>
    `,
    style: ({css}) => css`
      :host {
        color: rgb(var(--surface-50));
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
      }

      section {
        position: relative;
        display: flex;
        height: fit-content;
      }

      button {
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
    `,
    onMount() {

    }
  })
