import { log } from "./web/console.js"
new BroadcastChannel("channel").onmessage = (/** @type {MessageEvent} */ event) => log(event.data)

import websocket from "./websocket/websocket.js"
document.body.innerHTML = `<meta-${websocket}></meta-${websocket}>`

import "./graph/graph-nodes.js"
