import {MetaFor} from "../../metafor.js"
import './node-meta-socket.js'

export default MetaFor("node-meta-param")
  .context(t => ({
    id: t.string({title: "ID meta"}),
    state: t.string({title: "Название состояния"}),
    param: t.string({title: "Ключ параметра"}),
    title: t.string({title: "Название параметра"}),
    value: t.string({title: "Значение параметра", nullable: true}),
    error: t.string({title: "Ошибка", nullable: true}),
    width: t.number({nullable: true}),
    height: t.number({nullable: true}),
    x: t.number({nullable: true}),
    y: t.number({nullable: true}),
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
      <metafor-node-meta-socket
        context=${{
      id: context.id,
      state: context.state,
      param: context.param,
      parent: "state",
      direction: "west"
    }}
        data-direction="input"
        data-active="false"
      ></metafor-node-meta-socket>
      <span class="noselect">${context.title}</span>
      <input name=${context.title} value=${context.value}/>
      <metafor-node-meta-socket
        context=${{
      id: context.id,
      state: context.state,
      param: context.param,
      parent: "state",
      direction: "east"
    }}
        class="connected"
        data-direction="output"
        data-active="false"
      /></metafor-node-meta-socket>
    `,
    style: ({css}) => css`
      :host {
        --background-color: rgba(var(--surface-900));

        background-color: var(--background-color);
        margin: 2px 0;
        padding: 0 2px;
        display: flex;
        align-items: center;

        &:active {
          border-color: rgba(var(--primary-500));
        }

        &.highlight {
          &:before {
            background-color: rgba(var(--tertiary-400)) !important;
          }

          /* background-color: rgba(var(--secondary-500)); */
          /* box-shadow: 0 0 2px inset rgba(var(--secondary-900)); */

          &:not(:focus-within) {
            /* border-color: rgba(var(--secondary-500)); */
          }
        }
      }

      :host:focus-within {
        border-color: rgba(var(--primary-500));
        box-shadow: 0 0 2px 1px rgba(var(--primary-500));
      }

      span {
        color: var(--font-color);
        font-size: 13px;
        white-space: nowrap;
        user-select: none;
      }

      input {
        -webkit-appearance: none;
        appearance: none;
        background-color: inherit;
        margin: 0;
        width: 100%;
        height: 100%;
        text-align: right;
        border: none;
        border-radius: 13px;
        color: var(--font-color);
        font-size: 13px;
        box-sizing: border-box;
        outline: none;
      }
    `
  })