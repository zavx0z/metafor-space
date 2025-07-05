import {MetaFor} from "../metafor.js"
import "./graph-layout.js"
import "./graph-listener.js"
import "./graph-meta.js"
import "./graph-state.js"
import "./graph-context.js"
import "./graph-param.js"
import "./graph-condition.js"

export default MetaFor("graph-nodes", {
  description: "",
  development: true
})
  .context(t => ({
    error: t.string({title: "Ошибка", nullable: true}),
    queue: t.array({title: "Очередь акторов для добавления"})
  }))
  .core()
  .reactions({
    "Блокировка всплытия": {
      filter: () => true,
      block: true,
      action() {
      }
    },
    "получение списка добавляемых акторов": {
      filter: ({meta, patch}) => meta.tag === "graph-listener"
        && patch.path === "/context"
        && patch.value.op === "add"
        && patch.value.nodes?.length
      ,
      action({meta, patch}) {
        // console.log(meta, patch)
      }
    }
  })
  .states("render", "центрирование одной ноды")
  .transitions("render", [
    {
      in: "render",
      to: {"центрирование одной ноды": {error: null, queue: {length: 1}}}
    },
    {
      in: "центрирование одной ноды", 
      to: {"render": {error: {isNull: false}}}
    }
  ])
  .view({
    render: ({html}) => html`
      <metafor-graph-layout>
        <metafor-graph-listener/>
      </metafor-graph-layout>
    `,
    style: ({css}) => css`
      :host {
        color: rgb(var(--surface-50));
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
      }
    `,
  })
