import {MetaFor} from "../metafor.js"

export default MetaFor("input-enum")
  .context(t => ({
    name: t.string({}),
    title: t.string({}),
    value: t.string({nullable: true}),
    options: t.array({default: []}),
    error: t.string({nullable: true}),
  }))
  .core()
  .states("рендер")
  .transitions("рендер", [])
  .reactions([])
  .view({
    render: ({context, html, update, repeat}) => {
      // console.log(context.value)
      return html`
        <span>${context.title}</span>
        <div>
          <select
            name=${context.name}
            @change=${/**@param {Event} e*/e => {
              const v = (e.target instanceof HTMLSelectElement) ? e.target.value : ''
              if (e.target instanceof HTMLSelectElement) update({value: v})
            }}>
            ${repeat(context.options, i => i, (opt => html`
              <option
                value=${opt}
                ?selected=${context.value === opt}
              >
                ${opt}
              </option>
            `))}
          </select>
        </div>
      `
    },
    style: ({css}) => css`
      :host {
        display: flex;
        align-items: center;
        white-space: nowrap;
        width: 100%;
      }

      span {
        color: var(--font-color);
        font-size: 13px;
        margin: 0 8px;
        white-space: nowrap;
      }

      div {
        position: relative;
        display: inline-block;
        width: 100%;
        min-width: 100px;
      }

      select {
        width: 100%;
        padding: 8px 22px 8px 2px;
        border-radius: 6px;
        border: 1px solid rgba(var(--surface-400), 0.7);
        background: rgba(var(--surface-100), 0.9);
        color: rgb(var(--primary-50));
        font-family: inherit;
        font-size: 1em;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04);
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: pointer;
        direction: rtl;
        text-align: right;

        /* Safari через webkit-specific свойство */

        /*noinspection ALL*/

        &::-webkit-select-placeholder {
          text-align: left;
        }
      }


      select:focus, select:hover {
        border-color: rgb(var(--surface-600));
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
      }

      div::after {
        content: "";
        position: absolute;
        top: 54%;
        right: 4px;
        width: 0;
        height: 0;
        pointer-events: none;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid rgb(var(--surface-600));
        transform: translateY(-50%);
      }
    `
  }) 