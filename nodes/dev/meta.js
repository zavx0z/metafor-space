import {MetaFor} from "../../metafor.js"

export default MetaFor("test", {description: "Nodes", development: false})
  .states("начало", "конец")
  .context((t) => ({
    status: t.enum("start", "end")({title: "Status", default: "end"}),
  }))
  .core(() => ({})
  )
  .view({
    render: ({html, context}) => html`
    `
  })
  .transitions("начало", [
    {
      in: "начало",
      action: async ({update}) => {
        // await new Promise((resolve) => {
        //   setTimeout(() => {
        //     update({status: "end"})
        //     return resolve('')
        //   }, 1000)
        // })
      },
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
  .create({
    onTransition: (preview, current, meta) => {
      // console.log(preview, current, meta)
    },
    onUpdate: (value) => {
      // console.log(value)
    },
  })
