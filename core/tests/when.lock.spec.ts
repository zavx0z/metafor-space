import { expect, test } from "bun:test"
import { MetaFor } from "@metafor/space"

test("блокировка условий перед входом в новое состояние", async () => {
  let value = -1

  const meta = MetaFor("test-sync")
    .states("INIT", "PROCESS", "DONE")
    .context((t) => ({
      value: t.number({ nullable: true }),
    }))
    .core()
    .transitions([
      {
        action: ({ update }) => {
          update({ value: 11 })
        },
        from: "INIT",
        to: [{ state: "PROCESS", when: { value: { gt: 10 } } }],
      },
      {
        action: ({ update }) => {
          update({ value: 15 })
          const end = Date.now() + 500
          while (Date.now() < end) {
            // Блокируем поток
          }
        },
        from: "PROCESS",
        to: [
          { state: "DONE", when: { value: { gt: 14 } } },
          { state: "INIT", when: { value: { lt: 4 } } },
        ],
      },
    ])
    .create({
      state: "INIT",
      onTransition: async (_, newState, meta) => {
        console.log(newState)
        if (newState === "PROCESS") {
          console.log(newState, meta.context.value)
          meta.update({ value: 1 }) // не должен вызвать переход, но контекст должен быть обновлен даже при блокировке условий
          value = meta.context.value
        }
      },
    })
  await Bun.sleep(1000)
  expect(value).toBe(1)
  expect(meta.state).toBe("DONE")
})

test("блокировка условий для асинхронного действия", async () => {
  const meta = MetaFor("test-async")
    .states("INIT", "PROCESS", "DONE")
    .context((t) => ({
      value: t.number({ nullable: true }),
    }))
    .core()
    .transitions([
      {
        from: "INIT",
        action: async ({ update }) => {
          await new Promise((resolve) => setTimeout(resolve, 10))
          update({ value: 15 }) // Это не должно вызвать переход
        },
        to: [
          {
            state: "DONE",
            when: { value: { gt: 10 } },
          },
        ],
      },
    ])
    .create({ state: "INIT" })

  const result: unknown = meta.update({ value: 1 })
  if (result instanceof Promise) {
    expect(meta.process).toBe(true)
    await result
    expect(meta.process).toBe(false)
  }
  expect(meta.state).toBe("INIT") // Проверяем что условие заблокировано во время действия
})

test("снятие блокировки после действия", async () => {
  const meta = MetaFor("test-lock")
    .states("INIT", "DONE")
    .context((t) => ({
      value: t.number({ nullable: true }),
    }))
    .core()
    .transitions([
      {
        from: "INIT",
        action: async ({ update }) => {
          await new Promise((resolve) => setTimeout(resolve, 50))
          update({ value: 15 })
        },
        to: [
          {
            state: "DONE",
            when: { value: { gt: 10 } },
          },
        ],
      },
    ])
    .create({ state: "INIT", context: { value: 2 } })

  expect(meta.state).toBe("INIT")
  expect(meta.process).toBe(true)
  await Bun.sleep(100)
  expect(meta.process).toBe(false)
  expect(meta.state).toBe("DONE")
})
