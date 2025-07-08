import { getMimeType } from "./fixture/browser/static.ts"
import { join } from "node:path"

const PROJECT_DIR = join(import.meta.dir, "/")

const server = Bun.serve({
  development: true,
  hostname: "0.0.0.0",
  routes: {
    "/": new Response(await Bun.file(join(PROJECT_DIR, "index.html")).bytes(), {
      headers: {
        "Content-Type": "text/html",
      },
    }),
    "/favicon.ico": new Response(await Bun.file(join(PROJECT_DIR, "fixture/browser/favicon.ico")).bytes(), {
      headers: {
        "Content-Type": "image/x-icon",
      },
    }),
    "/*": async (req) => {
      const url = new URL(req.url)
      const path = join(PROJECT_DIR, url.pathname)
      const type = getMimeType(url.pathname)
      const acceptEncoding = req.headers.get("accept-encoding") || ""
      let filePath = path
      let headers: Record<string, string> = { "Content-Type": type }

      // Если клиент поддерживает gzip и есть .gz-файл — отдаём его
      if (acceptEncoding.includes("gzip") && (await Bun.file(path + ".gz").exists())) {
        filePath = path + ".gz"
        headers["Content-Encoding"] = "gzip"
      }

      try {
        const file = Bun.file(filePath)
        return new Response(await file.bytes(), { headers })
      } catch (e) {
        console.log(e)
        return new Response("fallback response")
      }
    },
  },
  fetch(request) {
    return new Response("fallback response")
  },
})

console.log(`Server started on http://${server.hostname}:${server.port}`)
