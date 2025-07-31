import { MetaFor } from "../metafor.js"
// import "./graph-layout.js"
// import "./graph-listener.js"
// import "./graph-meta.js"
// import "./graph-state.js"
// import "./graph-context.js"
// import "./graph-param.js"
// import "./graph-condition.js"

MetaFor("graph-nodes")
  .context((t) => ({
    error: t.string.optional()({ title: "Ошибка" }),
    queue: t.array.optional()({ title: "Очередь акторов для добавления" }),
  }))
  .states({
    render: {
      "центрирование одной ноды": { error: null, queue: { length: 1 } },
    },
    "центрирование одной ноды": {
      render: { error: { null: false } },
    },
  })
  .core()
  .processes((process) => ({}))
  .reactions((reaction) => [
    [
      ["render", "центрирование одной ноды"],
      reaction({ title: "Блокировка всплытия" })
        .filter({
          tag: /\*/,
        })
        .equal(() => {}),
    ],
    [
      ["render", "центрирование одной ноды"],
      reaction({ title: "получение списка добавляемых акторов" })
        .filter({
          tag: "graph-listener",
          path: "/context",
          op: "add",
          // value:{nodes: { length: 1 }},
        })
        .equal(({ context }) => {}),
    ],
  ])
  .view({
    render: ({ html }) => html`
      <metafor-graph-layout>
      </metafor-graph-layout>
    `,
    style: ({ css }) => css`
      :host {
        color: rgb(var(--surface-50));
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
      }
    `,
  })
