import {MetaFor} from "../metafor.js"
import {choose} from "../html/directives/choose.js"
import './graph-socket.js'
import '../inputs/input-string.js'
import '../inputs/input-number.js'
import '../inputs/input-boolean.js'
import '../inputs/input-array.js'
import '../inputs/input-enum.js'

export default MetaFor("graph-param")
  .context(t => ({
    id: t.string({title: "ID meta"}),
    state: t.string({title: "Название состояния"}),
    param: t.string({title: "Ключ параметра"}),
    title: t.string({title: "Название параметра"}),
    type: t.enum("string", "number", "boolean", "array", "enum")({title: "Тип параметра"}),
    value: t.string({title: "Значение параметра", nullable: true}),
    error: t.string({title: "Ошибка", nullable: true}),
    width: t.number({nullable: true}),
    height: t.number({nullable: true}),
    x: t.number({nullable: true}),
    y: t.number({nullable: true}),
    options: t.array({nullable: true}),
  }))
  .core(({update, context}) => {
    document.addEventListener("channel", (ev) => {
      const {detail} = /** @type {CustomEvent} */ (ev)
      const {meta, patch} =  /**@type {import("../metafor.js").BroadcastMessage}*/(detail)
      if (
        context.id === `${meta.tag}/${meta.index}`
        && patch.path === "/context"
        && Object.hasOwn(patch.value, context.param)
      ) {
        // console.log(context.param, patch.value[context.param])
        // console.log(patch.value[context.param])
        update({value: patch.value[context.param]})
      }
    })
    return {
      /** @type {MetaAny|null}*/
      meta: null
    }
  })
  .reactions([
    {
      title: "изменение значений",
      filter: ({meta, patch}) =>
        meta.tag.includes("input-")
        && patch.path === "/context"
        && Object.hasOwn(patch.value, "value")
      ,
      action({core, context, patch}) {
        core.meta.update({[context.param]: patch.value.value})
      }
    }
  ])
  .states("рендер", "измерение", "установка положения")
  .transitions('рендер', [
    {
      in: "рендер",
      to: {"измерение": {error: null}}
    },
    {
      in: "измерение",
      action: ({element}) => new Promise((resolve) => {
        requestAnimationFrame(() => {
          const {width, height} = element.getBoundingClientRect()
          resolve({width: Math.round(width), height: Math.round(height)})
        })
      }),
      to: {"установка положения": {x: {isNull: false}, y: {isNull: false}}}
    },
    {
      in: "установка положения",
      to: {}
    },
  ])
  .view({
    render: ({context, html}) => html`
      <metafor-graph-socket context=${{
        id: context.id,
        state: context.state,
        param: context.param,
        parent: "state",
        direction: "west",
        type: context.type
      }}></metafor-graph-socket>
      ${choose(context.type, [
          ["string", () => html`
            <metafor-input-string context=${{
              name: context.param,
              title: context.title,
              value: context.value
            }}
            ></metafor-input-string>`],
          ["number", () => html`
            <metafor-input-number context=${{
              name: context.param,
              title: context.title,
              value: context.value
            }}></metafor-input-number>`],
          ["boolean", () => html`
            <metafor-input-boolean context=${{
              name: context.param,
              title: context.title,
              value: context.value
            }}></metafor-input-boolean>`],
          ["array", () => html`
            <metafor-input-array context=${{
              name: context.param,
              title: context.title,
              value: context.value
            }}></metafor-input-array>`],
          ["enum", () => html`
            <metafor-input-enum context=${{
              name: context.param,
              title: context.title,
              value: context.value,
              options: context.options,
            }}></metafor-input-enum>`],
        ],
        () => html`
          <span>Неизвестный тип</span>
        `)}
      <metafor-graph-socket context=${{
        id: context.id,
        state: context.state,
        param: context.param,
        parent: "state",
        direction: "east",
        type: context.type
      }}></metafor-graph-socket>
    `,
    style: ({css}) => css`
      :host {
        background-color: rgba(var(--surface-900));
        margin: 2px 0;
        padding: 0 2px;
        display: flex;
        align-items: center;
        border-radius: calc(var(--node-border-radius) / 2);
      }
    `
  })