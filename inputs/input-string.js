import {MetaFor} from "../metafor.js"

export default MetaFor("input-string")
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
      <span class="param-title">${context.title}</span>
      <input
       type="text" 
       name=${context.name} 
       value=${context.value}
    @input=${/**@param {InputEvent} e*/e => update({value: ((e.target instanceof HTMLInputElement) ? e.target.value : '')})}
      />
    `,
    style: ({css}) => css`
      :host { display: flex; align-items: center; }
      .param-title { color: var(--font-color); font-size: 13px; margin: 0 8px; }
      input[type="text"] {
        color: var(--font-color);
        background: none;
        border: none;
        border-radius: 13px;
        font-size: 13px;
        padding: 4px 8px;
        outline: none;
        min-width: 40px;
      }
    `
  }) 