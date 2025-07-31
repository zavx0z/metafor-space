import { MetaFor } from "./web/metafor.js"
import { log } from "./web/debug/console.js"

/** @type {WebSocket|null} */
let socket = null
let reconnectAttempts = 0
const maxReconnectAttempts = 5
const reconnectDelay = 1000 // 1 секунда

function connectWebSocket() {
  try {
    socket = new WebSocket("ws://localhost:3000")

    socket.onopen = () => {
      console.log("✅ WebSocket connected")
      reconnectAttempts = 0 // Сбрасываем счетчик попыток при успешном подключении
      if (socket) {
        socket.send("hello")
      }
    }

    socket.onmessage = (/** @type {MessageEvent} */ event) => {
      log(JSON.parse(event.data))
    }

    socket.onclose = (event) => {
      console.log("❌ WebSocket closed:", event.code, event.reason)

      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++
        console.log(`🔄 Reconnecting... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`)

        setTimeout(() => {
          connectWebSocket()
        }, reconnectDelay * reconnectAttempts) // Увеличиваем задержку с каждой попыткой
      } else {
        console.log("💀 Max reconnection attempts reached. Giving up.")
      }
    }

    socket.onerror = (error) => {
      console.log("⚠️ WebSocket error:", error)
    }
  } catch (error) {
    console.log("🚨 Failed to create WebSocket:", error)

    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++
      console.log(`🔄 Retrying connection... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`)

      setTimeout(() => {
        connectWebSocket()
      }, reconnectDelay * reconnectAttempts)
    }
  }
}

// Начинаем подключение
connectWebSocket()

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
