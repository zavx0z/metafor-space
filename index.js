import { log } from "./web/console.js"
new BroadcastChannel("channel").onmessage = (/** @type {MessageEvent} */ event) => log(event.data)

import "./websocket/websocket.js"
import "./graph/graph-nodes.js"
