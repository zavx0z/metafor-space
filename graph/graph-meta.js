import {MetaFor} from "../metafor.js"
import {collectEdges, getSimpleRoundedPath} from "./graph-meta.actions.js"
import {createRef} from "../html/directives/ref.js"

export default MetaFor("graph-meta", {development: true, description: "Node"})
  .context(t => ({
    id: t.string({title: "ID meta"}),
    width: t.number({nullable: true}),
    height: t.number({nullable: true}),
    error: t.string({title: "Ошибка", nullable: true})
  }))
  .core(() => ({
    header: createRef(),
    svg: createRef(),
    /**@type{import('./graph-meta.t').Edge[]} */
    edges: []
  }))
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
      action({element, context, core}) {
        const headerBB = /**@type{DOMRect} */ (core.header?.value?.getBoundingClientRect())
        element.style.cssText = `width: ${context.width}px; height: ${context.height + headerBB.height}px;`
        const svg = /**@type{SVGElement}*/ (core.svg.value)
        svg.style.cssText = `width: ${context.width}px; height: ${context.height}px;`

        // Отрисовываем edges после установки размеров
        requestAnimationFrame(() => {
          if (!svg || !core.edges.length) return

          // Очищаем существующие пути
          Array.from(svg.querySelectorAll('path')).forEach(path => path.remove())

          // Создаем новые пути
          core.edges.forEach(/** @param {import('./graph-meta.t').Edge} edge */edge => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            path.id = edge.id
            path.setAttribute('d', getSimpleRoundedPath(edge.points, 8))
            path.setAttribute('fill', 'none')
            path.setAttribute('stroke-width', '2')

            // Устанавливаем класс и цвет в зависимости от типа
            const className = edge.type === 'east-input' ? 'next' :
              edge.type === 'west' ? 'active' : 'preview'
            path.setAttribute('class', className)

            const color = edge.type === 'east-input' ? '#9c27b0' :
              edge.type === 'west' ? '#2196f3' : '#4caf50'
            path.setAttribute('stroke', color)

            svg.appendChild(path)
          })

          // console.log(`Создано ${core.edges.length} SVG путей`)
        })
      },
      to: []
    }
  ])
  .reactions([
    {
      title: "вычисленное положение",
      filter: ({meta, patch}) => meta.tag === "graph-layout"
        && patch.path === "/state"
        && patch.value === "ожидание"
      ,
      action({context, update, core}) {
        const data = sessionStorage.getItem(context.id)
        if (!data) {
          update({error: "Нет данных разметки"})
          return
        }
        /**@type{import("./graph-layout.t").TypedLayoutResult}*/
        const layout = JSON.parse(data)
        core.edges = collectEdges(layout)
        update({width: layout.width, height: layout.height})
      }
    }
  ])
  .view({
    render: ({html, context, core, ref}) => html`
      <header ${ref(core.header)} data-drag-selector="graph-atom">
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
        <svg ${ref(core.svg)} class="connections"></svg>
        <slot></slot>
      </section>
    `,
    style: ({css}) => css`
      :host([data-state="позиционирование"]) {
        opacity: 1;
      }

      :host {
        --font-color: rgb(var(--surface-50));
        --background-color: rgba(var(--surface-100) / calc(var(--background-alpha) * 0.1));

        position: fixed;
        display: flex;
        flex-direction: column;
        user-select: none;
        will-change: transform;
        box-sizing: border-box;
        border-radius: 7px;
        opacity: 0;
        transition: opacity .4s ease-in-out;
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
        border-bottom-right-radius: inherit;
        border-bottom-left-radius: inherit;
        width: 100%;
        height: 100%;
      }

      svg.connections {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;

        & path {
          stroke: #888;
          stroke-width: 2;
          fill: none;
          transition: stroke 0.3s ease;

          &.next {
            stroke: #9c27b0;
          }

          &.active {
            stroke: #2196f3;
          }

          &.preview {
            stroke: #4caf50;
          }
        }
      }
    `
  })