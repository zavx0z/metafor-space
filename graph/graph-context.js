import { createRef } from "../html/directives/ref.js"
import {MetaFor} from "../metafor.js"
import "./graph-param.js"

export default MetaFor('graph-context', {
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
    /**@type{import("./graph-context.t.js").Params}*/
    params: new Map(),
    /**@type{import("./graph-context.t.js").Sockets}*/
    sockets: new Map(),
    count: 0,
    header: createRef()
  }))
  .states("рендер", "измерение", "позиционирование")
  .transitions("рендер", [
    {
      in: "рендер",
      to: [{state: "измерение", when: {error: null}}]
    },
    {
      in: "измерение",
      action({element, update, core}) {
        requestAnimationFrame(() => {
          const {width, height, x, y} = element.getBoundingClientRect()
          const header = /**@type{HTMLElement} */ (core.header.value)
          const bbHeader = header.getBoundingClientRect()
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
      filter: ({meta, patch}) => meta.tag === "graph-layout"
        && patch.path === "/state"
        && patch.value === "ожидание"
      ,
      action({id, context, update}) {
        const data = sessionStorage.getItem(context.id)
        if (!data) {
          update({error: "Нет данных разметки"})
          return
        }
        /**@type{import("./graph-layout.t").TypedLayoutResult}*/
        const layout = JSON.parse(data)
        const stateGroup = layout.children.find(group => group.id === context.state)
        if (!stateGroup) {
          update({error: `Состояние ${context.state} не найдено в layout`})
          return
        }
        
        const layoutContext = stateGroup.children.find(child => child.id === id)
        if (!layoutContext) {
          update({error: `не найден элемент: ${id} для состояния ${context.state}`})
          console.error(`не найден элемент: ${id} для состояния ${context.state}`, layout)
          return
        }
        // console.log(layoutContext)
        update({x: layoutContext.x, y: layoutContext.y})
      }
    }
  ])
  .view({
    render: ({context, html, ref, core}) => html`
      <header ${ref(core.header)}>
        <h2 class="noselect">${context.state}</h2>
      </header>
      <section>
        <slot></slot>
      </section>
      <section>
      </section>
    `,
    style: ({css}) => css`
      :host:before {
        content: "";
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        border: 1px solid rgba(var(--surface-400));
        border-radius: inherit;
        pointer-events: none;
        z-index: -2;
        transition: box-shadow 0.3s ease-in-out;
        box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px, rgba(0, 0, 0, 0.2) 0 -3px 0 inset;
      }

      :host:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise' x='0%' y='0%' width='100%' height='100%'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.15'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='white' filter='url(%23noise)'/%3E%3C/svg%3E");
        background-repeat: repeat;
        background-size: contain;
        opacity: 0.1;
        border-radius: inherit;
        z-index: -1;
      }

      :host {
        backdrop-filter: var(--backdrop-filter-blur);
        -webkit-backdrop-filter: var(--backdrop-filter-blur);
        -moz-backdrop-filter: var(--backdrop-filter-blur);
        -o-backdrop-filter: var(--backdrop-filter-blur);
        -ms-backdrop-filter: var(--backdrop-filter-blur);

        --background-color: rgba(var(--surface-600) / var(--background-alpha));

        position: fixed;
        display: flex;
        flex-direction: column;
        min-width: max-content;
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
        padding-bottom: 0;
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
    `
  })