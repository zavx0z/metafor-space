import { MetaFor } from "../web/metafor.js"
import { createWebSocket, waitForConnection, reconnectWebSocket } from "./websocket.actions.js"

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
  .core(
    /**@type import("./websocket.t").WebSocketCore*/ ({
      socket: null,
      url: "ws://localhost:3000",
      maxReconnectAttempts: 5,
      reconnectDelay: 1000,
      reconnectTimer: null,
    })
  )
  .processes((process) => ({
    disconnected: process({ title: "Подключение к WebSocket" })
      .action(async ({ core }) => {
        const result = await createWebSocket(core.url)
        core.socket = result.socket
        return /**@type{"connecting"}*/ ("connecting")
      })
      .success(({ update, data }) => update({ status: data }))
      .error(({ update, error }) => update({ status: "error", error: error.message })),

    connecting: process({ title: "Ожидание подключения WebSocket" })
      .action(async ({ core }) => {
        const result = await waitForConnection(core.socket)
        return result
      })
      .success(({ update, data }) => update({ status: data }))
      .error(({ update, error }) => update({ status: "error", error: error.message })),

    error: process({ title: "Переподключение к WebSocket" })
      .action(async ({ context, core }) => {
        const result = await reconnectWebSocket(
          context.reconnectAttempts,
          core.maxReconnectAttempts,
          core.reconnectDelay
        )
        return result
      })
      .success(({ update, data }) =>
        update({
          status: data.status,
          reconnectAttempts: data.attempts || 0,
        })
      )
      .error(({ update, error }) => update({ status: "error", error: error.message })),
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
