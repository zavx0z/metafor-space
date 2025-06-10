import {MetaFor} from "../../metafor.js"

export default MetaFor('state')
  .states("hide", "visible")
  .context(t => ({
    title: t.string({title: "Название состояния", nullable: true})
  }))
  .core()
  .transitions("visible", [])
  .reactions([])
  .view({
    render: ({context, html}) => html`
      <h2 class="noselect">${context.title}</h2>
    `,
    style: ({css}) => {
      return css`
        :host {
          &.active {
            &:before {
              --border-color: rgba(var(--secondary-50)) !important;
              box-shadow: 0 0 4px 2px rgba(var(--secondary-500));
            }

            & > state-header {
              background: rgb(var(--secondary-500) / var(--background-alpha));
            }
          }

          &.next {
            /* box-shadow: 0 0 var(--node-shadow-size) rgba(var(--tertiary-900)); */

            & > state-header {
              background-color: rgba(var(--secondary-500) / var(--background-alpha));
            }
          }

          &.preview {
            &:before {
              box-shadow: 0 0 var(--node-shadow-size) rgba(var(--primary-500));
            }

            &:hover {
              & > state-header {
                background-color: rgba(var(--primary-500) / var(--background-alpha));
              }
            }

            &:not(:hover) {
              & > state-header {
                background-color: rgba(var(--primary-700) / var(--background-alpha));
              }
            }
          }
        }
      `
    }
  }).create({})