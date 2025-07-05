import {MetaFor} from "./metafor.js"
await import ("./graph/graph-nodes.js")

export default MetaFor("roadmap", {description: "MetaFor roadmap", development: false})
  .context((t) => ({
    status: t.enum("start", "end")({title: "Статус", default: "end"}),
    error: t.string({title: "Ошибка", nullable: true})
  }))
  .core()
  .reactions([])
  .states("конец", "начало")
  .transitions("начало", [
    {
      in: "начало",
      action: () => new Promise((resolve) => {
        setTimeout(() => {
          resolve({status: "end"})
        }, 6000)
      }),
      to: {"конец": {status: "end"}},
    },
    {
      in: "конец",
      to: {"начало": {status: "start"}},
    }
  ])
  .view({
    // render: ({html, context}) => html`<h1>${context.status === "end" ? "я еще тут!" : "Я тут!"}</h1>`
  })
