import { MetaFor } from "../../web/metafor.js"
import { log } from "../../web/console.js"
import messenger from "./messenger.js"

export default MetaFor("websocket", { dev: true, persist: false })
  .context((t) => ({
    timeStampConnecting: t.number.optional()({ title: "Время начала подключения" }),
    timeStampConnected: t.number.optional()({ title: "Время подключения" }),
    timeStampDisconnected: t.number.optional()({ title: "Время отключения" }),
    maxAttempts: t.number.required(5)({ title: "Максимальное количество попыток переподключения" }),
    remainingAttempts: t.number.required(0)({ title: "Оставшиеся попытки переподключения" }),
    reconnectDelay: t.number.required(1000)({ title: "Базовая задержка переподключения" }),
    reconnectDelayMultiplier: t.number.required(1.5)({ title: "Множитель задержки переподключения" }),
    error: t.string.optional()({ title: "Ошибка соединения" }),
  }))
  .states({
    отключен: {
      подключение: { remainingAttempts: { gt: 0 } },
    },
    подключение: {
      подключен: { remainingAttempts: { gt: 0 } },
      ошибка: { error: { null: false } },
    },
    подключен: {
      ошибка: { error: { null: false } },
    },
    ошибка: {
      ожидание: { remainingAttempts: { gt: 0 } },
      отключен: { remainingAttempts: { eq: 0 } },
    },
    ожидание: {
      подключение: { timeStampConnecting: { null: false } },
    },
  })
  .core(
    /**@type import("./websocket.t").WebSocketCore*/ ({
      socket: null,
      url: "ws://localhost:3000",
    })
  )
  .processes((process) => ({
    отключен: process({ title: "Подключение к WebSocket" })
      .action(({ core, context }) => {
        core.socket = null
        return { remainingAttempts: context.remainingAttempts || context.maxAttempts }
      })
      .success(({ update, data }) => update({ error: null, ...data }))
      .error(({ update, error }) => update({ error: error.message })),
    подключение: process({ title: "Установка соединения WebSocket" })
      .action(
        /** @returns {Promise<{timeStampConnected: number, remainingAttempts: number}>} */
        ({ core, context }) =>
          new Promise((resolve, reject) => {
            core.socket = new WebSocket(core.url)
            core.socket.onclose = () => reject(new Error("WebSocket соединение закрыто"))
            core.socket.onerror = () => reject(new Error("WebSocket ошибка соединения"))
            core.socket.onopen = () =>
              resolve({ timeStampConnected: new Date().getTime(), remainingAttempts: context.maxAttempts })
          })
      )
      .success(({ update, data }) =>
        update({ timeStampConnected: data.timeStampConnected, remainingAttempts: data.remainingAttempts })
      )
      .error(({ update, error }) => update({ error: error.message })),

    подключен: process({ title: "Мониторинг WebSocket соединения" })
      .action(
        ({ core }) =>
          new Promise((_, reject) => {
            if (!core.socket) return reject(new Error("Нет WebSocket соединения в состоянии connected"))
            core.socket.onclose = (/** @type {CloseEvent} */ event) => {
              console.log("🔌 WebSocket соединение закрыто:", event.code, event.reason)
              return reject(new Error("WebSocket соединение закрыто"))
            }
            core.socket.onerror = (/** @type {Event} */ error) => {
              console.log("❌ Ошибка WebSocket соединения:", error)
              return reject(error)
            }
          })
      )
      .error(({ update, error }) => update({ error: error.message })),

    ожидание: process({ title: "Ожидание переподключения к WebSocket" })
      .action(
        ({ context }) =>
          new Promise((resolve) => {
            const remainingAttempts = context.remainingAttempts - 1
            const delay =
              context.reconnectDelay *
              Math.pow(context.reconnectDelayMultiplier, context.maxAttempts - remainingAttempts)
            setTimeout(() => {
              resolve({ timeStampConnecting: new Date().getTime(), remainingAttempts })
            }, delay)
          })
      )
      .success(({ update, data }) =>
        update({
          timeStampConnecting: data.timeStampConnecting,
          timeStampConnected: null,
          timeStampDisconnected: null,
          error: null,
          remainingAttempts: data.remainingAttempts,
        })
      )
      .error(({ update, error }) => update({ timeStampConnecting: null, error: error.message })),
  }))
  .reactions(() => [])
  .view({
    render: ({ html, context, state, choose, when, core }) => html`
      ${when(
        state === "подключен",
        () => html`<meta-${messenger} core=${{ socket: core.socket }}></meta-${messenger}>`
      )}
      <div class="websocket-status">
        <div class="status-info">
          <span class="status ${state}">${state}</span>
          ${when(context.error, () => html`<span class="error">${context.error}</span>`)}
          ${when(
            context.remainingAttempts !== null && context.remainingAttempts < 5,
            () => html`<span class="attempts">(${5 - context.remainingAttempts})</span>`
          )}
          ${when(
            context.remainingAttempts !== null && context.remainingAttempts > 0 && context.remainingAttempts < 5,
            () => html`<span class="remaining">осталось: ${context.remainingAttempts}</span>`
          )}
        </div>
        <span class="icon">
          ${choose(
            state,
            [
              ["подключен", () => "🔗"],
              ["подключение", () => "🔄"],
              ["ошибка", () => "❌"],
              ["ожидание", () => "⏳"],
            ],
            () => "🔌"
          )}
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
        cursor: default;
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

      .status.ожидание {
        color: rgba(var(--warning-400) / 0.95);
        text-shadow: 0 1px 2px rgba(var(--warning-900) / 0.3);
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

      .remaining {
        color: rgba(var(--warning-400) / 0.8);
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
