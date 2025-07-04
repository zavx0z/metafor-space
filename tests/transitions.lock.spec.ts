import {expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"


test("Блокировка переходов перед входом в новое состояние", async () => {
  let value = -1
  const tag = Bun.randomUUIDv7()
  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  MetaFor(tag)
    .context((t) => ({
      value: t.number({nullable: true}),
    }))
    .core(({update}) => ({
      update
    }))
    .states("INIT", "PROCESS", "DONE")
    .transitions("INIT", [
      {
        in: "INIT",
        action: () => {
          return {value: 11} // Автоматически обновит контекст
        },
        to: [{state: "PROCESS", when: {value: {gt: 10}}}],
      },
      {
        in: "PROCESS",
        action: ({core, context}) => {
          core.update({value: 1})
          value = context.value
          const end = Date.now() + 444
          while (Date.now() < end) {
            // Блокируем поток
          }
          return {value: 15} // Автоматически обновит контекст
        },
        to: [
          {state: "DONE", when: {value: {gt: 14}}},
          {state: "INIT", when: {value: {lt: 4}}},
        ],
      },
    ])
    .reactions([])
    .view({})
  const meta = document.querySelector(`metafor-${tag}`) as any
  await Bun.sleep(500)
  expect(value).toBe(1)
  expect(meta.state).toBe("DONE")
})

test("Блокировка переходов для асинхронного действия", async () => {
  const tag = Bun.randomUUIDv7()
  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Meta = MetaFor(tag)
    .context((t) => ({
      value: t.number({nullable: true}),
    }))
    .core()
    .states("INIT", "PROCESS", "DONE")
    .transitions("INIT", [
      {
        in: "INIT",
        action: async () => {
          await new Promise((resolve) => setTimeout(resolve, 10))
          return {value: 15} // Автоматически обновит контекст
        },
        to: [{state: "DONE", when: {value: {gt: 10}}}],
      },
    ])
    .reactions([])
    .view({})
  const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

  meta.update({value: 1})
  expect(meta.state).toBe("INIT") // Проверяем что переходы заблокированы во время действия
})

test("Снятие блокировки после действия", async () => {
  const tag = Bun.randomUUIDv7()
  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Meta = MetaFor(tag)
    .context((t) => ({
      value: t.number({nullable: true, default: 2}),
    }))
    .core()
    .states("INIT", "DONE")
    .transitions("INIT", [
      {
        in: "INIT",
        action: async () => {
          await new Promise((resolve) => setTimeout(resolve, 50))
          return {value: 15} // Автоматически обновит контекст
        },
        to: [{state: "DONE", when: {value: {gt: 10}}}],
      },
    ])
    .reactions([])
    .view({})
  const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

  expect(meta.state).toBe("INIT")
  expect(meta.process).toBe(true)
  await Bun.sleep(100)
  expect(meta.process).toBe(false)
  expect(meta.state).toBe("DONE")
})
