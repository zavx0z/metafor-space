import {MetaFor} from "../metafor.js"

export default MetaFor("graph-param-array")
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
      <div class="param-array-wrapper">
        <span class="param-title">${context.title}</span>
        <textarea name=${context.name}
          @input=${/**@param {InputEvent} e*/e => update({value: ((e.target instanceof HTMLTextAreaElement) ? e.target.value : '')})}
        >${Array.isArray(context.value) ? context.value.join(", ") : (context.value ?? "")}</textarea>
      </div>
    `,
    style: ({css}) => css`
      :host { display: flex; align-items: center; }
      .param-array-wrapper { display: flex; align-items: center; }
      .param-title { color: var(--font-color); font-size: 13px; margin: 0 8px; }
      textarea {
        color: var(--font-color);
        background: none;
        border: none;
        border-radius: 13px;
        font-size: 13px;
        padding: 4px 8px;
        outline: none;
        min-width: 40px;
        min-height: 20px;
        max-height: 60px;
        font-family: monospace;
        resize: none;
      }
    `
  }) 