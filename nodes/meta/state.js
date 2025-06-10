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
      <header>
        <h2 class="noselect">${context.title}</h2>
      </header>
      <section>

      </section>
      <section>
        <button>
          <span>${"change"}</span>
        </button>
      </section>
    `,
    style: ({css}) => css`
      :host {
        --background-color: rgba(var(--surface-600) / var(--background-alpha));

        position: absolute;
        display: flex;
        flex-direction: column;
        border-radius: var(--node-border-radius);
        transition: box-shadow 0.3s ease-in-out;
        box-sizing: border-box;

        & header {
          padding: 8px 24px;
          background-color: rgba(var(--surface-400) / var(--background-alpha));
          border-radius: var(--node-border-radius);
          position: relative;
          font-weight: 800;
          letter-spacing: 0.02em;

          & h2 {
            margin: 0;
          }
        }

        & > section {
          background: var(--background-color);
        }

        &:has(> :nth-child(2)) {
          & > state-header {
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;

            &::before {
              border-bottom-left-radius: 0 !important;
              border-bottom-right-radius: 0 !important;
            }
          }
        }

        &:has(> :nth-child(2)) {
          section {
            padding: 8px 8px 0 8px;
            display: flex;
            flex-direction: column;
            position: relative;
            background-color: var(--background-color);

            &:last-child {
              padding-bottom: 8px;
              border-bottom-left-radius: var(--node-border-radius);
              border-bottom-right-radius: var(--node-border-radius);
            }
          }
        }
      }

      button {
        /* height: 26px; */
        border: 1px solid var(--button-border-color);
        border-radius: 4px;
        background-color: var(--background-color);
        color: rgba(var(--surface-50));
        cursor: pointer;
        font-size: inherit;
        transition: all 0.3s ease;


        &:hover {
          background-color: var(--button-hover-background);
          border-color: var(--button-border-color);
        }

        &:active {
          background-color: var(--button-active-background);
          border-color: var(--button-border-color);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: var(--button-disabled-background);
          border-color: var(--button-border-color);
        }
      }
    `
  }).create({})