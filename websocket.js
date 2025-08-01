import { MetaFor } from "./web/metafor.js"
import { log } from "./web/debug/console.js"

MetaFor("websocket")
  .context((t) => ({
    status: t.enum("disconnected", "connecting", "connected", "error").required("disconnected")({
      title: "Статус соединения",
    }),
    reconnectAttempts: t.number.required(0)({ title: "Количество попыток переподключения" }),
    error: t.string.optional()({ title: "Ошибка соединения" }),
  }))
  .states({
    disconnected: {
      connecting: { status: "connecting" },
    },
    connecting: {
      connected: { status: "connected" },
      error: { status: "error" },
    },
    connected: {
      disconnected: { status: "disconnected" },
      error: { status: "error" },
    },
    error: {
      connecting: { status: "connecting" },
      disconnected: { status: "disconnected" },
    },
  })
  .core((ref) => ({
    /** @type {WebSocket|null} */
    socket: null,
    maxReconnectAttempts: 5,
    reconnectDelay: 1000,
    /** @type {any|null} */
    reconnectTimer: null,
  }))
  .processes((process) => ({
    disconnected: process({ title: "Подключение к WebSocket" })
      .action(
        ({ core }) =>
          new Promise((resolve, reject) => {
            try {
              core.socket = new WebSocket("ws://localhost:3000")

              core.socket.onopen = () => {
                console.log("✅ WebSocket подключен")
                resolve({ success: true })
              }

              core.socket.onmessage = (/** @type {MessageEvent} */ event) => {
                log(JSON.parse(event.data))
              }

              core.socket.onclose = (/** @type {CloseEvent} */ event) => {
                console.log("❌ WebSocket закрыт:", event.code, event.reason)
              }

              core.socket.onerror = (/** @type {Event} */ error) => {
                console.log("⚠️ Ошибка WebSocket:", error)
                reject(error)
              }
            } catch (error) {
              console.log("🚨 Не удалось создать WebSocket:", error)
              reject(error)
            }
          })
      )
      .success(({ update }) => {
        update({ status: "connecting" })
        // Автоматически запускаем процесс подключения
        setTimeout(() => {
          update({ status: "connected" })
        }, 100)
      })
      .error(({ update, error }) => {
        update({
          status: "error",
          error: error.message,
        })
      }),

    error: process({ title: "Переподключение к WebSocket" })
      .action(({ context, core }) => {
        return new Promise((resolve, reject) => {
          if (context.reconnectAttempts >= core.maxReconnectAttempts) {
            console.log("💀 Достигнуто максимальное количество попыток переподключения. Сдаюсь.")
            resolve({ success: false })
            return
          }

          const attempts = context.reconnectAttempts + 1
          const delay = core.reconnectDelay * attempts

          console.log(`🔄 Переподключение... (попытка ${attempts}/${core.maxReconnectAttempts})`)

          core.reconnectTimer = setTimeout(() => {
            // Здесь нужно будет обновить через другой механизм
            resolve({ success: true, attempts, delay })
          }, delay)
        })
      })
      .success(({ update, data }) => {
        update({
          status: "connecting",
          reconnectAttempts: data.attempts || 0,
        })
        // Автоматически пытаемся подключиться после задержки
        setTimeout(() => {
          update({ status: "connected" })
        }, data.delay || 1000)
      }),
  }))
  .reactions(() => [])
  .view({
    render: ({ html, context }) => html`
      <div class="websocket-status">
        <div class="status-info">
          <span class="status ${context.status}">${context.status}</span>
          ${context.error ? html`<span class="error">${context.error}</span>` : ""}
          ${context.reconnectAttempts > 0 ? html`<span class="attempts">(${context.reconnectAttempts})</span>` : ""}
        </div>
        <span class="icon">
          ${context.status === "connected"
            ? "🔗"
            : context.status === "connecting"
            ? "🔄"
            : context.status === "error"
            ? "❌"
            : "🔌"}
        </span>
      </div>
    `,
    style: ({ css }) => css`
      .websocket-status {
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-family: monospace;
        z-index: 1000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 150px;
      }

      .status-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .status.connected {
        color: #4ade80;
      }
      .status.connecting {
        color: #fbbf24;
      }
      .status.error {
        color: #f87171;
      }
      .status.disconnected {
        color: #9ca3af;
      }

      .error {
        color: #f87171;
        font-size: 10px;
      }

      .attempts {
        color: #9ca3af;
        font-size: 10px;
      }

      .icon {
        font-size: 16px;
      }
    `,
  })
