import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"
import {messagesFixture} from "../../fixtures/broadcast.ts"


describe("MetaFor: автоматические автопереходы и обновление контекста", async () => {
  const tag = Bun.randomUUIDv7()
  const {waitForMessages} = messagesFixture({meta: tag})

  const initialState = "INITIAL"
  const initialContext = {value: "initial"}
  const nextContext = {value: "next"}
  const otherState = "OTHER"
  const otherContext = {value: "other"}

  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Meta = MetaFor(tag)
    .context((t) => ({
      value: t.string({nullable: true, default: initialContext.value}),
    }))
    .core()
    .states("INITIAL", "OTHER", "NEXT")
    .transitions(initialState, [
      {
        in: "INITIAL",
        action: async () => {
          await Bun.sleep(100)
          return nextContext // Автоматически обновит контекст
        },
        to: [{state: "NEXT", when: {value: nextContext.value}}],
      },
      {
        in: "NEXT",
        action: async () => {
          await Bun.sleep(100)
          return otherContext // Автоматически обновит контекст
        },
        to: [{state: "OTHER", when: {value: otherContext.value}}]
      }
    ])
    .reactions([])
    .view({})
  const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

  const messages = await waitForMessages(2000)


  test("[transition] Первый патч add содержит полную информацию об акторе", () => {
    console.log("Messages:", messages.map(m => ({op: m.patch.op, path: m.patch.path, state: m.patch.value?.state, context: m.patch.value?.context})))
    expect(messages[0].patch.op).toBe("add")
    expect(messages[0].patch.path).toBe("/")
    expect(messages[0].patch.value.state).toBe(initialState)

    expect(messages[0].patch.value.context).toEqual(otherContext)
  })

  test("[transition] Второй патч содержит состояние инициализации", () => {
    expect(messages[1].patch.op).toBe("add")
    expect(messages[1].patch.path).toBe("/state")
    expect(messages[1].patch.value).toBe(initialState)
  })

  test("[transition] Последующие патчи содержат обновления контекста и состояний", () => {
    const contextPatches = messages.filter(m => m.patch.path === "/context" && m.patch.op === "replace")
    const statePatches = messages.filter(m => m.patch.path === "/state" && m.patch.op === "replace")
    
    expect(contextPatches.length).toBeGreaterThanOrEqual(2) // Обновления контекста от action
    expect(statePatches.length).toBeGreaterThanOrEqual(2)   // Смены состояний
    
    // Проверяем, что есть патчи для каждого автоперехода
    expect(contextPatches[0].patch.value).toEqual(nextContext)
    expect(contextPatches[1].patch.value).toEqual(otherContext)
  })

  test("[transition] После автопереходов контекст и state соответствуют последнему переходу (финальное состояние)", async () => {
    await Bun.sleep(250)
    expect(meta.state).toBe(otherState)
    expect(meta.context).toEqual(otherContext)
  })

  test("[transition] process всегда false — переходы выполняются синхронно", () => {
    expect(meta.process).toBe(false)
    meta.update({value: "initial"})
    expect(meta.process).toBe(false)
  })

  test("[transition] Для каждого автоперехода есть патчи на context и state (сообщения)", () => {
    const ops = messages.map(m => m.patch.op)
    expect(ops).toContain("add")
    expect(ops.filter(x=>x==="replace").length).toBeGreaterThanOrEqual(2)
    const statePatches = messages.filter(m => m.patch.path === "/state")
    const contextPatches = messages.filter(m => m.patch.path === "/context")
    expect(statePatches.length).toBeGreaterThanOrEqual(2)
    expect(contextPatches.length).toBeGreaterThanOrEqual(2)
  })

  test("[snapshot] Сырые сообщения фикстуры", () => {
    // Выводим все сообщения в snapshot для наглядности
    expect(messages).toMatchSnapshot()
  })
})
