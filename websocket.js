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
      })
      .error(({ update, error }) => update({ status: "error", error: error.message })),

    connecting: process({ title: "Ожидание подключения WebSocket" })
      .action(({ core }) => {
        return new Promise((resolve) => {
          // Проверяем, что WebSocket действительно подключен
          if (core.socket && core.socket.readyState === WebSocket.OPEN) {
            resolve({ success: true })
          } else {
            // Если WebSocket еще не готов, ждем немного
            setTimeout(() => {
              resolve({ success: true })
            }, 100)
          }
        })
      })
      .success(({ update }) => {
        update({ status: "connected" })
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
      }),
  }))
  .reactions(() => [])
  .view({
    render: ({ html, context }) => html`
      <div class="websocket-status ${context.status}">
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
        top: 20px;
        right: 20px;
        background: rgba(var(--surface-800) / 0.8);
        backdrop-filter: blur(22px);
        border: 1px solid rgba(var(--surface-400) / 0.4);
        border-radius: 12px;
        padding: 16px 20px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        z-index: 1000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 180px;
        box-shadow: 0 8px 32px rgba(var(--surface-900) / 0.6), 0 2px 8px rgba(var(--surface-900) / 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .websocket-status:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 48px rgba(var(--surface-900) / 0.5), 0 4px 16px rgba(var(--surface-900) / 0.3);
        border-color: rgba(var(--primary-400) / 0.5);
      }

      .status-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
      }

      .status {
        font-weight: 600;
        letter-spacing: -0.02em;
        text-transform: capitalize;
        transition: all 0.3s ease;
      }

      .status.connected {
        color: rgba(var(--success-400) / 0.95);
        text-shadow: 0 1px 2px rgba(var(--success-900) / 0.3);
      }

      .status.connecting {
        color: rgba(var(--warning-400) / 0.95);
        text-shadow: 0 1px 2px rgba(var(--warning-900) / 0.3);
      }

      .status.error {
        color: rgba(var(--error-400) / 0.95);
        text-shadow: 0 1px 2px rgba(var(--error-900) / 0.3);
      }

      .status.disconnected {
        color: rgba(var(--surface-300) / 0.8);
        text-shadow: 0 1px 2px rgba(var(--surface-900) / 0.3);
      }

      .error {
        color: rgba(var(--error-300) / 0.8);
        font-size: 12px;
        font-weight: 400;
        letter-spacing: 0.02em;
        line-height: 1.3;
      }

      .attempts {
        color: rgba(var(--surface-400) / 0.7);
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.02em;
      }

      .icon {
        font-size: 20px;
        margin-left: 12px;
        filter: drop-shadow(0 2px 4px rgba(var(--surface-900) / 0.3));
        transition: all 0.3s ease;
      }

      .websocket-status.connected .icon {
        filter: drop-shadow(0 2px 8px rgba(var(--success-500) / 0.4));
      }

      .websocket-status.connecting .icon {
        filter: drop-shadow(0 2px 8px rgba(var(--warning-500) / 0.4));
        animation: pulse 2s infinite;
      }

      .websocket-status.error .icon {
        filter: drop-shadow(0 2px 8px rgba(var(--error-500) / 0.4));
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.7;
          transform: scale(1.1);
        }
      }
    `,
  })
