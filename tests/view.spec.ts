import { describe, it, expect, beforeAll } from "bun:test"
import { MetaFor } from "../types"

describe("View", () => {
  beforeAll(() => {
    document.body.innerHTML = "<metafor-view></metafor-view>"
  })

  const metaView = MetaFor("view")
    .states("init")
    .context((t) => ({
      param: t.boolean({ default: false }),
    }))
    .transitions([])
    .core()
    .actions({})
    .view({
      render: ({ html, update, context }) =>
        html`<button @click=${() => update({ param: !context.param })}>${context.param ? "true" : "false"}</button>`,
    })
    .create({
      state: "init",
    })
  it("При обновлении контекста, не должен вызываться connectedCallback", async () => { // FIXME: сделать проверку на перерендер
    await Bun.sleep(1000)
    const element: HTMLElement = document.querySelector("metafor-view")!
    const button: HTMLButtonElement = element.shadowRoot?.querySelector("button")!

    expect(element).toBeDefined()
    expect(button).toBeDefined()
    button.click()

    expect(metaView.context.param).toBe(true)

    expect(button?.textContent).toBe("true")
  })
})
