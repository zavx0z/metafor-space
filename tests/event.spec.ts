import {describe, expect, test, beforeEach, beforeAll} from "bun:test"
import {MetaFor} from "../metafor.js"
import {html, render} from "../html/html"
import {ref} from "../html/directives/ref"

describe("MetaFor: патчи /context между акторами", () => {

  let parentEl: MetaAny
  let childEl: MetaAny
  let siblingEl: MetaAny

  beforeAll(() => {
    // Регистрируем кастомные элементы только один раз
    MetaFor('test-parent-23982012', {development: true})
      .context(t => ({value: t.string(), count: t.number({default: 0})}))
      .core()
      .states("init")
      .transitions("init", [])
      .reactions([
        {
          title: "Ловим патчи от ребёнка",
          filter: ({meta, patch}) => meta.tag === 'test-child-23982012' && patch.path === "/context",
          action: ({context, update, patch}) => {
            update({count: context.count + 1, value: patch.value.value})
          }
        }
      ])
      .view({
        render: ({html}) => html`
          <slot></slot>`
      })

    MetaFor('test-child-23982012', {development: true})
      .context(t => ({value: t.string()}))
      .core()
      .states("init")
      .transitions("init", [])
      .reactions([
        {
          title: "Ловим патчи от родителя",
          filter: ({meta, patch}) => meta.tag === 'test-parent-23982012' && patch.path === "/context",
          action: ({update, patch}) => {
            update({value: patch.value.value})
          }
        }
      ])
      .view({
        render: ({html}) => html`
          <slot></slot>`
      })

    MetaFor('test-sibling-23982012', {development: true})
      .context(t => ({value: t.string(), got: t.boolean({default: false})}))
      .core()
      .states("init")
      .transitions("init", [])
      .reactions([
        {
          title: "Сосед ловит патчи от другого соседа",
          filter: ({meta, patch}) => meta.tag === 'test-sibling-23982012' && patch.path === "/context",
          action: ({update}) => {
            update({got: true})
          }
        }
      ])
      .view({})

    render(html`
      <metafor-test-parent-23982012 ${ref(el => {
        if (el) parentEl = el as MetaAny
      })}>
        <metafor-test-child-23982012 ${ref(el => {
          if (el) childEl = el as MetaAny
        })}></metafor-test-child-23982012>
        <metafor-test-sibling-23982012 ${ref(el => {
          if (el) siblingEl = el as MetaAny
        })}></metafor-test-sibling-23982012>
      </metafor-test-parent-23982012>
    `, document.body)
  })


  beforeEach(() => {
    if (childEl) childEl.update({value: undefined})
    if (parentEl) parentEl.update({value: undefined, count: 0})
    if (siblingEl) siblingEl.update({value: undefined, got: false})
  })

  test("Родитель получает патч /context от ребёнка", async () => {
    childEl.update({value: "от ребёнка"})
    await Bun.sleep(200)
    expect(parentEl.context.value).toBe("от ребёнка")
    expect(parentEl.context.count).toBe(1)
  })

  test("Сосед не получает патч /context от другого соседа", async () => {
    siblingEl.update({value: "от соседа"})
    await Bun.sleep(200)
    expect(childEl.context.value).not.toBe("от соседа")
    expect(parentEl.context.value).not.toBe("от соседа")
    expect(siblingEl.context.got).toBe(false)
  })

  test("Ребёнок не получает патч /context от родителя", async () => {
    parentEl.update({value: "от родителя"})
    await Bun.sleep(200)
    expect(childEl.context.value).toBe(undefined)
  })

  test("Ребёнок не получает патч /context от соседа родителя", async () => {
    siblingEl.update({value: "от соседа"})
    await Bun.sleep(200)
    expect(childEl.context.value).toBe(undefined)
  })

  test("Сосед не получает патч /context от ребёнка соседа", async () => {
    childEl.update({value: "от ребёнка"})
    await Bun.sleep(200)
    expect(siblingEl.context.value).toBe(undefined)
    expect(siblingEl.context.got).toBe(false)
  })
})

describe("MetaFor: блокировка всплытия между двумя акторами", () => {
  let parent: MetaAny
  let child: MetaAny

  beforeAll(() => {
    MetaFor("block-parent", {development: true})
      .context(t => ({}))
      .core()
      .states("init")
      .transitions("init", [])
      .reactions([
        {
          title: "Блокирующая реакция",
          filter: ({patch}) => patch.path === "/context" && patch.value?.value === "block",
          block: true,
          action: () => {
            console.log("block action")
          }
        },
        {
          title: "Обычная реакция",
          filter: ({patch}) => patch.path === "/context" && patch.value?.value === "child",
          action: () => {
            console.log("child action");
          }
        }
      ])
      .view({})

    MetaFor("block-child", {development: true})
      .context(t => ({value: t.string()}))
      .core()
      .states("init")
      .transitions("init", [])
      .reactions([])
      .view({
        render: ({html}) => html`
          <slot></slot>`
      })

    render(html`
      <metafor-block-parent ${ref(e => {
        if (e) parent = e as MetaAny
      })}>
        <metafor-block-child ${ref(e => {
          if (e) child = e as MetaAny
        })}></metafor-block-child>
      </metafor-block-parent>
    `, document.body)
  })

  test("Блокирующая реакция не даёт событию дойти до document.body", async () => {
    let documentHandled = false

    document.body.addEventListener("channel", (event) => {
      const {patch} = (event as CustomEvent).detail;
      if (patch.path === "/context" && patch.value?.value === "block") {
        documentHandled = true
      }
    })

    child.update({value: "block"})
    expect(documentHandled).toBe(false)
  })

  test("Обычная реакция позволяет событию дойти до document.body", async () => {
    let documentHandled = false

    document.body.addEventListener("channel", (event) => {
      const {patch} = (event as CustomEvent).detail;
      if (patch.path === "/context" && patch.value?.value === "child") {
        documentHandled = true
      }
    })

    child.update({value: "child"})
    expect(documentHandled).toBe(true)
  })
}) 