import { describe, it, expect } from "bun:test"
import { MetaFor } from "./metafor"
import { render } from "./html/html"
import { html, literal, unsafeStatic } from "./html/static"
import { ref } from "./html/directives/ref"

describe("Представление", async () => {
  const tag = Bun.randomUUIDv7()
  let h1: HTMLHeadingElement

  const meta = MetaFor(tag)
    .context((t) => ({
      status: t.enum("start", "process", "end").required({ title: "Статус", default: "start" }),
      error: t.string.optional({ title: "Ошибка" }),
    }))
    .states({
      начало: { to: {} },
      конец: { to: {} },
    })
    .view({
      render: ({ html, context }) =>
        html`
          <h1
            ${ref((el: Element | undefined) => {
              if (el) {
                h1 = el as HTMLHeadingElement
              }
            })}
          >
            ${context.status}
          </h1>
        `,
      style: ({ css }) => css``,
    })


  render(html`<metafor-${unsafeStatic(tag)}></metafor-${unsafeStatic(tag)}>`, document.body)

  it("render", () => {
    const el = document.querySelector(`metafor-${tag}`) as unknown as Meta<typeof meta>
    expect(h1.textContent?.trim()).toBe("start")
    el.update({ status: "process", error: "error" })
    // expect(h1.textContent?.trim()).toBe("process")
    expect(el.context.error).toBe("error")
  })
})
