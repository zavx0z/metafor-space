import {MetaFor} from "../../metafor.js"
import "./node-meta-param.js"

export default MetaFor('node-meta-state', {
  description: "Нода состояния meta",
  development: true
})
  .context(t => ({
    id: t.string({title: "ID meta"}),
    state: t.string({title: "Название состояния"}),
    error: t.string({title: "Ошибка", nullable: true}),
    width: t.number({nullable: true}),
    height: t.number({nullable: true}),
    x: t.number({nullable: true}),
    y: t.number({nullable: true}),
  }))
  .core(() => ({
    /**@type{import("./node-meta-state.t").Params}*/
    params: new Map(),
    /**@type{import("./node-meta-state.t").Sockets}*/
    sockets: new Map(),
    count: 0
  }))
  .states("рендер", "измерение", "установка положения")
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
            width: Math.round(width),
            height: Math.round(height),
            x: Math.round(x),
            y: Math.round(y),
          })
        })
      },
      to: [{state: "установка положения", when: {x: {isNull: false}, y: {isNull: false}}}]
    },
    {
      in: "установка положения",
      action() {
        console.log()
      },
      to: []
    },
  ])
  .reactions([
    {
      title: "Блокировка",
      filter: () => true,
      block: true,
      action() {
      }
    },
    {
      title: "Элементы параметров",
      filter: ({meta, patch}) => patch.path === '/' && meta.tag === "node-meta-param",
      action: ({patch, core}) => {
        core.params.set(patch.value.id, {param: patch.value.context.param, width: 0, height: 0, x: 0, y: 0})
        core.count += 1
      }
    },
    {
      title: "Размеры параметров",
      filter: ({meta, patch}) => patch.path === '/context' && meta.tag === "node-meta-param",
      action({meta, patch, core, update}) {
        const param = core.params.get(`${meta.tag}/${meta.index}`)
        if (!param) {
          update({error: `Отсутствует параметр: ${meta.tag}/${meta.index}`})
          return
        }
        param.width = patch.value.width
        param.height = patch.value.height
        param.x = patch.value.x
        param.y = patch.value.y
        core.count -= 1
        if (!core.count) update({})
      }
    },
    {
      title: "Элементы сокетов",
      filter: ({patch, meta}) => patch.path === '/' && meta.tag === "node-meta-socket",
      action: ({patch, core}) => {
        core.sockets.set(patch.value.id,
          {param: patch.value.context.param, direction: patch.value.context.direction, size: 0, x: 0, y: 0})
        core.count += 1
      }
    },
    {
      title: "Размеры сокетов",
      filter: ({meta, patch}) => patch.path === '/context' && meta.tag === "node-meta-socket",
      action({meta, patch, core, update}) {
        const socket = core.sockets.get(`${meta.tag}/${meta.index}`)
        if (!socket) {
          update({error: `Отсутствует сокет: ${meta.tag}/${meta.index}`})
          return
        }
        socket.size = patch.value.size
        socket.x = patch.value.x
        socket.y = patch.value.y
        core.count -= 1
        if (!core.count) update({})
      }
    },
    // if (meta.tag === "node-meta-param") {
    //   /**@type{import("./node-meta-param.t").MetaParam['context']}*/
    //   const value = patch.value
    //   core.params[value.param] = {
    //     width: value.width,
    //     height: value.height,
    //     x: value.x,
    //     y: value.y
    //   }
    // } else if (meta.tag === "node-meta-socket") {
    //   /**@type{import("./node-meta-socket.t").MetaSocket['context']}*/
    //   const value = patch.value
    //   // core.params[value.param].socketSize = value.size
    //   core.params[value.param][value.direction] = {
    //     x: value.x,
    //     y: value.y
    //   }
    // }
    // console.log(core.params)

    // console.log(patch.value.context.param)
    // if (!core.params[patch.value.context.param]) core.params[patch.value.context.param] = {}
    // if (meta.tag === "node-meta-param") {
    //   core.params[patch.value.context.param] = {id: patch.value.id}
    // } else if (meta.tag === "node-meta-socket") {
    //   /**@type{import("./node-meta-socket.t").MetaSocket}*/
    //   const snapshot = patch.value
    //   core.params[snapshot.context.param][snapshot.context.direction] = {id: patch.value.id}
    // }
    // core.count += 1
  ])
  .view({
    onMount({core}) {
      setTimeout(() => {
        // console.log(core.params)
        // console.log(core.sockets)
      }, 1000)
    },
    render: ({context, html}) => html`
      <header>
        <h2 class="noselect">${context.state}</h2>
      </header>
      <section>
        <slot></slot>
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

        & > section {
          background: var(--background-color);
        }
      }

      :host:has(> :nth-child(2)) > header {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }

      :host:has(> :nth-child(2)) > header::before {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }

      :host:has(> :nth-child(2)) > section {
        padding: 8px 8px 0 8px;
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--background-color);
      }

      :host:has(> :nth-child(2)) > section:last-child {
        padding-bottom: 8px;
        border-bottom-left-radius: var(--node-border-radius);
        border-bottom-right-radius: var(--node-border-radius);
      }

      header {
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
  })
