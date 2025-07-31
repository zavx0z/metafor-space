import { getMimeType } from "./fixtures/browser/static.ts"
import { join } from "node:path"
import type { Message } from "./server/metafor.d.ts"

const channel = new BroadcastChannel("channel")
channel.addEventListener("message", (event: MessageEvent<Message>) => {
  const { meta, patch } = event.data
  const timestamp = new Date().toLocaleTimeString("ru-RU", { hour12: false })
  const tag = (meta.tag as string) || "unknown"

  // ANSI цветовые коды
  const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
  }

  switch (patch.path) {
    case "/state":
      console.log(
        `${colors.gray}[${timestamp}]${colors.reset} ${colors.cyan}${tag.padEnd(20)}${colors.reset} | ${
          colors.yellow
        }STATE${colors.reset}  | ${colors.magenta}${patch.op.padEnd(8)}${colors.reset} | ${colors.green}${patch.value}${
          colors.reset
        }`
      )
      break
    case "/context":
      const contextStr = JSON.stringify(patch.value).substring(0, 50)
      console.log(
        `${colors.gray}[${timestamp}]${colors.reset} ${colors.cyan}${tag.padEnd(20)}${colors.reset} | ${
          colors.blue
        }CONTEXT${colors.reset}| ${colors.magenta}${patch.op.padEnd(8)}${colors.reset} | ${colors.white}${contextStr}${
          colors.reset
        }`
      )
      break
    case "/":
      console.log(
        `${colors.gray}[${timestamp}]${colors.reset} ${colors.cyan}${tag.padEnd(20)}${colors.reset} | ${
          colors.green
        }ADD${colors.reset}    | ${colors.magenta}${patch.op.padEnd(8)}${colors.reset} | ${colors.cyan}${tag}${
          colors.reset
        }`
      )
      break
    default:
      const path = patch.path as string
      console.log(
        `${colors.gray}[${timestamp}]${colors.reset} ${colors.cyan}${tag.padEnd(20)}${colors.reset} | ${
          colors.red
        }${path.padEnd(7)}${colors.reset} | ${colors.magenta}${patch.op.padEnd(8)}${colors.reset} | ${
          colors.white
        }${JSON.stringify(patch.value).substring(0, 30)}${colors.reset}`
      )
      break
  }
})

import("./server.space.ts")

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
      channel.addEventListener("message", (event: MessageEvent<Message>) => ws.send(JSON.stringify(event.data)))
      console.log("websocket opened")
    },
    message(ws, message) {
      console.log("websocket message", message)
      ws.send("hello")
    },
    close(ws) {
      console.log("websocket closed")
    },
    drain(ws) {
      console.log("websocket drained")
    },
  },
})

console.log(`Server started on http://${server.hostname}:${server.port}`)
