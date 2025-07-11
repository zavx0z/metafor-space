import {MetaFor} from "@zavx0z/metafor"

const {context, update, onUpdate, schema} = MetaFor("roadmap")
  .context((types) => ({
    status: types.enum("start", "process", "end")("end")({title: "Статус"}),
    error: types.string()({title: "Ошибка"})
  }))
console.log(context.status)
console.log(context.error)
console.log(schema)
onUpdate(patches => {
  console.log(patches)
})
update({status: "end", error: "Ошибочка"})
console.log(context.status)
console.log(context.error)
console.log(context._title.status)
console.log(context._title.error)

// import {MetaFor} from "./metafor.js"
//
// await import ("./graph/graph-nodes.js")
//
// export default MetaFor("roadmap", {description: "MetaFor RoadMap", development: false})
//   .context((t) => ({
//     status: t.enum("start", "process", "end")({title: "Статус", default: "end"}),
//     error: t.string({title: "Ошибка", nullable: true})
//   }))
//   .core()
//   .reactions({})%
//   .states("конец", "в процессе", "начало")
//   .transitions("начало", {
//     "начало": {
//       action: () => new Promise((resolve) => {
//         setTimeout(() => {
//           resolve({status: "end"})
//         }, 6000)
//       }),
//       reaction: [],
//       to: {
//         "конец": {status: "end"},
//         "в процессе": {status: "process"}
//       }
//     },
//     "конец": {
//       to: {
//         "начало": {status: "start"}
//       }
//     },
//     // "в процессе": {
//     //   to: {
//     //     "конец": {status: "end"}
//     //   }
//     // }
//   })
//   .view({
//     // render: ({html, context}) => html`<h1>${context.status === "end" ? "я еще тут!" : "Я тут!"}</h1>`
//   })
