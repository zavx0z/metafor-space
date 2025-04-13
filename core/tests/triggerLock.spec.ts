import { expect, test } from "bun:test"
import { MetaFor } from "@metafor/space"

test("блокировка условий перед входом в новое состояние", async () => {
  let value = -1

  const meta = MetaFor("test-sync")
    .states("INIT", "PROCESS", "DONE")
    .context((t) => ({
      value: t.number({ nullable: true }),
    }))
    .transitions([
      {
        action: "initAction",
        from: "INIT",
        to: [{ state: "PROCESS", when: { value: { gt: 10 } } }],
      },
      {
        action: "syncAction",
        from: "PROCESS",
        to: [
          { state: "DONE", when: { value: { gt: 14 } } },
          { state: "INIT", when: { value: { lt: 4 } } },
        ],
      },
    ])
    .core()
    .actions({
      initAction: ({ update }) => {
        update({ value: 11 })
      },
      syncAction: ({ update }) => {
        update({ value: 15 })
        const end = Date.now() + 500
        while (Date.now() < end) {
          // Блокируем поток
        }
      },
    })
    .create({
      state: "INIT",
      onTransition: async (_, newState, meta) => {
        console.log(newState)
        if (newState === "PROCESS") {
          console.log(newState, meta?.context.value)
          meta?.update({ value: 1 }) // не должен вызвать переход, но контекст должен быть обновлен даже при блокировке триггеров
          value = meta?.context.value
        }
      },
    })
  await Bun.sleep(1000)
  expect(value).toBe(1)
  expect(meta.state).toBe("DONE")
})

test("блокировка триггеров для асинхронного действия", async () => {
  const meta = MetaFor("test-async")
    .states("INIT", "PROCESS", "DONE")
    .context((t) => ({
      value: t.number({ nullable: true }),
    }))
    .transitions([
      {
        from: "INIT",
        action: "asyncAction",
        to: [
          {
            state: "DONE",
              when: { value: { gt: 10 } },
          },
        ],
      },
    ])
    .core()
    .actions({
      asyncAction: async ({ update }) => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        update({ value: 15 }) // Это не должно вызвать переход
      },
    })
    .reactions([])
    .create({ state: "INIT" })
    
  const result: unknown = meta.update({ value: 1 })
  if (result instanceof Promise) {
    expect(meta.process).toBe(true)
    await result
    expect(meta.process).toBe(false)
  }
  expect(meta.state).toBe("INIT") // Проверяем что триггер заблокирован во время действия
})

test("снятие блокировки после действия", async () => {
  const meta = MetaFor("test-lock")
    .states("INIT", "DONE")
    .context((t) => ({
      value: t.number({ nullable: true }),
    }))
    .transitions([
      {
        from: "INIT",
        action: "longAction",
        to: [
          {
            state: "DONE",
            when: { value: { gt: 10 } },
          },
        ],
      },
    ])
    .core()
    .actions({
      longAction: async ({ update }) => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        update({ value: 15 })
      },
    })
    .reactions([])
    .create({ state: "INIT", context: { value: 2 } })

  expect(meta.state).toBe("INIT")
  expect(meta.process).toBe(true)
  await Bun.sleep(100)
  expect(meta.process).toBe(false)
  expect(meta.state).toBe("DONE")
})
