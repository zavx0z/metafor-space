import {MetaFor} from "../metafor.js"
import './graph-socket.js'
import {choose} from "../html/directives/choose.js"

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
    render: ({context, html, update}) => html`
      <metafor-graph-socket
        context=${{
          id: context.id,
          state: context.state,
          param: context.param,
          parent: "state",
          direction: "west",
          type: context.type
        }}
        data-type="${context.type}"
      >
      </metafor-graph-socket>
      <span class="noselect param-title" data-type="${context.type}">${context.title}</span>
      ${choose(context.type, [
        ["boolean", () => html`
          <label class="switch-vision-pro">
            <input type="checkbox"
              name=${context.title}
              .checked=${String(context.value) === "true"}
              @change=${/**@param {Event} e*/e => {
                if (!e.target) return;
                const v = /**@type{HTMLInputElement}*/(e.target).checked
                e.target.dispatchEvent(new CustomEvent('input', {detail: v ? "true" : "false", bubbles: true}))
              }}
            />
            <span class="slider"></span>
          </label>
        `],
        ["number", () => html`
          <input type="number" name=${context.title} value=${context.value}/>
        `],
        ["array", () => html`
          <textarea name=${context.title}>${Array.isArray(context.value) ? context.value.join(", ") : (context.value ?? "")}</textarea>
        `],
        ["enum", () => html`
          <div class="custom-select">
            <select name=${context.title}
              .value=${context.value != null ? String(context.value) : ''}
              @change=${/**@param {Event} e*/e => {
                if (!e.target) return;
                const v = /**@type{HTMLSelectElement}*/(e.target).value
                update({value: v})
                e.target.dispatchEvent(new CustomEvent('input', {detail: v, bubbles: true}))
              }}>
              <option value="" disabled hidden>Выберите...</option>
              ${(
                Array.isArray(context.options) && context.options.length > 0
                  ? context.options
                  : Array.isArray(context.value)
                    ? context.value
                    : (typeof context.value === "string" && context.value)
                      ? context.value.split(',')
                      : []
              ).map(opt => html`<option value=${opt.trim()}>${opt.trim()}</option>`)}
            </select>
          </div>
        `]
      ], () => html`
        <input type="text" name=${context.title} value=${context.value}/>
      `)}
      <metafor-graph-socket
        context=${{
          id: context.id,
          state: context.state,
          param: context.param,
          parent: "state",
          direction: "east",
          type: context.type
        }}
        data-type="${context.type}"
      />
    `,
    style: ({css}) => css`
      :host {
        --background-color: rgba(var(--surface-900));
        background-color: var(--background-color);
        margin: 2px 0;
        padding: 0 2px;
        display: flex;
        align-items: center;
        border-radius: calc(var(--node-border-radius)/2);
      }

      .param-title {
        color: var(--font-color);
        font-size: 13px;
        white-space: nowrap;
        user-select: none;
        margin-right: 8px;
        min-width: 0;
        flex-shrink: 0;
        padding-left: 6px;
        margin-left: 4px;
      }

      input, select, textarea {
        color: var(--font-color);
        background: none;
        margin: 0;
        flex: 1 1 0;
        width: auto;
        min-width: 40px;
        height: 100%;
        text-align: right;
        border: none;
        border-radius: 13px;
        font-size: 13px;
        box-sizing: border-box;
        outline: none;
        resize: none;
      }

      select {
        cursor: pointer;
      }

      textarea {
        min-height: 20px;
        max-height: 60px;
        text-align: left;
        padding: 2px 6px;
        font-family: monospace;
        font-size: 11px;
      }

      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type="number"] {
        -moz-appearance: textfield;
      }

      .custom-select {
        position: relative;
        display: inline-block;
        width: 100%;
      }
      .custom-select select {
        width: 100%;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1.5px solid rgba(var(--surface-400), 0.7);
        background: rgba(var(--surface-100), 0.9);
        color: rgb(var(--surface-900));
        font-family: inherit;
        font-size: 1em;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-shadow: 0 1.5px 4px 0 rgba(0,0,0,0.04);
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: pointer;
      }
      .custom-select select:focus, .custom-select select:hover {
        border-color: rgb(var(--surface-600));
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
      }
      .custom-select::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 16px;
        width: 0;
        height: 0;
        pointer-events: none;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid rgb(var(--surface-600));
        transform: translateY(-50%);
      }

      /* Vision Pro Switch Styles */
      .switch-vision-pro {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 26px;
        margin: 0 8px 0 0;
        vertical-align: middle;
      }
      .switch-vision-pro input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .switch-vision-pro .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, rgba(var(--surface-200),0.9) 0%, rgba(var(--surface-100),0.9) 100%);
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.10), 0 1.5px 3px rgba(0,0,0,0.08);
        transition: background 0.3s, box-shadow 0.3s;
      }
      .switch-vision-pro input:checked + .slider {
        background: linear-gradient(90deg, #4f8cff 0%, #a6bfff 100%);
        box-shadow: 0 2px 12px #4f8cff44, 0 1.5px 3px #4f8cff22;
      }
      .switch-vision-pro .slider:before {
        content: "";
        position: absolute;
        left: 3px;
        top: 3px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 1.5px 4px 0 rgba(0,0,0,0.10);
        transition: transform 0.3s cubic-bezier(.4,2.2,.2,1), background 0.3s;
      }
      .switch-vision-pro input:checked + .slider:before {
        transform: translateX(18px);
        background: #eaf1ff;
      }
      .switch-vision-pro input:focus + .slider {
        box-shadow: 0 0 0 2px #4f8cff55;
      }
    `
  })