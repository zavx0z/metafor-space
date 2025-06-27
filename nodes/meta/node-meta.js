import {MetaFor} from "../../metafor.js"
import "./node-meta-context.js"
import "./node-meta-transition.js"

export default MetaFor("node-meta", {development: true, description: "Node"})
  .context(t => ({
    id: t.string({title: "ID meta"}),
    width: t.number({nullable: true}),
    height: t.number({nullable: true}),
    error: t.string({title: "Ошибка", nullable: true}),
  }))
  .core(() => ({}))
  .states("рендер", "позиционирование")
  .transitions("рендер", [
    {
      in: "рендер",
      to: [{
        state: "позиционирование", when: {width: {isNull: false}, height: {isNull: false}}
      }]
    },
    {
      in: "позиционирование",
      action({element, context, update}) {
        element.style.cssText = `width: ${context.width}px; height: ${context.height}px;`
      },
      to: []
    }
  ])
  .reactions([
    {
      title: "вычисленное положение",
      filter: ({meta, patch}) => meta.tag === "node-layout"
        && patch.path === "/state"
        && patch.value === "ожидание"
      ,
      action({context, update}) {
        const data = sessionStorage.getItem(context.id)
        if (!data) {
          update({error: "Нет данных разметки"})
          return
        }
        /**@type{import("elkjs").ElkNode}*/
        const layout = JSON.parse(data)
        console.log(layout)
        // const layoutState = layout.children?.find(i => i.id === context.state)
        // @ts-ignore
        update({width: layout.width, height: layout.height})
      }
    }
  ])
  .view({
    render: ({html, context}) => html`
      <header data-drag-selector="graph-atom">
        <div><!--кнопки слева--></div>
        <h2 class="noselect">${context.id}</h2>
        <div><!--кнопки справа-->
          <button aria-label="Редактировать">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor">
              <path
                d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"/>
            </svg>
          </button>
        </div>
      </header>
      <section class="content" data-drag-selector="graph-atom">
        <atom-svg></atom-svg>
        <slot name="conditions"></slot>
        <slot name="state"></slot>
      </section>
    `,
    style: ({css}) => {
      const borderRadius = "7px"
      return css`
        :host {
          --font-color: rgb(var(--surface-50));
          --background-color: rgba(var(--surface-100) / calc(var(--background-alpha) * 0.1));

          width: 4444px;
          height: 4444px;
          position: absolute;
          display: flex;
          flex-direction: column;
          min-width: fit-content;
          user-select: none;
          will-change: transform;
          box-sizing: border-box;
          border-radius: ${borderRadius};
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }

        :host([data-state="позиционирование"]) {
          opacity: 1;
        }

        header {
          --background-color: rgba(var(--surface-500) / var(--background-alpha));

          position: relative;
          padding: 8px 6px;
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

        section {
          display: flex;
          position: relative;
          background-color: var(--background-color);
          width: 100%;
          height: 100%;
          border-bottom-right-radius: inherit;
          border-bottom-left-radius: inherit;
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
      `
    }
  })