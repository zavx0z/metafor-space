import { expect, test } from "bun:test"
import { MetaFor } from "../index.js"

test("блокировка триггеров перед входом в новое состояние", async () => {
  let value = -1

  const particle = MetaFor("test-sync")
    .states("INIT", "PROCESS", "DONE")
    .context((t) => ({
      value: t.number({ nullable: true }),
    }))
    .transitions([
      {
        from: "INIT",
        action: "initAction",
        to: [{ state: "PROCESS", trigger: { value: { gt: 10 } } }],
      },
      {
        from: "PROCESS",
        action: "syncAction",
        to: [
          { state: "DONE", trigger: { value: { gt: 14 } } },
          { state: "INIT", trigger: { value: { lt: 4 } } },
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
      onTransition: async (_, newState, particle) => {
        if (newState === "PROCESS") {
          particle.update({ value: 1 }) // не должен вызвать переход, но контекст должен быть обновлен даже при блокировке триггеров
          value = particle.context.value
        }
      },
    })
  await Bun.sleep(1000)
  expect(value).toBe(1)
  expect(particle.state).toBe("DONE")
})

test("блокировка триггеров для асинхронного действия", async () => {
  const particle = MetaFor("test-async")
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
            trigger: { value: { gt: 10 } },
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
    
  const result: unknown = particle.update({ value: 1 })
  if (result instanceof Promise) {
    expect(particle.process).toBe(true)
    await result
    expect(particle.process).toBe(false)
  }
  expect(particle.state).toBe("INIT") // Проверяем что триггер заблокирован во время действия
})

test("снятие блокировки после действия", async () => {
  const particle = MetaFor("test-lock")
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
            trigger: { value: { gt: 10 } },
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

  expect(particle.state).toBe("INIT")
  expect(particle.process).toBe(true)
  await Bun.sleep(100)
  expect(particle.process).toBe(false)
  expect(particle.state).toBe("DONE")
})
