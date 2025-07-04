import {MetaFor} from "../metafor.js"

export default MetaFor("input-array")
  .context(t => ({
    name: t.string({}),
    title: t.string({}),
    value: t.array({default: [""]}),
    error: t.string({nullable: true}),
    input: t.string({default: ""}),
  }))
  .core()
  .states("рендер")
  .transitions("рендер", [])
  .reactions([])
  .view({
    render: ({context, html, update}) => html`
      <div>
        <span>
          ${context.title}
        </span>
        <div>
          ${context.value.map((chip, i) => html`
            <span class="chip">
              ${chip}
              <button
                title="Удалить"
                @click=${() => {
                  const arr = /**@type{Array<any>}*/ (context.value.slice())
                  arr.splice(i, 1)
                  update({value: arr})
                }}
              >
                ×
              </button>
            </span>
          `)}
          <input
            name=${context.name}
            type="text"
            placeholder="Добавить..."
            .value=${context.input}
            @input=${/**@param {InputEvent} e*/e => update({input: (e.target instanceof HTMLInputElement) ? e.target.value : ''})}
            @keydown=${/**@param {KeyboardEvent} e*/e => {
              if (e.key === 'Enter' && context.input.trim()) {
                const val = context.input.trim()
                if (!context.value.includes(val)) {
                  update({value: [...context.value, val], input: ''})
                } else {
                  update({input: ''})
                }
              }
            }}
          />
          <button
            title="Добавить"
            @click=${() => {
              const val = context.input.trim()
              if (val && !context.value.includes(val))
                update({value: [...context.value, val], input: ''})
              else update({input: ''})
            }}>
            +
          </button>
        </div>
      </div>
    `,
    style: ({css}) => css`
      :host {
        display: flex;
        align-items: center;

        & > div {
          display: flex;
          align-items: center;

          & > span {
            color: var(--font-color);
            font-size: 13px;
            margin: 0 8px;
          }

          & > div {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px;
            min-width: 80px;
            background: none;
            border-radius: 8px;
            padding: 2px 4px;

            & span {
              display: inline-flex;
              align-items: center;
              background: rgba(var(--surface-200)/ 0.7);
              color: var(--font-color);
              border-radius: 14px;
              padding: 2px 6px 2px 8px;
              font-size: 13px;
              alignment-baseline: center;
              margin: 0 2px;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.06);
              user-select: none;
              transition: background 0.2s;
            }
          }
        }

      }

      button[title="Удалить"] {
        background: none;
        border: none;
        color: rgb(var(--error-900));
        font-size: 1.1em;
        margin-left: 4px;
        cursor: pointer;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        line-height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;

        &:hover {
          background: #ffd6d6;
        }
      }

      input {
        min-width: 40px;
        font-size: 13px;
        border: none;
        outline: none;
        background: none;
        color: var(--font-color);
        padding: 2px 6px;
        border-radius: 8px;
      }

      button[title="Добавить"] {
        background: #eaf1ff;
        border: none;
        color: #2962ff;
        font-size: 1.1em;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        margin-left: 2px;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: #d0e6ff;
        }
      }
    `
  }) 