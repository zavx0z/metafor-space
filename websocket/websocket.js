import { MetaFor } from "../web/metafor.js"
import { log } from "../web/debug/console.js"

MetaFor("websocket")
  .context((t) => ({
    timeStampConnecting: t.number.optional()({ title: "Время начала подключения" }),
    timeStampConnected: t.number.optional()({ title: "Время подключения" }),
    timeStampDisconnected: t.number.optional()({ title: "Время отключения" }),
    reconnectAttempts: t.number.required(0)({ title: "Количество попыток переподключения" }),
    reconnectDelay: t.number.required(1000)({ title: "Базовая задержка переподключения" }),
    error: t.string.optional()({ title: "Ошибка соединения" }),
  }))
  .states({
    отключен: {
      подключение: { timeStampConnecting: { null: false }, error: { null: true } },
    },
    подключение: {
      подключен: { timeStampConnected: { null: false } },
      ошибка: { error: { null: false } },
    },
    подключен: {
      отключен: { timeStampDisconnected: { null: false } },
      ошибка: { error: { null: false } },
    },
    ошибка: {
      подключение: { timeStampConnecting: { null: false } },
      отключен: { error: { null: true } },
    },
  })
  .core(
    /**@type import("./websocket.t").WebSocketCore*/ ({
      socket: null,
      url: "ws://localhost:3000",
      maxReconnectAttempts: 5,
      reconnectTimer: null,
    })
  )
  .processes((process) => ({
    отключен: process({ title: "Подключение к WebSocket" })
      .action(async ({ core }) => {
        try {
          core.socket = new WebSocket(core.url)
          return { timeStampConnecting: new Date().getTime() }
        } catch (error) {
          console.log("🚨 Не удалось создать WebSocket:", error)
          throw error
        }
      })
      .success(({ update, data }) => update(data))
      .error(({ update, error }) => update({ error: error.message })),

    подключение: process({ title: "Ожидание подключения WebSocket" })
      .action(
        ({ context, core }) =>
          new Promise((resolve, reject) => {
            if (core.socket && core.socket.readyState === WebSocket.OPEN) {
              resolve({ timeStampConnected: new Date().getTime() })
            } else if (core.socket) {
              // Вычисляем таймаут на основе количества попыток
              const attempts = context.reconnectAttempts || 0
              const timeout = context.reconnectDelay * (attempts + 1)

              const timeoutId = setTimeout(() => {
                reject(new Error(`Таймаут подключения WebSocket (${timeout}ms)`))
              }, timeout)

              // Ждем события onopen для подтверждения подключения
              const originalOnOpen = core.socket.onopen
              core.socket.onopen = (event) => {
                clearTimeout(timeoutId)
                // Восстанавливаем оригинальный обработчик
                if (originalOnOpen && core.socket) originalOnOpen.call(core.socket, event)
                resolve({ timeStampConnected: new Date().getTime() })
              }
            } else {
              // Если WebSocket не создан, считаем это ошибкой
              reject(new Error("WebSocket не создан"))
            }
          })
      )
      .success(({ update, data }) => update(data))
      .error(({ update, error }) => update({ error: error.message })),

    подключен: process({ title: "Мониторинг WebSocket соединения" })
      .action(
        ({ core }) =>
          new Promise((_, reject) => {
            if (!core.socket) return reject(new Error("Нет WebSocket соединения в состоянии connected"))

            // Настраиваем обработчики событий WebSocket
            core.socket.onopen = () => {
              console.log("✅ WebSocket подключен")
            }

            core.socket.onmessage = (/** @type {MessageEvent} */ event) => {
              log(JSON.parse(event.data))
            }

            core.socket.onclose = (/** @type {CloseEvent} */ event) => {
              console.log("🔌 WebSocket соединение закрыто:", event.code, event.reason)
              reject(new Error("WebSocket соединение закрыто"))
            }

            core.socket.onerror = (/** @type {Event} */ error) => {
              console.log("❌ Ошибка WebSocket соединения:", error)
              reject(error)
            }
          })
      )
      .error(({ update, error }) => update({ error: error.message })),

    ошибка: process({ title: "Переподключение к WebSocket" })
      .action(
        ({ context, core }) =>
          new Promise((resolve, reject) => {
            if (context.reconnectAttempts >= core.maxReconnectAttempts) {
              console.log("💀 Достигнуто максимальное количество попыток переподключения. Сдаюсь.")
              reject(new Error("Достигнуто максимальное количество попыток переподключения"))
              return
            }

            const attempts = context.reconnectAttempts + 1
            const delay = context.reconnectDelay * attempts

            console.log(`🔄 Переподключение... (попытка ${attempts}/${core.maxReconnectAttempts})`)

            setTimeout(() => {
              resolve({ timeStampConnecting: new Date().getTime(), attempts })
            }, delay)
          })
      )
      .success(({ update, data }) =>
        update({
          timeStampConnecting: data.timeStampConnecting,
          timeStampConnected: null,
          timeStampDisconnected: null,
          reconnectAttempts: data.attempts || 0,
        })
      )
      .error(({ update, error }) => update({ timeStampConnecting: null, error: error.message })),
  }))
  .reactions(() => [])
  .view({
    render: ({ html, context, state, core, nothing }) => html`
      <div class="websocket-status">
        <div class="status-info">
          <span class="status ${state}">${state}</span>
          ${context.error ? html`<span class="error">${context.error}</span>` : ""}
          ${context.reconnectAttempts > 0
            ? html`<span class="attempts">(${context.reconnectAttempts})</span>`
            : nothing}
        </div>
        <span class="icon">
          ${state === "подключен" ? "🔗" : state === "подключение" ? "🔄" : state === "ошибка" ? "❌" : "🔌"}
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

      .status.подключен {
        color: rgba(var(--success-400) / 0.95);
        text-shadow: 0 1px 2px rgba(var(--success-900) / 0.3);
      }

      .status.подключение {
        color: rgba(var(--warning-400) / 0.95);
        text-shadow: 0 1px 2px rgba(var(--warning-900) / 0.3);
      }

      .status.ошибка {
        color: rgba(var(--error-400) / 0.95);
        text-shadow: 0 1px 2px rgba(var(--error-900) / 0.3);
      }

      .status.отключен {
        color: rgba(var(--surface-400) / 0.7);
      }

      .error {
        color: rgba(var(--error-400) / 0.8);
        font-size: 12px;
        font-weight: 500;
      }

      .attempts {
        color: rgba(var(--surface-400) / 0.6);
        font-size: 12px;
        font-weight: 500;
      }

      .icon {
        font-size: 18px;
        margin-left: 12px;
        opacity: 0.9;
        transition: all 0.3s ease;
      }

      .websocket-status:hover .icon {
        opacity: 1;
        transform: scale(1.1);
      }
    `,
  })
