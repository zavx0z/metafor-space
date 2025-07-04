import {expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"


test("Блокировка переходов перед входом в новое состояние", async () => {
  let value = -1
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
        action: () => {
          return {value: 11} // Автоматически обновит контекст
        },
        to: [{state: "PROCESS", when: {value: {gt: 10}}}],
      },
      {
        in: "PROCESS",
        action: () => {
          const end = Date.now() + 500
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
  // .create({
  //   onTransition: async (_, newState, meta) => {
  //     if (newState === "PROCESS") {
  //       const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>
  //       meta.update({value: 1}) // не должен вызвать переход, но контекст должен быть обновлен даже при блокировке переходов
  //       value = meta.context.value
  //     }
  //   },
  // })
  const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

  await Bun.sleep(1000)
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
