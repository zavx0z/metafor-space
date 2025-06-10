import {MetaFor} from "../../metafor.js"
import "../nodes.js"

// setTimeout(() => {
//   document.body.insertAdjacentHTML('beforeend', '<metafor-test></metafor-test>');
// }, 1000)

MetaFor("test", {description: "Nodes", development: false}).states(
  "начало",
  "конец"
).context((t) => ({
  status: t.enum("start", "end")({title: "Status", default: "start"}),
})).core(() => ({})
).transitions("начало", [
  {
    from: "начало",
    action: ({context}) => {
      // console.log(context)
    },
    to: [{state: "конец", when: {status: "start"}}],
  },
  {
    from: "конец",
    action: async () => {
      // console.log("конец")
    },
    to: [{state: "начало", when: {status: "end"}}],
  },
]).view({
  render: ({html, context}) => html`
  `
}).create({
  onTransition: (preview, current, meta) => {
    console.log(preview, current, meta)
  },
  onUpdate: (value) => {
    console.log(value)
  },
})
