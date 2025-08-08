import { log } from "./web/console.js"
new BroadcastChannel("channel").onmessage = (/** @type {MessageEvent} */ event) => {
  const { data } = event
  if (Object.hasOwn(data, "meta")) {
    log(data)
  } else {
    console.log(data)
  }
}

import websocket from "./meta/web/websocket.js"
document.body.innerHTML = `<meta-${websocket}></meta-${websocket}>`

import "./graph/graph-nodes.js"
