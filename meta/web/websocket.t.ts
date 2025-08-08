export interface WebSocketCore {
  /** WebSocket соединение */
  socket: WebSocket | null
  /** URL для подключения */
  url: string
}
