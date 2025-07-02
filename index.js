import {MetaFor} from "./metafor.js"

export default MetaFor("test", {description: "Nodes", development: false})
  .context((t) => ({
    status: t.enum("start", "end")({title: "Статус", default: "end"}),
  }))
  .core()
  .states("конец", "начало" )
  .transitions("начало", [
    {
      in: "начало",
      to: [{state: "конец", when: {status: "end"}}],
    },
    {
      in: "конец",
      action: async ({update}) => {
        await new Promise((resolve) => {
          setTimeout(() => {
            update({status: "start"})
            return resolve('')
          }, 1000)
        })
      },
      to: [{state: "начало", when: {status: "start"}}],
    },
  ])
  .reactions([])
  .view({
    render: ({html, context}) => html`
    `
  })
