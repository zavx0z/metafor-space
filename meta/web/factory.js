import { MetaFor } from "../../web/metafor.js"

export default MetaFor("factory")
  .context((t) => ({
    queue: t.array.required(/** @type {number[]} */ ([]))({ title: "Очередь" }),
  }))
  .states({})
  .core(
    /** @type {import("./factory.t").Core} */ ({
      actors: [],
    })
  )
  .processes((process) => ({}))
  .reactions()
  .view({
    render: ({ html, context, repeat, core, when }) => html`
      <div class="messenger-container">
        <header class="header">
          <h1>Очередь акторов</h1>
          <div class="status-indicator ${core.actors.length > 0 ? "active" : "idle"}"></div>
        </header>

        <div class="queue-container">
          ${when(
            core.actors.length > 0,
            () => html`
              <ul class="actor-list">
                ${repeat(
                  core.actors,
                  (actor) => actor.id,
                  (actor, index) => html`
                    <li class="actor-item">
                      <span class="actor-name">${actor.name}</span>
                      <div class="actor-number">${index + 1}</div>
                    </li>
                  `
                )}
              </ul>
            `,
            () => html` <div class="empty-state"><p class="empty-text">Очередь пуста</p></div> `
          )}
        </div>
      </div>
    `,
    style: ({ css }) => css`
      :host {
        @extend .backdrop;
        display: flex;
        flex-direction: column;
        padding: 16px;
        border-radius: 12px;
        background: rgba(var(--surface-800) / 0.6);
        border: 1px solid rgba(var(--surface-400) / 0.3);
        flex: 1;
        max-width: 100%;
        width: 222px;
      }

      .messenger-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(var(--surface-400) / 0.2);
        flex-shrink: 0;
      }

      h1 {
        color: rgba(var(--surface-50) / 0.95);
        font-weight: 600;
        margin: 0;
        font-size: 1.1em;
      }

      .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        transition: all 0.3s ease;
      }

      .status-indicator.idle {
        background: rgba(var(--surface-500) / 0.8);
      }

      .status-indicator.active {
        background: rgba(var(--primary-400) / 0.9);
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }

      .queue-container {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
      }

      .queue-container::-webkit-scrollbar {
        width: 4px;
      }

      .queue-container::-webkit-scrollbar-track {
        background: rgba(var(--surface-700) / 0.3);
        border-radius: 2px;
      }

      .queue-container::-webkit-scrollbar-thumb {
        background: rgba(var(--primary-400) / 0.5);
        border-radius: 2px;
      }

      .actor-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .actor-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        border: 1px solid rgba(var(--surface-400) / 0.3);
        border-radius: 8px;
        background: rgba(var(--surface-700) / 0.6);
        backdrop-filter: blur(22px);
        color: rgba(var(--surface-50) / 0.9);
        transition: all 0.2s ease;
      }

      .actor-item:hover {
        background: rgba(var(--primary-700) / 0.4);
        border-color: rgba(var(--primary-400) / 0.6);
      }

      .actor-name {
        font-weight: 500;
        color: rgba(var(--surface-50) / 0.95);
        font-size: 0.9em;
      }

      .actor-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(var(--primary-600) / 0.3);
        border: 1px solid rgba(var(--primary-400) / 0.4);
        color: rgba(var(--primary-50) / 0.9);
        font-size: 0.7em;
        font-weight: 600;
      }

      .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        text-align: center;
        color: rgba(var(--surface-300) / 0.7);
        flex: 1;
      }

      .empty-text {
        font-size: 0.9em;
        color: rgba(var(--surface-200) / 0.8);
        margin: 0;
      }
    `,
  })
