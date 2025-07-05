import {MetaFor} from "../metafor.js"
import "./graph-operator.js"
import "./graph-socket.js"

export default MetaFor("graph-condition", {development: true})
  .context(t => ({
    id: t.string({title: "ID meta"}),
    from: t.string({title: "Исходное состояние"}),
    to: t.string({title: "Текущее состояние"}),
    param: t.string({title: "Ключ параметра"}),
    type: t.enum("string", "number", "boolean", "array", "enum")({title: "Тип параметра"}),
    error: t.string({nullable: true}),
    width: t.number({nullable: true}),
    height: t.number({nullable: true}),
    x: t.number({nullable: true}),
    y: t.number({nullable: true}),
  }))
  .core()
  .reactions({
    "вычисленное положение": {
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
        const stateGroup = layout.children.find(group => group.id === context.to)
        if (!stateGroup) {
          update({error: `Состояние ${context.to} не найдено в layout`})
          return
        }

        const layoutCondition = stateGroup.children.find(child => child.id === id)
        if (!layoutCondition) {
          update({error: `не найден элемент: ${id}`})
          console.error(`не найден элемент: ${id}`, layout)
          return
        }
        update({x: layoutCondition.x, y: layoutCondition.y})
      }
    }
  })
  .states("рендер", "измерение", "позиционирование")
  .transitions('рендер', [
    {
      in: "рендер",
      to: [{state: "измерение", when: {error: null}}]
    },
    {
      in: "измерение",
      action: ({element}) => new Promise((resolve) => {
        requestAnimationFrame(() => {
          const {width, height} = element.getBoundingClientRect()
          resolve({width: Math.round(width), height: Math.round(height)})
        })
      }),
      to: [{state: "позиционирование", when: {x: {isNull: false}, y: {isNull: false}}}]
    },
    {
      in: "позиционирование",
      action({element, context}) {
        element.style.transform = `translate(${context.x}px, ${context.y}px)`
      },
      to: []
    },
  ])
  .view({
    render: ({html, context}) => html`
      <metafor-graph-socket
        context=${{
          id: context.id,
          state: context.to,
          param: context.param,
          type: context.type,
          parent: "condition",
          direction: "west"
        }}
      ></metafor-graph-socket>
      <slot></slot>
      <metafor-graph-socket
        context=${{
          id: context.id,
          state: context.to,
          param: context.param,
          type: context.type,
          parent: "condition",
          direction: "east"
        }}
      ></metafor-graph-socket>
    `,
    style: ({css}) => css`
      :host:before {
        content: "";
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        border-radius: inherit;
        pointer-events: none;
        z-index: -2;
        transition: box-shadow 0.3s ease-in-out;
        box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px, rgba(0, 0, 0, 0.2) 0 0 0 inset;
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

        background-color: rgba(var(--surface-400));
        padding: 4px 8px;
        position: fixed;
        display: flex;
        border-radius: 8px;
        flex-direction: row;
        align-items: center;
        gap: 2px;
        min-width: max-content;
        height: auto;
      }
    `
  })
