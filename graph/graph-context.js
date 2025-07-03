import {createRef} from "../html/directives/ref.js"
import {MetaFor} from "../metafor.js"
import "./graph-param.js"

export default MetaFor("graph-context", {
  description: "Контекст",
  development: true,
})
  .context((t) => ({
    id: t.string({title: "ID meta"}),
    state: t.string({title: "Название состояния"}),
    error: t.string({title: "Ошибка", nullable: true}),
    width: t.number({nullable: true}),
    height: t.number({nullable: true}),
    x: t.number({nullable: true}),
    y: t.number({nullable: true}),
    layout: t.boolean({default: false}),
    active: t.boolean({default: false}),
    process: t.boolean({default: false})
  }))
  .core(() => ({
    /**@type{import("./graph-context.t.js").Params}*/
    params: new Map(),
    /**@type{import("./graph-context.t.js").Sockets}*/
    sockets: new Map(),
    count: 0,
    header: createRef(),
    /**@type{MetaAny}*/
    meta: null,
  }))
  .states("рендер", "измерение", "позиционирование", "неактивно", "активно", "в процессе")
  .transitions("рендер", [
    {
      in: "рендер",
      action({element}) {
      },
      to: [{state: "измерение", when: {error: null}}],
    },
    {
      in: "измерение",
      action({element, update}) {
        requestAnimationFrame(() => {
          const {width, height, x, y} = element.getBoundingClientRect()
          update({width: Math.round(width), height: Math.round(height), x: Math.round(x), y: Math.round(y)})
        })
      },
      to: [{state: "позиционирование", when: {layout: true}}],
    },
    {
      in: "позиционирование",
      action({element, context}) {
        element.style.transform = `translate(${context.x}px, ${context.y}px)`
      },
      to: [
        {state: "неактивно", when: {error: null, active: false}},
        {state: "активно", when: {error: null, active: true}},
      ],
    },
    {
      in: "в процессе",
      to: [
        {state: "неактивно", when: {error: null, active: false, process: false}},
        {state: "активно", when: {error: null, active: true, process: false}},
      ],
    },
    {
      in: "активно",
      to: [
        {state: "неактивно", when: {error: null, active: false}},
      ],
    },
    {
      in: "неактивно",
      to: [
        {state: "активно", when: {error: null, active: true, process: false}},
        {state: "в процессе", when: {error: null, active: true, process: true}},
      ],
    },
  ])
  .reactions([
    {
      title: "вычисленное положение",
      filter: ({meta, patch}) => meta.tag === "graph-layout" && patch.path === "/state" && patch.value === "ожидание",
      action({id, context, update}) {
        const data = sessionStorage.getItem(context.id)
        if (!data) {
          update({error: "Нет данных разметки"})
          return
        }
        /**@type{import("./graph-layout.t").TypedLayoutResult}*/
        const layout = JSON.parse(data)
        const stateGroup = layout.children.find((group) => group.id === context.state)
        if (!stateGroup) {
          update({error: `Состояние ${context.state} не найдено в layout`})
          return
        }

        const layoutContext = stateGroup.children.find((child) => child.id === id)
        if (!layoutContext) {
          update({error: `не найден элемент: ${id} для состояния ${context.state}`})
          console.error(`не найден элемент: ${id} для состояния ${context.state}`, layout)
          return
        }
        update({x: layoutContext.x, y: layoutContext.y, layout: true})
      },
    },
    {
      title: "активность состояния",
      filter: ({meta, patch, context}) =>
        context.id === `${meta.tag}/${meta.index}`
        && patch.path === "/state",
      action: ({update, patch, context}) => {
        if (patch.value === context.state)
          update({process: patch.op === "add", active: true})
        else
          update({process: false, active: false})
      }
    },
  ])
  .view({
    onMount({component, core, update, context}) {
      update({active: context.state === core.meta.state})
      core.meta.onUpdate(i => {
        console.log(i)
      })
      console.log(core.meta.state)
      core.meta.onTransition((prev, next) => {
        // console.log(prev, next)
        // update({active: context.state === next})
      })
    },
    render: ({context, html, ref, core}) => html`
      <header ${ref(core.header)}>
        <h2 class="noselect">${context.state}</h2>
      </header>
      <section>
        <slot>empty</slot>
      </section>
    `,
    style: ({css}) => css`
      :host {
        backdrop-filter: var(--backdrop-filter-blur);
        -webkit-backdrop-filter: var(--backdrop-filter-blur);
        -moz-backdrop-filter: var(--backdrop-filter-blur);
        -o-backdrop-filter: var(--backdrop-filter-blur);
        -ms-backdrop-filter: var(--backdrop-filter-blur);

        --background-color: rgba(var(--surface-700) / var(--background-alpha));

        position: fixed;
        display: flex;
        flex-direction: column;
        min-width: max-content;
        border-radius: var(--node-border-radius);
        transition: box-shadow 0.3s ease-in-out;
        box-sizing: border-box;

        &:before {
          content: "";
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          position: absolute;
          border: 1px solid rgba(var(--surface-900) / 1);
          border-radius: inherit;
          pointer-events: none;
          z-index: -2;
          transition: box-shadow 0.3s ease-in-out;
          box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px, rgba(0, 0, 0, 0.2) 0 -3px 0 inset;
        }

        &:after {
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

        & header {
          padding: 8px 24px;
          background-color: rgba(var(--surface-500) / var(--background-alpha));
          border-radius: var(--node-border-radius);
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          position: relative;
          font-weight: 800;
          letter-spacing: 0.02em;
          font-family: "Russo One", "Courier New", Courier, monospace;
          transition: background-color 0.4s, color 0.4s;
          color: rgb(var(--primary-400));
          cursor: move;

          & h2 {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            margin: 0;
          }

          &::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.18), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
            opacity: 0.7;
          }
        }

        & > section {
          background: var(--background-color);
          padding: 8px;
          display: flex;
          flex-direction: column;
          position: relative;
          border-radius: 0 0 var(--node-border-radius) var(--node-border-radius);
          background-color: var(--background-color);
        }
      }

      :host([state="в процессе"]) {
      }

      :host([state="активно"]) {
        &:before {
          border-color: rgba(var(--surface-200) / 1);
        }

        & header {
          color: rgb(var(--success-50));
        }
      }

      :host(:hover) > header {
        color: rgb(var(--success-100));
      }

      :host([state="в процессе"])::before {
        content: "";
        position: absolute;
        z-index: 1;
        inset: -10px;
        border-radius: inherit;
        pointer-events: none;
        background:
          linear-gradient(120deg,
            rgb(var(--primary-500)),
            rgb(var(--secondary-500)),
            rgb(var(--warning-500)),
            rgb(var(--error-500)),
            rgb(var(--success-500)),
            rgb(var(--primary-500))
          ),
          linear-gradient(240deg,
            rgb(var(--success-500)),
            rgb(var(--primary-500)),
            rgb(var(--secondary-500)),
            rgb(var(--warning-500)),
            rgb(var(--error-500)),
            rgb(var(--success-500))
          );
        background-size: 300% 300%, 400% 400%;
        background-blend-mode: lighten;
        filter: blur(16px);
        opacity: 0.5;
        animation:
          rainbow-chaos-1 2.2s linear infinite,
          rainbow-chaos-2 3.1s linear infinite;
      }

      :host([state="в процессе"])::after {
        content: "";
        position: absolute;
        z-index: 2;
        inset: -3px;
        border-radius: inherit;
        pointer-events: none;
        background:
          linear-gradient(120deg,
            rgb(var(--primary-500)),
            rgb(var(--secondary-500)),
            rgb(var(--warning-500)),
            rgb(var(--error-500)),
            rgb(var(--success-500)),
            rgb(var(--primary-500))
          ),
          linear-gradient(240deg,
            rgb(var(--success-500)),
            rgb(var(--primary-500)),
            rgb(var(--secondary-500)),
            rgb(var(--warning-500)),
            rgb(var(--error-500)),
            rgb(var(--success-500))
          );
        background-size: 300% 300%, 400% 400%;
        background-blend-mode: lighten;
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box, 
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        box-shadow: 0 0 16px 2px rgb(var(--primary-500)), 0 0 32px 4px rgb(var(--secondary-500));
        opacity: 1;
        animation:
          rainbow-chaos-1 2.2s linear infinite,
          rainbow-chaos-2 3.1s linear infinite;
      }

      @keyframes rainbow-move {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 100% 50%;
        }
      }

      @keyframes rainbow-chaos-1 {
        0%   { background-position: 0% 50%; }
        25%  { background-position: 50% 100%; }
        50%  { background-position: 100% 50%; }
        75%  { background-position: 50% 0%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes rainbow-chaos-2 {
        0%   { background-position: 100% 0%; }
        20%  { background-position: 0% 100%; }
        40%  { background-position: 100% 100%; }
        60%  { background-position: 0% 0%; }
        80%  { background-position: 100% 50%; }
        100% { background-position: 100% 0%; }
      }
    `,
  })
//:host:has(::slotted(*:nth-child(1))) > header  { background-color: green }

// :host:has(> :nth-child(2)) > header {

// }
//
// :host:has(> :nth-child(2)) > header::before {
//   border-bottom-left-radius: 0;
//   border-bottom-right-radius: 0;
// }
//
// :host:has(> :nth-child(2)) > section {
//   padding: 8px;
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   background-color: var(--background-color);
// }


//:host:has(> :nth-child(1)) > section:last-child {
//  padding-bottom: 0;
//  border-bottom-left-radius: var(--node-border-radius);
//  border-bottom-right-radius: var(--node-border-radius);
//}