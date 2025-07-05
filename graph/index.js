import {MetaFor} from "../metafor.js"

export default MetaFor("test", {description: "Nodes", development: false})
  .context((t) => ({
    status: t.enum("start", "end")({title: "Статус", default: "end"}),
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
      to: {"конец": {status: "end"}}
    },
    {
      in: "конец",
      to: {"начало": {status: "start"}}
    }
  ])
  .view({})
