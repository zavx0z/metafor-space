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
    canvas: createRef(),
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
        const canvas = /**@type{HTMLCanvasElement}*/ (core.canvas.value)
        if (!canvas) return;
        canvas.width = context.width
        canvas.height = context.height

        // Функция для отрисовки скругленного пути на canvas
        /**
         * @param {CanvasRenderingContext2D} ctx
         * @param {import('./graph-meta.t').Point[]} points
         * @param {number} [radius]
         */
        function drawRoundedPath(ctx, points, radius = 8) {
          if (points.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length - 1; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1];
            if (prev.y === curr.y) { // горизонтальный сегмент
              ctx.lineTo(curr.x - Math.sign(curr.x - prev.x) * radius, curr.y);
              ctx.quadraticCurveTo(curr.x, curr.y, curr.x, curr.y + Math.sign(next.y - curr.y) * radius);
            } else { // вертикальный сегмент
              ctx.lineTo(curr.x, curr.y - Math.sign(curr.y - prev.y) * radius);
              ctx.quadraticCurveTo(curr.x, curr.y, curr.x + Math.sign(next.x - curr.x) * radius, curr.y);
            }
          }
          // Последний сегмент
          const last = points[points.length - 1];
          ctx.lineTo(last.x, last.y);
        }

        // Рисуем edges на canvas
        requestAnimationFrame(() => {
          if (!canvas || !core.edges.length) return
          const ctx = canvas.getContext('2d')
          if (!ctx) return
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          core.edges.forEach(/** @param {import('./graph-meta.t').Edge} edge */edge => {
            // Цвет и стиль линии
            const color = edge.type === 'east-input' ? '#9c27b0' :
              edge.type === 'west' ? '#2196f3' : '#4caf50'
            ctx.strokeStyle = color
            ctx.lineWidth = 2

            // Всегда применяем тень для всех рёбер
            ctx.shadowColor = 'rgba(0,0,0,0.4)'
            ctx.shadowBlur = 4
            ctx.shadowOffsetY = 4

            // Рисуем скругленный путь
            drawRoundedPath(ctx, edge.points, 8)
            ctx.stroke()
            ctx.closePath()
          })

          // Сбросить тень после отрисовки
          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
          ctx.shadowOffsetY = 0
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
        <canvas ${ref(core.canvas)} class="connections"></canvas>
        <slot></slot>
      </section>
    `,
    style: ({css}) => css`
      :host([data-state="позиционирование"]) {
        opacity: 1;
      }

      :host:before {
        content: "";
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        border: 1px solid rgba(var(--surface-800));
        border-radius: inherit;
        pointer-events: none;
        z-index: -2;
        transition: box-shadow 0.3s ease-in-out;
        box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px, rgba(0, 0, 0, 0.2) 0 -3px 0 inset;
      }

      :host:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise' x='0%' y='0%' width='100%' height='100%'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.15'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='white' filter='url(%23noise)'/%3E%3C/svg%3E");
        background-repeat: repeat;
        background-size: contain;
        opacity: 0.1;
        border-radius: inherit;
        z-index: -1;
      }

      :host {
        backdrop-filter: var(--backdrop-filter-blur);
        -webkit-backdrop-filter: var(--backdrop-filter-blur);
        -moz-backdrop-filter: var(--backdrop-filter-blur);
        -o-backdrop-filter: var(--backdrop-filter-blur);
        -ms-backdrop-filter: var(--backdrop-filter-blur);

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
        font-family: "Russo One", 'Courier New', Courier, monospace;

        &::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 12px;
          pointer-events: none;
          z-index: 1;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          box-shadow: 0 6px 12px 0 rgba(0,0,0,0.18), 0 1.5px 3px 0 rgba(0,0,0,0.12);
          opacity: 0.7;
        }

        & > div:first-child {
          flex: 1;
          display: flex;
          gap: 4px;
          padding-left: 4px;
        }

        & > h2 {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
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

      canvas.connections {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        display: block;
      }
    `
  })