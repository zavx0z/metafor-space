import {MetaFor} from "../../metafor.js"

export default MetaFor('node-meta-socket')
  .context(t => ({
    id: t.string({title: "ID meta"}),
    state: t.string({title: "Название состояния"}),
    param: t.string({title: "Ключ параметра"}),
    direction: t.enum("west", "east")({title: "Вход/Выход"}),
    parent: t.enum("state", "condition")({title: "Принадлежность"}),
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
      to: [{state: "измерение", when: {error: null}}]
    },
    {
      in: "измерение",
      action({element, update}) {
        requestAnimationFrame(() => {
          const {width, height, x, y} = element.getBoundingClientRect()
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
          --socket-size: 12;
          --background-color: rgb(var(--secondary-500));

          position: absolute;
          opacity: 1;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          box-sizing: border-box;
          border: 1px solid var(--background-color);
          background-color: var(--background-color);
          cursor: pointer;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.25);
          transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
        }

        :host::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: inherit;
          transform: scale(1);
          transition: transform 0.3s ease;
        }

        :host([data-direction="input"]) {
          left: ${position}px;
        }

        :host([data-direction="output"]) {
          right: ${position}px;
        }

        :host(.connected) {
          transition: all 0.3s ease;

          &::before {
            transform: scale(0.5);
          }
        }

        :host:not(.connected) {
          filter: contrast(0.5) brightness(0.5);
          transition: all 0.3s ease;

          &::before {
            filter: contrast(0.5) brightness(0.5);
            transition: all 0.3s ease;
          }
        }
      `
    },
  })