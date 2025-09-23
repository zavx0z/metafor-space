import "./server/metafor.js"
import { getMimeType } from "./fixtures/browser/static"
import { join } from "node:path"
import { log } from "./server/console"
import type { Message } from "./server/metafor.d"

const channel = new BroadcastChannel("channel")
channel.addEventListener("message", log)

const PROJECT_DIR = import.meta.dir

const server = Bun.serve({
  hostname: "0.0.0.0",
  routes: {
    "/": new Response(await Bun.file(join(PROJECT_DIR, "index.html")).bytes(), {
      headers: {
        "Content-Type": "text/html",
      },
    }),
    "/favicon.ico": new Response(await Bun.file(join(PROJECT_DIR, "fixtures/browser/favicon.ico")).bytes(), {
      headers: {
        "Content-Type": "image/x-icon",
      },
    }),
    "/.well-known/appspecific/com.chrome.devtools.json": new Response(""),
    "/*": async (req) => {
      if (server.upgrade(req)) {
        return
      }
      const url = new URL(req.url)
      const path = join(PROJECT_DIR, url.pathname)
      const type = getMimeType(url.pathname)
      let file
      try {
        file = Bun.file(path)
        return new Response(await file.bytes(), { headers: { "Content-Type": type } })
      } catch (e) {
        console.log(e)
        return new Response("fallback response")
      }
    },
  },
  fetch(request) {
    return new Response("fallback response")
  },
  websocket: {
    open(ws) {
      console.log("🔗 WebSocket соединение открыто")
      channel.addEventListener("message", (event: MessageEvent<Message>) => ws.send(JSON.stringify(event.data)))
      // ws.send(JSON.stringify(store.getAllActors().map((actor) => ({ ...actor, snapshot: JSON.parse(actor.snapshot) }))))
    },
    message(ws, message) {
      console.log("📨 WebSocket сообщение:", message)
    },
    close(ws) {
      console.log("🔌 WebSocket соединение закрыто")
    },
    drain(ws) {
      console.log("💧 WebSocket буфер очищен")
    },
  },
})

// События жизненного цикла сервера
console.log(`🚀 Сервер запускается на http://${server.hostname}:${server.port}`)

// Обработка сигналов завершения
process.on("SIGINT", () => {
  console.log("\n🛑 Получен сигнал SIGINT, корректное завершение...")
  server.stop()
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("\n🛑 Получен сигнал SIGTERM, корректное завершение...")
  server.stop()
  process.exit(0)
})

// Обработка необработанных ошибок
process.on("uncaughtException", (error) => {
  console.error("❌ Необработанное исключение:", error)
  server.stop()
  process.exit(1)
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Необработанное отклонение промиса:", promise, "причина:", reason)
  server.stop()
  process.exit(1)
})

console.log(`✅ Сервер слушает на http://${server.hostname}:${server.port}`)
console.log("📡 WebSocket сервер готов к подключениям")

import("./meta/server/server.space.ts")
