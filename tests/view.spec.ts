import {describe, it, expect} from "bun:test"
import {MetaFor} from "@metafor/space"

describe("View", () => {
  const tag = Bun.randomUUIDv7()
  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Meta = MetaFor(tag)
    .context((t) => ({
      param: t.boolean({default: false}),
    }))
    .core()
    .states("init")
    .transitions("init", [])
    .reactions([])
    .view({
      render: ({html, update, context}) =>
        html`
          <button @click=${() => update({param: !context.param})}>${context.param ? "true" : "false"}</button>
        `
    })
  const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>


  it("При обновлении контекста, не должен вызываться connectedCallback", async () => { // FIXME: сделать проверку на перерендер
    // const button: HTMLButtonElement = meta.shadowRoot?.querySelector("button")!
    //
    // expect(button).toBeDefined()
    // button.click()

    expect(meta.context.param).toBe(true)

    // expect(button?.textContent).toBe("true")
  })
})
