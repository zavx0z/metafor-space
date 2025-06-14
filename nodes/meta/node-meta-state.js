import {MetaFor} from "../../metafor.js"
import {repeat} from "../../html/directives/repeat.js"
import "./node-meta-param.js"

export default MetaFor('node-meta-state', {
  description: "Нода состояния meta",
  development: true
})
  .states("hide", "visible")
  .context(t => ({
    title: t.string({title: "Название состояния", nullable: true}),
    params: t.array({title: "Параметры контекста", default: []})
  }))
  .core(() => /** @type import("./node-meta-state.t").Core */ ({
    data: null
  }))
  .view({
    render: ({context, html, core}) => html`
      <header>
        <h2 class="noselect">${context.title}</h2>
      </header>
      <section>
        ${repeat(context.params, key => html`
          <metafor-node-meta-param
              id=${key}
              .context=${{
                name: key,
                title: core.data?.types[key].title,
                value: core.data?.context[key],
              }}
          />
        `)}
      </section>
      <section>
        <button>
          <span>${"change"}</span>
        </button>
      </section>
    `,
    style: ({css}) => css`
      :host {
        --background-color: rgba(var(--surface-600) / var(--background-alpha));

        position: absolute;
        display: flex;
        flex-direction: column;
        border-radius: var(--node-border-radius);
        transition: box-shadow 0.3s ease-in-out;
        box-sizing: border-box;

        & > section {
          background: var(--background-color);
        }
      }

      :host:has(> :nth-child(2)) > header {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }

      :host:has(> :nth-child(2)) > header::before {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }

      :host:has(> :nth-child(2)) > section {
        padding: 8px 8px 0 8px;
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--background-color);
      }

      :host:has(> :nth-child(2)) > section:last-child {
        padding-bottom: 8px;
        border-bottom-left-radius: var(--node-border-radius);
        border-bottom-right-radius: var(--node-border-radius);
      }

      header {
        padding: 8px 24px;
        background-color: rgba(var(--surface-400) / var(--background-alpha));
        border-radius: var(--node-border-radius);
        position: relative;
        font-weight: 800;
        letter-spacing: 0.02em;

        & h2 {
          margin: 0;
        }
      }

      button {
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
    `
  })
  .transitions("hide", [
    {
      in: "hide",
      action: ({core, context, update}) => {
        // console.log("state: ", context.title, core.data?.types)
        if (core.data) update({params: Object.keys(core.data.types)})
      },
      to: [{
        state: "visible", when: {
          title: {isNull: false},
          params: {isEmpty: false}
        }
      }]
    },
    {
      in: "visible",
      action: ({core}) => {
        requestAnimationFrame(() => core.data = null)
        // core.data = null
      },
      to: [{state: "hide", when: {title: null}}]
    }
  ])
  .reactions([])
  .create({})