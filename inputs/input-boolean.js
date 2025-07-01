import {MetaFor} from "../metafor.js"

export default MetaFor("input-boolean")
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
      <label class="switch-vision-pro">
        <input type="checkbox"
          name=${context.name}
          .checked=${String(context.value) === "true"}
          @change=${/**@param {Event} e*/e => {
            const v = (e.target instanceof HTMLInputElement) ? e.target.checked : false
            update({value: v ? "true" : "false"})
          }}
        />
        <span class="slider"></span>
      </label>
    `,
    style: ({css}) => css`
      :host { 
        display: flex; 
        align-items: center; 
        min-width: 222px;
        justify-content: space-between;
      }
      .param-title { color: var(--font-color); font-size: 13px; margin: 0 8px; }
      .switch-vision-pro {
        --switch-width: 44px;
        --switch-height: 20px;
        --switch-knob: 14px;
        position: relative;
        display: inline-block;
        width: var(--switch-width);
        height: var(--switch-height);
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
        border-radius: calc(var(--switch-height) / 1.625);
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
        width: var(--switch-knob);
        height: var(--switch-knob);
        border-radius: 50%;
        background: white;
        box-shadow: 0 1.5px 4px 0 rgba(0,0,0,0.10);
        transition: transform 0.3s cubic-bezier(.4,2.2,.2,1), background 0.3s;
      }
      .switch-vision-pro input:checked + .slider:before {
        transform: translateX(calc(var(--switch-width) - var(--switch-knob) - 6px));
        background: #eaf1ff;
      }
      .switch-vision-pro input:focus + .slider {
        box-shadow: 0 0 0 2px #4f8cff55;
      }
    `
  }) 