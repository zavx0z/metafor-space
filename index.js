import { MetaFor } from "@metafor/space"

const Meta = MetaFor("roadmap")
  .context((t) => ({
    status: t.enum("start", "process", "end").required({ title: "Статус", default: "start" }),
    error: t.string.optional({ title: "Ошибка" }),
  }))
  .states({
    начало: { to: {} },
    конец: { to: {} },
  })
  .view({
    render: ({ html, context }) => html` <h1>${context.status}</h1> `,
  })

const meta = /**@type {Meta<typeof Meta>} */ (document.querySelector("metafor-roadmap"))

meta.onUpdate((patches) => {
  console.log(patches)
})

meta.update({ status: "process" })
