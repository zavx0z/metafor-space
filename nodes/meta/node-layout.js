import ELK from "elkjs"
import {MetaFor} from "../../metafor.js"

export default MetaFor("node-elk", {development: true})
  .context(t => ({
    current: t.string({title: "ID ноды meta передающий данные", nullable: true}),
    ready: t.string({title: "ID готовой ноды meta", nullable: true}),
    count: t.number({title: "Счетчик обрабатываемых элементов ноды meta", default: 0}),
    dataReceived: t.boolean({title: "Статус получения данных элементов от nodes-meta", default: false}),
    error: t.string({nullable: true})
  }))
  .core(() => ({
    elk: new ELK(),
    /**@type{import("./node-layout.t").DataMetaMap}*/
    meta: new Map(),
    config: {
      base: {
        "elk.layered.spacing.edgeEdgeBetweenLayers": "36",
        "elk.spacing.edgeEdge": "36",
        // "elk.spacing.edgeNode": "36",
        "hierarchyHandling": "INCLUDE_CHILDREN",
        'elk.layered.layering.strategy': 'LONGEST_PATH_SOURCE',
        "elk.padding": "[top=20.0, left=20.0, bottom=20.0, right=20.0]",
        "considerModelOrder.strategy": 'PREFER_NODES'
      },
      meta: {
        'elk.spacing.nodeNode': "0",
        'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
      },
      state: {
        'elk.spacing.nodeNode': "0",
        "elk.padding": "[top=0.0, left=0.0, bottom=0.0, right=0.0]",
        "portConstraints": "FIXED_POS"
      },
      condition: {
        "elk.spacing.nodeNode": "0",
        "elk.padding": "[top=0.0, left=0.0, bottom=0.0, right=0.0]"
      },
      operator: {
        "portConstraints": "FIXED_SIDE",
        "portAlignment.west": "JUSTIFIED",
      },
      port: {
        west: {
          "port.side": "WEST"
        }
      }
    }
  }))
  .states('ожидание', 'получение данных', "форматирование данных", 'вычисление')
  .transitions('ожидание', [
    {
      in: "ожидание",
      to: [{state: "получение данных", when: {current: {isNull: false}}}]
    },
    {
      in: "получение данных",
      action({context, update, core}) {
        if (!context.current) {
          update({error: "Нет ID мета для обработки данных"})
          return
        }
        let meta = core.meta.get(context.current)
        if (!meta) core.meta.set(context.current, {
          states: {}, conditions: {}, sockets: {}, params: {}
        })
      },
      to: [{state: "форматирование данных", when: {dataReceived: true, count: 0}}]
    },
    {
      in: "форматирование данных",
      action({core}) {
        console.log(core.meta)
      },
      to: [{state: "вычисление", when: {current: null}}]
    },
    {
      in: "вычисление",
      action({core}) {
        console.log(core.meta)
        // update({ready: context.current, current: null})
      },
      to: [{state: "ожидание", when: {current: null}}]
    }
  ])
  .reactions([
    {
      title: "Блокировка всплытия",
      filter: () => true,
      block: true,
      action() {
      }
    },
    {
      title: "начало создания meta",
      filter: ({patch, meta}) => (
        meta.tag === "nodes-meta"
        && patch.path === '/context'
        // && patch.op === 'add'
        && patch.op === 'replace'
        && Object.hasOwn(patch.value, 'nodes')
        && patch.value.nodes.length
      ),
      action({patch, update}) {
        const meta = patch.value.nodes[patch.value.nodes.length - 1]
        update({current: meta})
      }
    },
    {
      title: "элементы",
      filter: ({patch, meta}) => (
        meta.tag.includes('node-meta')
        && patch.path === "/"
        && patch.op === "add"
        && meta.tag !== "node-meta"
        && meta.tag !== "node-meta-operator"
      ),
      action({meta, patch, core, update, context}) {
        const entity = core.meta.get(patch.value.context.id)
        if (!entity) {
          update({error: `При получении элементов, в карте данных, отсутствует мета: ${patch.value.context.id}`})
          console.error(meta, patch)
          return
        }
        if (meta.tag === "node-meta-state")
          entity.states[patch.value.id] = {
            state: patch.value.context.state
          }
        else if (meta.tag === "node-meta-condition")
          entity.conditions[patch.value.id] = {
            from: patch.value.context.from,
            param: patch.value.context.param,
            to: patch.value.context.to,
          }
        else if (meta.tag === "node-meta-socket")
          entity.sockets[patch.value.id] = {
            state: patch.value.context.state,
            param: patch.value.context.param,
          }
        else if (meta.tag === "node-meta-param")
          entity.params[patch.value.id] = {
            state: patch.value.context.state,
            param: patch.value.context.param,
          }
        update({count: context.count + 1})
      }
    },
    {
      title: "размеры",
      filter: ({patch, meta}) => (
        meta.tag.includes('node-meta')
        && patch.path === "/context"
        && patch.op === "replace"
        // && Object.hasOwn(patch.value, "x")
        // && Object.hasOwn(patch.value, "y")
        && meta.tag !== "node-meta"
        && meta.tag !== "node-meta-operator"
      ),
      action({meta, patch, core, update, context}) {
        if (!context.current) {
          update({error: `При получении размеров отсутствует current в контексте`})
          return
        }
        const entity = core.meta.get(context.current)
        if (!entity) {
          update({error: `При получении размеров в карте данных, отсутствует мета: ${context.current}`})
          console.error(meta, patch)
          return
        }
        const id = `${meta.tag}/${meta.index}`
        if (meta.tag === "node-meta-state") {
          entity.states[id]["width"] = patch.value.width
          entity.states[id]["height"] = patch.value.height
          entity.states[id]["x"] = patch.value.x
          entity.states[id]["y"] = patch.value.y
        } else if (meta.tag === "node-meta-condition") {
          entity.conditions[id]["width"] = patch.value.width
          entity.conditions[id]["height"] = patch.value.height
        } else if (meta.tag === "node-meta-socket") {
          entity.sockets[id]["size"] = patch.value.size
          entity.sockets[id]["x"] = patch.value.x
          entity.sockets[id]["y"] = patch.value.y
        } else if (meta.tag === "node-meta-param") {
          entity.params[id]["width"] = patch.value.width
          entity.params[id]["height"] = patch.value.height
          entity.params[id]["x"] = patch.value.x
          entity.params[id]["y"] = patch.value.y
        }
        update({count: context.count - 1})
      }
    },
    {
      title: "конец создания meta",
      filter: ({patch, meta}) => (
        meta.tag === "nodes-meta"
        && patch.path === '/context'
        // && patch.op === 'remove'
        && patch.op === 'replace'
        && Object.hasOwn(patch.value, 'nodes')
        && !patch.value.nodes.length
      ),
      action({update}) {
        update({dataReceived: true})
      }
    }
  ])
  .view({
    render: ({html}) => html`
      <metafor-nodes-meta>
      </metafor-nodes-meta>
    `,
    style: ({css}) => css`
      :host {
        width: 100vw;
        height: 100vh;
      }
    `
  })