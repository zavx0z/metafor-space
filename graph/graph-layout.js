import ELK from "elkjs"
import {MetaFor} from "../metafor.js"
import {createElkData} from "./graph-layout.actions.js"

export default MetaFor("graph-layout", {development: true})
  .context(t => ({
    current: t.string({title: "ID ноды meta передающий данные", nullable: true}),
    ready: t.string({title: "ID готовой ноды meta", nullable: true}),
    data: t.boolean({title: "Статус получения данных элементов от nodes-meta", default: false}),
    metrics: t.boolean({title: "Статус получения размеров и позиций от нодовых эл-ов", default: false}),
    error: t.string({nullable: true})
  }))
  .core(() => ({
    elk: new ELK(),
    /**@type{import("./graph-layout.t").MetricsMap}*/
    meta: new Map(),
    /**@type{import("elkjs").ElkNode|null}*/
    data: null,
    /**@type{number}*/
    count: 0,
    /** @type{import("./graph-layout.t").LayoutConfig} */
    config: {
      base: {
        "elk.layered.spacing.edgeEdgeBetweenLayers": 20,
        "elk.spacing.edgeEdge": 20,
        "elk.spacing.edgeNode": 20,
        "hierarchyHandling": "INCLUDE_CHILDREN",
        "elk.layered.layering.strategy": "LONGEST_PATH_SOURCE",
        "elk.padding": "[top=20.0, left=20.0, bottom=20.0, right=20.0]",
        "considerModelOrder.strategy": "PREFER_NODES",
        "elk.port.size": 12,
        // "elk.direction": "DOWN"
      },
      meta: {
        "elk.padding": "[top=0.0, left=0.0, bottom=0.0, right=0.0]",
        "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
      },
      state: {
        "portConstraints": "FIXED_POS",
      },
      condition: {},
      operator: {
        "portConstraints": "FIXED_SIDE",
        "portAlignment.west": "JUSTIFIED",
        "portAlignment.east": "JUSTIFIED",
      },
      port: {
        west: {
          "port.side": "WEST",
        },
        east: {
          "port.side": "EAST",
        },
      },
    }
  }))
  .reactions({
    "начало создания meta": {
      filter: ({patch, meta}) => (
        meta.tag === "graph-listener"
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
    "элементы": {
      filter: ({patch, meta, context}) => Boolean(
        context.current
        && meta.tag.includes('graph-')
        && patch.path === "/"
        && patch.op === "add"
        && ["graph-context", "graph-condition", "graph-socket", "graph-param"].includes(meta.tag)
      ),
      action({meta, patch, update, core}) {
        const entity = core.meta.get(patch.value.context.id)
        if (!entity) {
          update({error: `При получении элементов, в карте данных, отсутствует мета: ${patch.value.context.id}`})
          console.error(meta, patch)
          return
        }
        if (meta.tag === "graph-context")
          entity.states[patch.value.id] = {
            state: patch.value.context.state
          }
        else if (meta.tag === "graph-condition")
          entity.conditions[patch.value.id] = {
            from: patch.value.context.from,
            param: patch.value.context.param,
            to: patch.value.context.to,
          }
        else if (meta.tag === "graph-socket")
          entity.sockets[patch.value.id] = {
            state: patch.value.context.state,
            parent: patch.value.context.parent,
            direction: patch.value.context.direction,
            param: patch.value.context.param,
          }
        else if (meta.tag === "graph-param")
          entity.params[patch.value.id] = {
            state: patch.value.context.state,
            param: patch.value.context.param,
          }
        else return
        core.count = core.count + 1
      }
    },
    "размеры": {
      filter: ({patch, meta, context}) => Boolean(
        context.current
        && meta.tag.includes('graph-')
        && patch.path === "/context"
        && patch.op === "replace"
        && (Object.hasOwn(patch.value, "x")
          || Object.hasOwn(patch.value, "y")
          || Object.hasOwn(patch.value, "width")
          || Object.hasOwn(patch.value, "height")
        )
        && ["graph-context", "graph-condition", "graph-socket", "graph-param"].includes(meta.tag)
      ),
      action({meta, patch, core, update, context}) {
        const entity = core.meta.get(context.current)
        if (!entity) {
          update({error: `При получении размеров в карте данных, отсутствует мета: ${context.current}`})
          console.error(meta, patch)
          return
        }
        const id = `${meta.tag}/${meta.index}`
        if (meta.tag === "graph-context") {
          entity.states[id]["width"] = patch.value.width
          entity.states[id]["height"] = patch.value.height
          entity.states[id]["x"] = patch.value.x
          entity.states[id]["y"] = patch.value.y
        } else if (meta.tag === "graph-condition") {
          entity.conditions[id]["width"] = patch.value.width
          entity.conditions[id]["height"] = patch.value.height
        } else if (meta.tag === "graph-socket") {
          entity.sockets[id]["size"] = patch.value.size
          entity.sockets[id]["x"] = patch.value.x
          entity.sockets[id]["y"] = patch.value.y
        } else if (meta.tag === "graph-param") {
          entity.params[id]["width"] = patch.value.width
          entity.params[id]["height"] = patch.value.height
          entity.params[id]["x"] = patch.value.x
          entity.params[id]["y"] = patch.value.y
        }
        core.count = core.count - 1
        if (!core.count) update({metrics: true})
      }
    },
    "конец создания meta": {
      filter: ({patch, meta, context}) => Boolean(
        context.current
        && meta.tag === "graph-listener"
        && patch.path === '/context'
        // && patch.op === 'remove'
        && patch.op === 'replace'
        && Object.hasOwn(patch.value, 'nodes')
        && !patch.value.nodes.length
      ),
      action({update}) {
        update({data: true})
      }
    }
  })
  .states('ожидание', 'получение данных', "форматирование данных", 'вычисление')
  .transitions('ожидание', [
    {
      in: "ожидание",
      to: [{state: "получение данных", when: {current: {isNull: false}}}]
    },
    {
      in: "получение данных",
      action({context, core}) {
        if (!context.current) throw new Error("Нет ID мета для обработки данных")
        let meta = core.meta.get(context.current)
        if (!meta) core.meta.set(context.current, {
          states: {}, conditions: {}, sockets: {}, params: {}
        })
      },
      to: [{state: "форматирование данных", when: {data: true, metrics: true}}]
    },
    {
      in: "форматирование данных",
      action({core, context}) {
        const dataMeta = core.meta.get(context.current)
        if (!dataMeta) return
        core.data = createElkData(context.current, dataMeta, core.config)
        return {current: null}
      },
      to: [{state: "вычисление", when: {current: {isNull: true}}}]
    },
    {
      in: "вычисление",
      action: ({core}) => new Promise(async (resolve, reject) => {
        if (!core.data) return reject("ошибка вычисления")
        const layout = await core.elk.layout(core.data)
        // console.log(layout)
        sessionStorage.setItem(core.data.id, JSON.stringify(layout))
        return resolve({ready: core.data.id, current: null})
      }),
      to: [{state: "ожидание", when: {current: null}}]
    }
  ])
  .view({
    render: ({html}) => html`
      <slot></slot>
    `,
    style: ({css}) => css`
      :host {
        width: 100vw;
        height: 100vh;
      }
    `
  })

