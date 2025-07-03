import {MetaFor} from "./metafor.js"

export default MetaFor("roadmap", {description: "MetaFor roadmap", development: false})
  .context((t) => ({
    status: t.enum("start", "end")({title: "Статус", default: "end"}),
  }))
  .core()
  .states("конец", "начало")
  .transitions("начало", [
    {
      in: "начало",
      action: ({update}) => new Promise((resolve) => {
        setTimeout(() => {
          update({status: "end"})
          return resolve()
        }, 6000)
      }),
      to: [{state: "конец", when: {status: "end"}}],
    },
    {
      in: "конец",
      action: ({update}) => new Promise((resolve) => setTimeout(() => {
        update({status: "start"})
        return resolve()
      }, 4000)),
      to: [{state: "начало", when: {status: "start"}}],
    },
  ])
  .reactions([])
  .view({
    // render: ({html, context}) => html`<h1>${context.status === "end" ? "я еще тут!" : "Я тут!"}</h1>`
  })
