// Файл будет перемещён и переименован в inputs/input-number.js
import {MetaFor} from "../metafor.js"

export default MetaFor("input-number")
  .context(t => ({
    name: t.string({}),
    title: t.string({}),
    value: t.string({nullable: true}),
    error: t.string({nullable: true}),
  }))
  .core()
  .states("рендер")
  .transitions("рендер", [])
  .reactions([])
  .view({
    render: ({context, html, update}) => html`
      <span>
        ${context.title}
      </span>
      <input 
        type="number" 
        name=${context.name} 
        value=${context.value ?? ''}
        @input=${/**@param {InputEvent} e*/e => update({value: ((e.target instanceof HTMLInputElement) ? e.target.value : '')})}
      />
    `,
    style: ({css}) => css`
      :host {
        display: flex;
        align-items: center;
      }

      span {
        color: var(--font-color);
        font-size: 13px;
        margin: 0 8px;
      }

      input[type="number"] {
        color: var(--font-color);
        background: none;
        border: none;
        border-radius: 13px;
        font-size: 13px;
        padding: 4px 8px;
        outline: none;
        min-width: 40px;
        text-align: right;
      }

      /* Убираем стрелочки для Chrome, Safari, Edge */
      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Убираем стрелочки для Firefox */
      input[type="number"] {
        -moz-appearance: textfield;
      }
    `
  }) 