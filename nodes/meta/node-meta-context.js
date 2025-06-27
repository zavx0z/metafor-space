import {MetaFor} from "../../metafor.js"

export default MetaFor('node-meta-context', {
  description: "Контекст",
  development: true
})
  .context(t => ({
    id: t.string({title: "ID meta"}),
    state: t.string({title: "Название состояния"}),
    error: t.string({title: "Ошибка", nullable: true}),
    width: t.number({nullable: true}),
    height: t.number({nullable: true}),
    x: t.number({nullable: true}),
    y: t.number({nullable: true}),
  }))
  .core(() => ({
    /**@type{import("./node-meta-context.t.js").Params}*/
    params: new Map(),
    /**@type{import("./node-meta-context.t.js").Sockets}*/
    sockets: new Map(),
    count: 0
  }))
  .states("рендер", "измерение", "позиционирование")
  .transitions("рендер", [
    {
      in: "рендер",
      to: [{state: "измерение", when: {error: null}}]
    },
    {
      in: "измерение",
      action({element, update}) {
        requestAnimationFrame(() => {
          const {width, height, x, y} = element.getBoundingClientRect()
          update({
            width: Math.round(width),
            height: Math.round(height),
            x: Math.round(x),
            y: Math.round(y),
          })
        })
      },
      to: [{
        state: "позиционирование", when: {
          x: {isNull: false}, y: {isNull: false}
        }
      }]
    },
    {
      in: "позиционирование",
      action({element, context}) {
        element.style.transform = `translate(${context.x}px, ${context.y}px)`
      },
      to: []
    },
  ])
  .reactions([
    {
      title: "вычисленное положение",
      filter: ({meta, patch}) => meta.tag === "node-layout"
        && patch.path === "/state"
        && patch.value === "ожидание"
      ,
      action({id, context, update}) {
        const data = sessionStorage.getItem(context.id)
        if (!data) {
          update({error: "Нет данных разметки"})
          return
        }
        /**@type{import("elkjs").ElkNode}*/
        const layout = JSON.parse(data)
        const layoutState = layout.children?.find(i => i.id === context.state)
        const layoutContext = layoutState?.children?.find(i => i.id === id)
        console.log(layoutContext)
        // @ts-ignore
        update({x: layoutState.x + layoutContext.x, y: layoutState.y + layoutState.y})
      }
    }
  ])
  .view({
    render: ({context, html}) => html`
      <header>
        <h2 class="noselect">${context.state}</h2>
      </header>
      <section>
        <slot></slot>
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
