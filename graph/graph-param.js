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
    type: t.enum("string", "number", "boolean", "array", "enum")({title: "Тип параметра", default: "string"}),
    value: t.string({title: "Значение параметра", nullable: true}),
    error: t.string({title: "Ошибка", nullable: true}),
    width: t.number({nullable: true}),
    height: t.number({nullable: true}),
    x: t.number({nullable: true}),
    y: t.number({nullable: true}),
    options: t.array({nullable: true}),
  }))
  .core()
  .states("рендер", "измерение", "установка положения")
  .transitions('рендер', [
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
      to: [{state: "установка положения", when: {x: {isNull: false}, y: {isNull: false}}}]
    },
    {
      in: "установка положения",
      to: []
    },
  ])
  .reactions([])
  .view({
    render: ({context, html}) => html`
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
            options: context.options
          }}></metafor-input-enum>`],
      ], () => html`<span>Неизвестный тип</span>`)}
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