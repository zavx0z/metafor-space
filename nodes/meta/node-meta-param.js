import {MetaFor} from "../../metafor.js"

export default MetaFor("node-meta-param")
  .states("init", "redy")
  .context(t => ({
    title: t.string({title: "Название параметра", nullable: true}),
    name: t.string({title: "Ключ параметра", nullable: true}),
    value: t.string({title: "Значение параметра", nullable: true}),
  }))
  .core()
  .view({
    render: ({context, html}) => html`
      <node-meta-socket data-direction="input" data-active="false"></node-meta-socket>
      <span class="parameter-name noselect">${context.title}</span>
      <input name="${context.name}" class="parameter-value" value=${context.value}/>
      <node-meta-socket data-active="false" data-direction="output"></node-meta-socket>
    `,
    style: ({css}) => css`
      :host {
        --background-color: rgba(var(--surface-300));

        margin: 2px 0;

        &:focus-within {
          border-color: rgba(var(--primary-500));
          box-shadow: 0 0 2px 1px rgba(var(--primary-500));
        }

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

        & input {
          -webkit-appearance: none;
          appearance: none;
          background-color: inherit;
          margin: 0;
          width: 100%;
          height: 100%;
          text-align: right;
          border: none;
          border-radius: 3px;
          color: var(--font-color);
          font-size: 13px;
          box-sizing: border-box;
          outline: none;
        }
      }
    `
  })
  .transitions("init", [
    {
      in: "init",
      action: ({core}) => {
        console.log("param", core)
      },
      to: [{
        state: "redy", when: {
          title: {isNull: false},
          name: {isNull: false}
        }
      }]
    },
    {
      in: "redy",
      to: [{
        state: "init", when: {
          title: null,
          name: null
        }
      }]
    }
  ])
  .reactions([])
  .create({})