import {MetaFor} from "../metafor.js"

export default MetaFor('graph-socket')
  .context(t => ({
    id: t.string({title: "ID meta"}),
    state: t.string({title: "Название состояния"}),
    param: t.string({title: "Ключ параметра"}),
    direction: t.enum("west", "east")({title: "Вход/Выход"}),
    parent: t.enum("state", "condition")({title: "Принадлежность"}),
    type: t.enum("string", "number", "boolean", "array", "enum")({title: "Тип параметра", default: "string"}),
    size: t.number({nullable: true}),
    x: t.number({nullable: true}),
    y: t.number({nullable: true}),
    error: t.string({title: "Ошибка", nullable: true}),
  }))
  .core()
  .states("рендер", "измерение")
  .transitions("рендер", [
    {
      in: "рендер",
      action({element, context}) {
        element.dataset['direction'] = typeof context.direction !== "undefined" ? context.direction === 'west' ? 'input' : 'output' : ''
        element.dataset['type'] = context.type || 'string'
      },
      to: [{state: "измерение", when: {error: null}}]
    },
    {
      in: "измерение",
      action({element, update}) {
        requestAnimationFrame(() => {
          const {width, x, y} = element.getBoundingClientRect()
          update({
            size: Math.round(width),
            x: Math.round(x),
            y: Math.round(y),
          })
        })
      },
      to: []
    },
  ])
  .reactions([])
  .view({
    style: ({css}) => {
      const position = -6
      const size = 12
      return css`
        :host {
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 2px solid rgb(var(--surface-400));
          background: rgb(var(--surface-600));
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        :host([data-direction="input"]) {
          left: ${position}px;
          background: rgb(var(--primary-500));
          border-color: rgb(var(--primary-300));
        }

        :host([data-direction="output"]) {
          right: ${position}px;
          background: rgb(var(--secondary-500));
          border-color: rgb(var(--secondary-300));
        }

        :host(.connected) {
          background: rgb(var(--success-400));
          border-color: rgb(var(--success-200));
          box-shadow: 0 0 8px rgb(var(--success-400));
        }

        :host(.connected[data-direction="input"]) {
          background: rgb(var(--success-500));
          border-color: rgb(var(--success-300));
        }

        :host(.connected[data-direction="output"]) {
          background: rgb(var(--success-600));
          border-color: rgb(var(--success-400));
        }

        :host(:hover) {
          transform: scale(1.3);
          z-index: 10;
        }

                :host(:active) {
          transform: scale(0.9);
        }

        :host([data-valid="false"]) {
          background: rgb(var(--error-500));
          border-color: rgb(var(--error-300));
        }

        :host([disabled]) {
          opacity: 0.3;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        /* Цвета по типам параметров */
        :host([data-type="string"]) {
          background: rgb(var(--primary-500));
          border-color: rgb(var(--primary-300));
        }

        :host([data-type="number"]) {
          background: rgb(var(--secondary-500));
          border-color: rgb(var(--secondary-300));
        }

        :host([data-type="boolean"]) {
          background: rgb(var(--warning-500));
          border-color: rgb(var(--warning-300));
        }

        :host([data-type="array"]) {
          background: rgb(var(--tertiary-500));
          border-color: rgb(var(--tertiary-300));
        }

        :host([data-type="enum"]) {
          background: rgb(var(--error-400));
          border-color: rgb(var(--error-200));
        }

        /* Подключенные сокеты по типам */
        :host(.connected[data-type="string"]) {
          background: rgb(var(--primary-400));
          box-shadow: 0 0 8px rgb(var(--primary-400));
        }

        :host(.connected[data-type="number"]) {
          background: rgb(var(--secondary-400));
          box-shadow: 0 0 8px rgb(var(--secondary-400));
        }

        :host(.connected[data-type="boolean"]) {
          background: rgb(var(--warning-400));
          box-shadow: 0 0 8px rgb(var(--warning-400));
        }

        :host(.connected[data-type="array"]) {
          background: rgb(var(--tertiary-400));
          box-shadow: 0 0 8px rgb(var(--tertiary-400));
        }

        :host(.connected[data-type="enum"]) {
          background: rgb(var(--error-300));
          box-shadow: 0 0 8px rgb(var(--error-300));
        }
      `
    },
  })