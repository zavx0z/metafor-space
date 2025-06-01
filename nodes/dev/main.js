import {MetaFor} from "../../metafor.js"
import {Nodes} from "../nodes.js"

Nodes.create({
  state: "ожидание патча",
})

MetaFor("node", {description: "Nodes", development: false}).states(
  "начало",
  "конец"
).context((t) => ({
  status: t.enum("start", "end")({title: "Status", default: "start"}),
})).core(() => ({})
).transitions([
  {
    from: "начало",
    action: ({context}) => {
      console.log(context)
    },
    to: [{state: "конец", when: {status: "start"}}],
  },
  {
    from: "конец",
    action: async () => {
      console.log("конец")
    },
    to: [{state: "начало", when: {status: "end"}}],
  },
]).view({
  render: ({html, context}) => html`
      <h1>${context.status}</h1>
  `
}).create({
  state: "начало",
  onTransition: (preview, current, meta) => {
    console.log(preview, current, meta)
  },
  onUpdate: (value) => {
    console.log(value)
  },
})
