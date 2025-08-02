import { log } from "./web/console.js"
const channel = new BroadcastChannel("channel")
channel.onmessage = (/** @type {MessageEvent} */ event) => {
  log(event.data)
}
import "./websocket/websocket.js"
