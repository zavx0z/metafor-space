import {MetaFor} from "../../metafor.js"
import "./node-meta-condition.js"

export default MetaFor("node-meta-transition")
  .context(t => ({
    conditions: t.array({title: "Условия сравнения"}),
    error: t.string({title: "Ошибка", nullable: true}),
  }))
  .core(() => /**@type{import("./node-meta-transition.t.js").Core}*/({
    conditions: []
  }))
  .states('init', 'ready')
  .transitions('init', [
    {
      in: "init",
      action: ({core, update}) => {
        // console.log(core.conditions)
        update({conditions: core.conditions.map(i => i.id)})
        requestAnimationFrame(() => core.conditions.length = 0)
      },
      to: [{state: "ready", when: {conditions: {isEmpty: false}}}]
    },
    {
      in: "ready",
      action({core}) {
      },
      to: []
    }
  ])
  .reactions([])
  .view({
    render: ({html, context, repeat, core}) => repeat(context.conditions, id => html`
      <metafor-node-meta-condition
        id=${id}
        .core=${{operators: core.conditions.find(i => i.id === id)?.operators}}
      />
    `),
    style: ({css}) => css`
      :host {
        --shadow-size: 0.5 !important;
        --background-color: rgba(var(--surface-400)) !important;
        position: absolute;
        display: flex;
        border-radius: 4px;
        flex-direction: column;
        align-items: stretch;
        gap: 2px;
        width: auto;
      }
    `
  })

