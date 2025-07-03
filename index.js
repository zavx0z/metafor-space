import {MetaFor} from "./metafor.js"

export default MetaFor("roadmap", {description: "MetaFor roadmap", development: false})
  .context((t) => ({
    status: t.enum("start", "end")({title: "Статус", default: "end"}),
    error: t.string({title: "Ошибка", nullable: true})
  }))
  .core()
  .states("конец", "начало")
  .transitions("начало", [
    {
      in: "начало",
      action: () => new Promise((resolve, reject) => {
        try {
          setTimeout(() => {
            return resolve("end")
          }, 6000)  
        } catch (error) {
          return reject(error instanceof Error ? error.message : String(error))
        }
      }),
      success: ({update, data}) => update({status: data}),
      error: ({update, data}) => update({error: data}),
      to: [{state: "конец", when: {status: "end"}}],
    },
    {
      in: "конец",
      action: () => new Promise((resolve) => setTimeout(() => {
        return resolve("start")
      }, 4000)),
      success: ({update, data}) => update({status: data}),
      to: [{state: "начало", when: {status: "start"}}],
    },
  ])
  .reactions([])
  .view({
    // render: ({html, context}) => html`<h1>${context.status === "end" ? "я еще тут!" : "Я тут!"}</h1>`
  })
