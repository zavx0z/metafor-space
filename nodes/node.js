import {MetaFor} from "../metafor.js"

export const node = MetaFor("node", {description: "Нода meta", development: true}
).states("скрыта", "видима"
).context(t=>({
  hide: t.boolean({title: "видимость", default: true})
})).core(()=>({})
).transitions([
  {
    from: "скрыта",
    to:[{state: "видима", when: {hide: false}}]
  },
  {
    from: "видима",
    to: [{state: "скрыта", when: {hide: true}}]
  }
]).view({
  isolated: false,
  render: ({html, context}) => html`
    <div>Node</div>
    <style>
        metafor-node {
            background: #1f2023;
        }
    </style>
  `,
  style: ({css}) => css`
      metafor-node {
          --width: 1000;
          --height: 4444;
          --font-color: rgb(var(--surface-50));

          --background-color: rgba(var(--surface-100) / calc(var(--background-alpha) * 0.1));

          .theme-dark & {
              --background-color: rgba(var(--surface-900) / var(--background-alpha));
          }

          position: absolute;
          user-select: none;
          will-change: transform;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          border-radius: var(--border-radius);

          opacity: 0;
          transition: opacity 0.2s ease-in-out;

          & > section {
              display: flex;
              position: relative;
              background-color: var(--background-color);
              width: calc(var(--width) * 1px);
              height: calc(var(--height) * 1px);
              border-bottom-right-radius: inherit;
              border-bottom-left-radius: inherit;
          }

          header {
              --background-color: rgba(var(--surface-500) / var(--background-alpha));

              height: calc(var(--node-header-height, 36) * 1px);
              position: relative;
              z-index: 2;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background-color: var(--background-color);
              box-sizing: border-box;
              user-select: none;
              border-top-left-radius: inherit;
              border-top-right-radius: inherit;

              & > div:first-child {
                  flex: 1;
                  display: flex;
                  gap: 4px;
                  padding-left: 4px;
              }

              & > h2 {
                  flex: 1;
                  text-align: center;
                  margin: 0;
                  padding: 0;
              }

              & > div:last-child {
                  flex: 1;
                  display: flex;
                  justify-content: flex-end;
                  padding-right: 4px;
                  gap: 4px;
              }

              button {
                  background: none;
                  border: none;
                  padding: 4px;
                  cursor: pointer;
                  border-radius: 4px;
                  color: var(--font-color);

                  &:hover {
                      background-color: rgba(0, 0, 0, 0.05);
                  }

                  & svg {
                      display: block;
                  }
              }
          }

          svg.connections path {
              &.next {
                  stroke: rgb(var(--secondary-500));
              }

              &.active {
                  stroke: rgb(var(--secondary-500));
              }

              &.preview {
                  stroke: rgb(var(--primary-500));
              }
          }

          trigger-parameter {
              &.next:before {
                  background-color: rgb(var(--secondary-700) / var(--background-alpha)) !important;
              }

              &.preview:before {
                  background-color: rgb(var(--primary-700)) !important;
              }
          }

          graph-state {
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
      }
  `
})