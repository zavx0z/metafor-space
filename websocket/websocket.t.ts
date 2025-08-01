export interface WebSocketCore {
  /** WebSocket соединение */
  socket: WebSocket | null
  /** URL для подключения */
  url: string
  /** Максимальное количество попыток переподключения */
  maxReconnectAttempts: number

  /** Таймер переподключения */
  reconnectTimer: any | null
}
