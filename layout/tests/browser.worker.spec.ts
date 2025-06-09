import {afterAll, describe, expect, test} from "bun:test"
import puppeteer from "puppeteer"
import {join} from "node:path"
import {getMimeType} from "../../fixtures/browser/static.js"

const html = String.raw
const rootDir = join(import.meta.dir, "../")

const server = Bun.serve({
  port: 4422,
  static: {
    "/favicon.ico": new Response(Buffer.from("AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAA=", "base64"), {headers: {"Content-Type": "image/x-icon"}}),
    "/": new Response(
      html`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <title>ELK Worker</title>
          <script type="module">
            import ELK from "../lib/elk-api.js"
            window.ELK = ELK
            // debugger
          </script>
        </head>
        <body>
        <div id="root"></div>
        </body>
        </html>
      `,
      {headers: {"Content-Type": "text/html"}}
    )
  },
  async fetch(req) {
    const url = new URL(req.url)
    const path = join(rootDir, url.pathname)
    return new Response(Bun.file(path), {headers: {"Content-Type": getMimeType(url.pathname)}})
  },
  error(error) {
    console.log(error)
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {headers: {"Content-Type": "text/html"}})
  }
})
const browser = await puppeteer.launch({headless: false, devtools: true, args: ["--no-sandbox", "--disable-setuid-sandbox"]})
const page = await browser.newPage()
await page.goto("http://localhost:4422")

describe("ELK Browser", () => {
  afterAll(async () => {
    await browser.close()
    await server.stop()
  })

  test("should layout graph in browser", async () => {
    const result = await page.evaluate(async () => {
      // @ts-ignore
      const elk = new ELK({workerUrl: "/lib/elk-worker.js"})

      const graph = {
        id: "root",
        layoutOptions: {"elk.algorithm": "layered"},
        children: [
          {id: "n1", width: 30, height: 30},
          {id: "n2", width: 30, height: 30},
          {id: "n3", width: 30, height: 30}
        ],
        edges: [
          {id: "e1", sources: ["n1"], targets: ["n2"]},
          {id: "e2", sources: ["n1"], targets: ["n3"]}
        ]
      }

      return await elk.layout(graph)
    })

    expect(result).toBeDefined()
    expect(result.children).toHaveLength(3)

    // Проверяем, что координаты были рассчитаны
    for (const child of result.children) {
      expect(typeof child.x).toBe("number")
      expect(typeof child.y).toBe("number")
    }
  })
})
