export interface WebSocketCore {
  /** WebSocket соединение */
  socket: WebSocket | null
  /** URL для подключения */
  url: string
  /** Максимальное количество попыток переподключения */
  maxReconnectAttempts: number
  /** Задержка между попытками переподключения (мс) */
  reconnectDelay: number
  /** Таймер переподключения */
  reconnectTimer: any | null
}
