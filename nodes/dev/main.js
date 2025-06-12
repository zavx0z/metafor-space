import {MetaFor} from "../../metafor.js"
import "../meta/nodes.js"

// setTimeout(() => {
//   document.body.insertAdjacentHTML('beforeend', '<metafor-test></metafor-test>');
// }, 1000)

MetaFor("test", {description: "Nodes", development: false})
  .states("начало", "конец")
  .context((t) => ({
    status: t.enum("start", "end")({title: "Status", default: "start"}),
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
      action: ({context}) => {
        // console.log(context)
      },
      to: [{state: "конец", when: {status: "start"}}],
    },
    {
      in: "конец",
      action: async () => {
        // console.log("конец")
      },
      to: [{state: "начало", when: {status: "end"}}],
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
