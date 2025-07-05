import {MetaFor} from "./metafor.js"

await import ("./graph/graph-nodes.js")

export default MetaFor("roadmap", {description: "MetaFor RoadMap", development: false})
  .context((t) => ({
    status: t.enum("start", "process", "end")({title: "Статус", default: "end"}),
    error: t.string({title: "Ошибка", nullable: true})
  }))
  .core()
  .reactions({})
  .states("конец", "в процессе", "начало")
  .transitions("начало", [
    {
      in: "начало",
      action: () => new Promise((resolve) => {
        setTimeout(() => {
          resolve({status: "end"})
        }, 6000)
      }),
      to: {
        "конец": {status: "end"},
        "в процессе": {status: "process"}
      },
    },
    {
      in: "конец",
      to: {
        "начало": {status: "start"}
      },
    },
    // {
    //   in: "в процессе",
    //   to: {
    //     "конец": {status: "end"}
    //   }
    // }
  ])
  .view({
    // render: ({html, context}) => html`<h1>${context.status === "end" ? "я еще тут!" : "Я тут!"}</h1>`
  })
