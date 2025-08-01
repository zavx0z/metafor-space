import { log } from "../web/debug/console.js"

/**
 * Создание WebSocket соединения
 * @param {string} url - URL для подключения
 * @returns {Promise<{socket: WebSocket}>}
 */
export function createWebSocket(url) {
  return new Promise((resolve, reject) => {
    try {
      const socket = new WebSocket(url)

      socket.onopen = () => {
        console.log("✅ WebSocket подключен")
        resolve({ socket })
      }

      socket.onmessage = (/** @type {MessageEvent} */ event) => {
        log(JSON.parse(event.data))
      }

      socket.onclose = (/** @type {CloseEvent} */ event) => {
        console.log("❌ WebSocket закрыт:", event.code, event.reason)
      }

      socket.onerror = (/** @type {Event} */ error) => {
        console.log("⚠️ Ошибка WebSocket:", error)
        reject(error)
      }
    } catch (error) {
      console.log("🚨 Не удалось создать WebSocket:", error)
      reject(error)
    }
  })
}

/**
 * Ожидание готовности WebSocket соединения
 * @param {WebSocket|null} socket - WebSocket соединение
 * @returns {Promise<"connected">}
 */
export function waitForConnection(socket) {
  return new Promise((resolve, reject) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      resolve("connected")
    } else if (socket) {
      // Ждем события onopen для подтверждения подключения
      const originalOnOpen = socket.onopen
      socket.onopen = (event) => {
        // Восстанавливаем оригинальный обработчик
        if (originalOnOpen) originalOnOpen.call(socket, event)
        resolve("connected")
      }
    } else {
      // Если WebSocket не создан, считаем это ошибкой
      reject(new Error("WebSocket не создан"))
    }
  })
}

/**
 * Переподключение к WebSocket с экспоненциальной задержкой
 * @param {number} reconnectAttempts - текущее количество попыток
 * @param {number} maxReconnectAttempts - максимальное количество попыток
 * @param {number} reconnectDelay - базовая задержка
 * @returns {Promise<{status: "connecting", attempts: number}>}
 */
export function reconnectWebSocket(reconnectAttempts, maxReconnectAttempts, reconnectDelay) {
  return new Promise((resolve, reject) => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.log("💀 Достигнуто максимальное количество попыток переподключения. Сдаюсь.")
      reject(new Error("Достигнуто максимальное количество попыток переподключения"))
      return
    }

    const attempts = reconnectAttempts + 1
    const delay = reconnectDelay * attempts

    console.log(`🔄 Переподключение... (попытка ${attempts}/${maxReconnectAttempts})`)

    setTimeout(() => {
      resolve({ status: "connecting", attempts })
    }, delay)
  })
}
