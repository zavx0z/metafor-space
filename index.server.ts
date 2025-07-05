import {getMimeType} from "./fixtures/browser/static.ts"
import {join} from "node:path"
import index from "./index.html"

// Путь к корневой директории проекта
const PROJECT_DIR = join(import.meta.dir, "/")

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
    "/*": async req => {
      const url = new URL(req.url)
      const path = join(PROJECT_DIR, url.pathname)
      const type = getMimeType(url.pathname)
      let file
      try {
        file = Bun.file(path)
        return new Response(await file.bytes(), {headers: {"Content-Type": type}})
      } catch (e) {
        console.log(e)
        return new Response("fallback response");
      }
    }
  },
  fetch(request) {
    return new Response("fallback response");
  },
})
console.log(`Server started on http://${server.hostname}:${server.port}`)
