import {MetaFor} from "../../metafor.js"
import ELK from "elkjs"
import "./node-meta.js"
import {html, render} from "../../html/html.js"

export default MetaFor("nodes-meta", {
  description: "No-code система визуализации и построения системы взаимодействия мета-компонентов.",
  development: true
})
  .states("ожидание патча", "добавление ноды")
  .context(t => ({
    op: t.enum("add")({title: "Тип патча", nullable: true}),
    nodes: t.array({title: "Коллекция meta"}),
  }))
  .core(() => ({
    elk: new ELK(),
    /**@type{SnapshotMetaForAny|null}*/
    snapshot: null
  }))
  .view({
    render: ({html}) => html`
      <slot name="meta"/>
    `,
    style: ({css}) => css`
      :host {
        color: rgb(var(--surface-50));
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
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
    `
  })
  .transitions("ожидание патча", [
    {
      in: "ожидание патча",
      to: [{state: "добавление ноды", when: {op: "add"}}],
    },
    {
      in: "добавление ноды",
      action: ({update, element, core, context}) => {
        if (!core.snapshot) return
        const snapshot = core.snapshot
        render(html`
          <metafor-node-meta
            id=${snapshot.id}
            slot="meta"
            class="backdrop"
            .context=${{title: snapshot.id}}
            .core=${{snapshot}}
          >
            ${snapshot.states.map(i => html`
              <metafor-node-meta-state
                id=${i}
                slot="state"
                .context=${{title: i}}
                .core=${{data: {types: snapshot.types, context: snapshot.context}}}
              >
                ${Object.keys(snapshot.types).map(key => html`
                  <metafor-node-meta-param
                    id=${key}
                    slot="context"
                    .context=${{name: key, title: snapshot.types[key].title, value: snapshot.context[key]}}
                  />
                `)}
              </metafor-node-meta-state>
            `)}
            ${snapshot.transitions.map((transition) => {
              const sourceState = transition.in
              // console.log("sourceState: ", sourceState)
              return html`
                <metafor-node-meta-condition slot="conditions">
                  ${transition.to.map(condition => {
                    const destinationState = condition.state
                    // console.log("destinationState: ", destinationState)
                    return Object.entries(condition.when).map(([key, value]) => {
                      let op
                      let val
                      if (typeof value === "object" && value !== null) {
                        op = Object.keys(value)[0]
                        // @ts-ignore
                        val = value[op]
                      } else if (value === null) {
                        op = "isNull"
                        value = true
                      } else {
                        op = "eq"
                        val = value
                      }
                      return html`
                        <metafor-node-meta-operator slot="operators" .context=${{op: op, value: val}}/>
                      `
                    })
                  })}
                </metafor-node-meta-condition>`
            })}
          </metafor-node-meta>
        `, element)
        update({nodes: context.nodes.slice(1)})
      },
      to: [
        {state: "ожидание патча", when: {nodes: {isEmpty: true}}},
        {state: "добавление ноды", when: {nodes: {isEmpty: false}}}
      ],
    }
  ])
  .reactions([
    {
      filter: ({patch}) => patch.op === "add" && !patch.value.id.includes("node-meta"),
      action: ({context, patch, update, core}) => {
        core.snapshot = patch.value
        update({op: "add", nodes: [...context.nodes, patch.value.id]})
      }
    },
  ])
  .create({})
