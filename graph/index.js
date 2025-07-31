import { MetaFor } from "../metafor.js"

export default MetaFor("test", { description: "Nodes" })
  .context((t) => ({
    status: t.enum("start", "end").required("end")({ title: "Статус" }),
  }))
  .states({
    начало: {
      конец: { status: "end" },
    },
    конец: {
      начало: { status: "start" },
    },
  })
  .core()
  .processes((process) => ({
    начало: process().action(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ status: "end" })
          }, 6000)
        })
    ),
  }))
  .reactions()
  .view({})
