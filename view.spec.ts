import { describe, it, expect } from "bun:test"
import { MetaFor } from "./metafor"

describe("Представление", () => {
  MetaFor(Bun.randomUUIDv7())
    .context((t) => ({
      status: t.enum("start", "process", "end").required({ title: "Статус", default: "start" }),
      error: t.string.optional({ title: "Ошибка" }),
    }))
    .states({
      начало: { to: {} },
      конец: { to: {} },
    })
    .view({
      render: ({ html, context }) => html` <h1>${context.status}</h1> `,
      style: ({ css }) => css``,
    })
})
