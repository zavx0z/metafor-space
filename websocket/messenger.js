import { log } from "../web/console.js"
import { MetaFor } from "../web/metafor.js"

export default MetaFor("messenger", { dev: false })
  .context((t) => ({}))
  .states({})
  .core({
    socket: /**@type {WebSocket} */ (/**@type{unknown} */ (null)),
    handler: (/** @type {MessageEvent} */ event) => {
      const data = JSON.parse(event.data)
      if (Object.hasOwn(data, "meta")) {
        log(data)
      } else {
        console.log(data)
      }
    },
  })
  .processes((process) => ({}))
  .reactions()
  .view({
    onMount: ({ core }) => core.socket.addEventListener("message", core.handler),
    onDestroy: ({ core }) => core.socket.removeEventListener("message", core.handler),
  })
