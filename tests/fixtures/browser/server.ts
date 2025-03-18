import { getMimeType } from "./static"
import { join } from "node:path"

// Путь к корневой директории проекта
const PROJECT_DIR = join(import.meta.dir, "../../../")

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url)
    if (url.pathname === "/")
      return new Response(
        `<!DOCTYPE html>
          <html lang="ru" class="theme-dark">
          <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>MetaFor Browser Test</title>
            <style>
              html, body {
                height: 100vh;
                width: 100vh;
                margin: 0;
                padding: 0;
                background-color: var(--background-color, #121212);
              }
            </style>
            <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
            <link rel="stylesheet" href="/viewport/style.css"/>
            <script type="importmap">
              {
                "imports": {
                  "elkjs": "/layout/lib/elk-api.js"
                }
              }
            </script>
            <script type="module">
              const channel = new BroadcastChannel("validator")
              channel.onmessage = ({data}) => console.warn(data)

              import {MetaFor} from "/index.js"

              window.MetaFor = MetaFor
              window.dataStore = new Map()
            </script>
          </head>
          <body>
          <metafor-graph/>
          </body>
          </html>
        `,
        {headers: {"Content-Type": "text/html"}}
      )
    else if (url.pathname === "/favicon.ico")
      return new Response(
        Buffer.from("AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAA=", "base64"),
        {headers: {"Content-Type": "image/x-icon"}}
      )
    else {
      const path = join(PROJECT_DIR, url.pathname)
      return new Response(Bun.file(path), {headers: {"Content-Type": getMimeType(url.pathname)}})
    }
  },
  error(error) {
    console.log(error)
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {headers: {"Content-Type": "text/html"}})
  }
})
console.log(`Server started on http://${server.hostname}:${server.port}`)
