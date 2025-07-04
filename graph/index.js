import {MetaFor} from "../metafor.js"

export default MetaFor("test", {description: "Nodes", development: false})
  .context((t) => ({
    status: t.enum("start", "end")({title: "Статус", default: "end"}),
  }))
  .core()
  .states("конец", "начало")
  .transitions("начало", [
    {
      in: "начало",
      action: () => new Promise((resolve) =>
        setTimeout(() => resolve({status: "end"}), 4000)),
      to: [{state: "конец", when: {status: "end"}}]
    },
    {
      in: "конец",
      action: () => new Promise((resolve) =>
        setTimeout(() => resolve({status: "start"}), 4000)),
      to: [{state: "начало", when: {status: "start"}}]
    },
  ])
  .reactions([])
  .view({})
