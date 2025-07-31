import { MetaFor } from "./metafor.js"

const socket = new WebSocket("ws://localhost:3000")

socket.onopen = () => {
  console.log("connected")
  socket.send("hello")
}

socket.onmessage = (/** @type {MessageEvent} */ event) => {
  console.log("message", event.data)
}

export default MetaFor("roadmap")
  .context((t) => ({
    status: t.enum("copy", "process", "end").required("end")({ title: "Статус" }),
    error: t.string.optional()({ title: "Ошибка" }),
  }))
  .states({
    начало: {
      конец: { status: "end" },
      "в процессе": { status: "process" },
    },
    конец: {
      начало: { status: "start" },
    },
    "в процессе": {
      конец: { status: "end" },
    },
  })
  .core()
  .processes((process) => ({
    начало: process({ title: "Начальный процесс" })
      .action(({ context }) => ({ status: /**@type{typeof context['status']}*/ ("end") }))
      .success(({ update, data }) => {
        update({ status: data.status })
      }),
  }))
  .reactions((reaction) => [
    [
      ["начало", "конец", "в процессе"],
      reaction()
        .filter({
          path: "/state",
        })
        .equal(({ update, patch }) => {
          console.log("Состояние изменилось:", patch.value)
        }),
    ],
  ])
  .view({
    render: ({ html, context }) => html`<h1>${context.status === "end" ? "я еще тут!" : "Я тут!"}</h1>`,
  })
