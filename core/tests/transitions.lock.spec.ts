import {expect, test} from "bun:test"
import {MetaFor, type Meta} from "@metafor/space"

test("Блокировка переходов перед входом в новое состояние", async () => {
  let value = -1
  document.body.innerHTML = `<metafor-test-1></metafor-test-1>`
  const Meta = MetaFor("test-1")
    .states("INIT", "PROCESS", "DONE")
    .context((t) => ({
      value: t.number({nullable: true}),
    }))
    .core()
    .transitions([
      {
        from: "INIT",
        action: ({update}) => {
          update({value: 11})
        },
        to: [{state: "PROCESS", when: {value: {gt: 10}}}],
      },
      {
        from: "PROCESS",
        action: ({update}) => {
          update({value: 15})
          const end = Date.now() + 500
          while (Date.now() < end) {
            // Блокируем поток
          }
        },
        to: [
          {state: "DONE", when: {value: {gt: 14}}},
          {state: "INIT", when: {value: {lt: 4}}},
        ],
      },
    ])
    .create({
      state: "INIT",
      onTransition: async (_, newState, meta) => {
        console.log(newState)
        if (newState === "PROCESS") {
          const meta = document.querySelector('metafor-test-1') as Meta<typeof Meta.state, typeof Meta.context>
          meta.update({ value: 1 }) // не должен вызвать переход, но контекст должен быть обновлен даже при блокировке переходов
          value = meta.context.value
        }
      },
    })
  const meta = document.querySelector('metafor-test-1') as Meta<typeof Meta.state, typeof Meta.context>

  await Bun.sleep(1000)
  expect(value).toBe(1)
  expect(meta.state).toBe("DONE")
})

test("Блокировка переходов для асинхронного действия", async () => {
  document.body.innerHTML = `<metafor-test-2></metafor-test-2>`
  const Meta = MetaFor("test-2")
    .states("INIT", "PROCESS", "DONE")
    .context((t) => ({
      value: t.number({nullable: true}),
    }))
    .core()
    .transitions([
      {
        from: "INIT",
        action: async ({update}) => {
          await new Promise((resolve) => setTimeout(resolve, 10))
          update({value: 15}) // Это не должно вызвать переход
        },
        to: [{state: "DONE", when: {value: {gt: 10}}}],
      },
    ])
    .create({state: "INIT"})
  const meta = document.querySelector('metafor-test-2') as Meta<typeof Meta.state, typeof Meta.context>

  const result: unknown = meta.update({value: 1})
  if (result instanceof Promise) {
    expect(meta.process).toBe(true)
    await result
    expect(meta.process).toBe(false)
  }
  expect(meta.state).toBe("INIT") // Проверяем что переходы заблокированы во время действия
})

test("Снятие блокировки после действия", async () => {
  document.body.innerHTML = `<metafor-test-3></metafor-test-3>`
  const Meta = MetaFor("test-3")
    .states("INIT", "DONE")
    .context((t) => ({
      value: t.number({nullable: true, default: 2}),
    }))
    .core()
    .transitions([
      {
        from: "INIT",
        action: async ({update}) => {
          await new Promise((resolve) => setTimeout(resolve, 50))
          update({value: 15})
        },
        to: [{state: "DONE", when: {value: {gt: 10}}}],
      },
    ])
    .create({state: "INIT"})
  const meta = document.querySelector('metafor-test-3') as Meta<typeof Meta.state, typeof Meta.context>

  expect(meta.state).toBe("INIT")
  expect(meta.process).toBe(true)
  await Bun.sleep(100)
  expect(meta.process).toBe(false)
  expect(meta.state).toBe("DONE")
})
