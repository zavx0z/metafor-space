import ELK from "elkjs"
import {MetaFor} from "../../metafor.js"

export default MetaFor("node-elk", {development: true})
  .states('ожидание', 'получение данных', 'вычисление')
  .context(t => ({
    process: t.string({title: "ID обрабатываемой ноды", nullable: true}),
    ready: t.string({title: "ID готовой ноды", nullable: true}),
    dataReceived: t.boolean({title: "Статус получения данных", default: false}),
    error: t.string({nullable: true})
  }))
  .core(() => ({
    elk: new ELK(),
    /**@type{import("./node-layout.t").DataMetaMap}*/
    meta: new Map()
  }))
  .transitions('ожидание', [
    {
      in: "ожидание",
      to: [{state: "получение данных", when: {process: {isNull: false}}}]
    },
    {
      in: "получение данных",
      action({context, update, core}) {
        if (!context.process) {
          update({error: "Нет ID мета для обработки данных"})
          return
        }
        let meta = core.meta.get(context.process)
        if (!meta) core.meta.set(context.process, {nodes: {}, edges: {}})
      },
      to: [{state: "вычисление", when: {dataReceived: true}}]
    },
    {
      in: "вычисление",
      action({context, update, core}) {
        setTimeout(() => {
          console.log(core.meta)
        }, 1000)
        // update({ready: context.process, process: null})
      },
      to: [{state: "ожидание", when: {process: null}}]
    }
  ])
  .reactions([
    {
      title: "начало создания meta",
      filter: ({patch, meta}) =>
        meta.tag === "nodes-meta"
        && patch.path === '/context'
        // && patch.op === 'add'
        && patch.op === 'replace'
        && Object.hasOwn(patch.value, 'nodes')
        && patch.value.nodes.length
      ,
      action({patch, update}) {
        const meta = patch.value.nodes[patch.value.nodes.length - 1]
        update({process: meta})

      }
    },
    {
      title: "создание meta",
      filter: ({patch, meta}) =>
        meta.tag.includes('node-meta')
        && patch.path === "/"
        && patch.op === "add"
      ,
      action({meta, patch, core, update}) {
        const entity = core.meta.get(patch.value.context.id)
        if (!entity) {
          update({error: `В карте данных мет, отсутствует мета: ${patch.value.context.id}`})
          return
        }
        if (meta.tag === "node-meta-condition")
          entity.edges[patch.value.id] = {
            from: patch.value.context.from,
            to: patch.value.context.to,
          }
        else if (meta.tag === "node-meta-state")
          entity.nodes[patch.value.id] = {
            state: patch.value.context.state
          }
      }
    },
    {
      title: "получение размеров",
      filter: ({patch, meta}) =>
        meta.tag.includes('node-meta')
        && patch.path === "/context"
        && patch.op === "replace"
        && Object.hasOwn(patch.value, "width")
        && Object.hasOwn(patch.value, "height")
        && (meta.tag === "node-meta-condition" || meta.tag === "node-meta-state")
      ,
      action({meta, patch, core, update, context}) {
        if (!context.process) {
          update({error: `При получении размеров отсутствует process в контексте`})
          return
        }
        const entity = core.meta.get(context.process)
        if (!entity) {
          update({error: `В карте данных мет, отсутствует мета: ${context.process}`})
          return
        }
        const id = `${meta.tag}/${meta.index}`
        if (meta.tag === "node-meta-condition") {
          entity.edges[id]["width"] = patch.value.width
          entity.edges[id]["height"] = patch.value.height
        } else if (meta.tag === "node-meta-state") {
          entity.nodes[id]["width"] = patch.value.width
          entity.nodes[id]["height"] = patch.value.height
        }
      }
    },
    {
      title: "конец создания meta",
      filter: ({patch, meta}) =>
        meta.tag === "nodes-meta"
        && patch.path === '/context'
        // && patch.op === 'remove'
        && patch.op === 'replace'
        && Object.hasOwn(patch.value, 'nodes')
        && !patch.value.nodes.length
      ,
      action({update}) {
        update({dataReceived: true})
      }
    }
  ])
  .create()