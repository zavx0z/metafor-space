import { log } from "./web/console.js"
new BroadcastChannel("channel").onmessage = (/** @type {MessageEvent<import("./web/metafor.js").Message>} */ event) => {
  const { data } = event
  if (Object.hasOwn(data, "meta")) {
    for (const patch of data.patches)
      log({ meta: data.meta, patch, timestamp: data.timestamp, actor: data.actor })
  } else {
    console.log(data)
  }
}

import websocket from "./meta/web/websocket.js"
document.body.innerHTML = `<meta-${websocket}></meta-${websocket}>`

import "./graph/graph-nodes.js"
