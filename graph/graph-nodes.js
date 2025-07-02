import {MetaFor} from "../metafor.js"
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
    op: t.enum("add")({title: "Тип патча", nullable: true}),
    metas: t.array({title: "Коллекция meta"}),
    error: t.string({title: "Ошибка", nullable: true}),
  }))
  .core()
  .states("render")
  .transitions("render", [])
  .reactions([
    {
      title: "",
      filter: ({meta, patch}) => meta.tag === "graph-listener"
        && patch.path === "/context"
      ,
      action({meta, patch}) {
        console.log(patch)
      }
    }
  ])
  .view({
    render: ({html}) => html`
      <slot></slot>
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
