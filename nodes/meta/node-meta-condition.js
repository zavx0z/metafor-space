import {MetaFor} from "../../metafor.js"
import {repeat} from "../../html/directives/repeat.js"

export default MetaFor("node-meta-condition")
  .states('init','ready')
  .context(t => ({
    id: t.string({}),
    port: t.string({title: "ID порта"}),
    operators: t.array({default: []})
  }))
  .core(() => ({
    /** @type{import("../structure/transitions").ConditionsTransitionPortsData | null} */
    data: null
  }))
  .view({
    render: ({html, context}) => html`
      <span id=${context.id} data-port=${context.port}></span>
      <metafor-node-meta-socket data-active=${false}></metafor-node-meta-socket>
      ${repeat(context.operators, i => i, i => html`
        <span class="noselect">
          <span>${"symbol"}</span>
          <span>${String("name")} - ${String("value")}</span>
        </span>
      `)}
    `,
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

      span:first-child:before {
        --background-color: rgba(var(--surface-400));
      }
    `
  })
  .transitions('init', [])
  .reactions([])
  .create()