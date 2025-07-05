import {describe, test, expect} from "bun:test"
import {MetaFor} from "@metafor/space"
import {createRef} from "../html/directives/ref"

describe("MetaFor view", () => {
  test("Рендерит правильный текст через внутренний snapshot", async () => {
    let snapshot = ""
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const buttonRef = createRef()
    MetaFor(tag)
      .context((t) => ({
        param: t.boolean({default: false}),
      }))
      .core(() => ({
        button: buttonRef
      }))
      .reactions({})
      .states("init")
      .transitions("init", [])
      .view({
        render: function ({html, update, context, ref, core}) {
          snapshot = `${context.param ? "true" : "false"}`
          return html`
            <button ${ref(core.button)} @click=${() => update({param: !context.param})}>
              ${context.param ? "true" : "false"}
            </button>`
        },
        onMount({core}) {
          const btn = core.button.value as HTMLButtonElement | undefined
          if (btn) btn.click()
        }
      })
    await Bun.sleep(10)
    expect(snapshot).toBe("true") // после клика
  })

  test("Обновляет snapshot при изменении контекста", async () => {
    let snapshot = ""
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const buttonRef = createRef()
    MetaFor(tag)
      .context((t) => ({
        param: t.boolean({default: false}),
      }))
      .core(() => ({
        button: buttonRef
      }))
      .reactions({})
      .states("init")
      .transitions("init", [])
      .view({
        render: function ({html, update, context, ref, core}) {
          snapshot = `${context.param ? "true" : "false"}`
          return html`
            <button ${ref(core.button)} @click=${() => update({param: !context.param})}>
              ${context.param ? "true" : "false"}
            </button>`
        },
        onMount({core}) {
          const btn = core.button.value as HTMLButtonElement | undefined
          if (btn) btn.click()
        }
      })
    await Bun.sleep(10)
    expect(snapshot).toBe("true")
    const btn = buttonRef.value as HTMLButtonElement | undefined
    if (btn) btn.click()
    await Bun.sleep(10)
    expect(snapshot).toBe("false")
  })

  test("onMount не вызывается повторно при update (API)", async () => {
    let mountCount = 0
    let snapshot = ""
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const buttonRef = createRef()
    MetaFor(tag)
      .context((t) => ({
        param: t.boolean({default: false}),
      }))
      .core(() => ({
        button: buttonRef
      }))
      .reactions({})
      .states("init")
      .transitions("init", [])
      .view({
        render: function ({html, update, context, ref, core}) {
          snapshot = `${context.param ? "true" : "false"}`
          return html`
            <button ${ref(core.button)} @click=${() => update({param: !context.param})}>
              ${context.param ? "true" : "false"}
            </button>`
        },
        onMount({core}) {
          mountCount++
          const btn = core.button.value as HTMLButtonElement | undefined
          if (btn) btn.click()
        }
      })
    await Bun.sleep(10)
    // update через API
    const meta = document.querySelector(`metafor-${tag}`) as any
    meta.update({param: false})
    await Bun.sleep(10)
    expect(mountCount).toBe(1)
  })

  test("Снапшот view после рендера (через snapshot переменную)", async () => {
    let snapshot = ""
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const buttonRef = createRef()
    MetaFor(tag)
      .context((t) => ({
        param: t.boolean({default: false}),
      }))
      .core(() => ({
        button: buttonRef
      }))
      .reactions({})
      .states("init")
      .transitions("init", [])
      .view({
        render: function ({html, update, context, ref, core}) {
          snapshot = `${context.param ? "true" : "false"}`
          return html`
            <button ${ref(core.button)} @click=${() => update({param: !context.param})}>
              ${context.param ? "true" : "false"}
            </button>`
        },
        onMount({core}) {
          const btn = core.button.value as HTMLButtonElement | undefined
          if (btn) btn.click()
        }
      })
    await Bun.sleep(10)
    expect(snapshot).toMatchSnapshot()
  })
})
