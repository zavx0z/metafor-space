import { MetaFor } from "@metafor/space"

const { context, update } = MetaFor("roadmap")
  .context((t) => ({
    status: t.enum("start", "process", "end").required({ title: "Статус", default: "start" }),
    error: t.string.optional({ title: "Ошибка" }),
  }))
  .states({
    начало: { to: {} },
    конец: { to: {} },
  })
  .view({
    render: ({ html, context }) => html`
    <h1>${context.status}</h1>
    `,
  })
console.log(context)

setTimeout(() => {
  update({ status: "process" })
  console.log(context)
}, 1000)

// context.status = "other"

console.log(context)
