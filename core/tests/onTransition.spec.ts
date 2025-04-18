import { describe, expect, test } from "bun:test"
import { MetaFor } from "@metafor/space"

const meta = MetaFor("Обработчик событий")
  .states("IDLE", "RUNNING", "ERROR", "SUCCESS")
  .context((t) => ({
    url: t.string({ title: "URL", nullable: true }),
    responseTime: t.number({ title: "Время ответа", nullable: true }),
    errorCode: t.number({ title: "Код ошибки", nullable: true }),
  }))
  .core()
  .transitions([
    {
      from: "IDLE",
      to: [{ state: "RUNNING", when: { url: { startsWith: "https://" }, responseTime: { gt: 0, lt: 5000 } } }],
    },
    {
      from: "RUNNING",
      to: [
        { state: "SUCCESS", when: { responseTime: { gt: 0, lt: 5000 }, errorCode: 200 } },
        { state: "ERROR", when: { errorCode: { gt: 400, lt: 599 } } },
      ],
    },
    {
      from: "ERROR",
      to: [{ state: "IDLE", when: { url: { startsWith: "https://" } } }],
    },
    {
      from: "SUCCESS",
      to: [{ state: "IDLE", when: { url: { startsWith: "https://" } } }],
    },
  ])
  .create({
    state: "IDLE",
    context: {
      url: null,
      responseTime: 0,
      errorCode: 0,
    },
  })

describe("Подписка на изменения состояния (onTransition)", () => {
  describe("Базовая работа подписки", () => {
    test("Подписка должна срабатывать при изменении состояния", async () => {
      let oldState: string | undefined
      let newState: string | undefined

      meta.onTransition((prevState, nextState) => {
        oldState = prevState
        newState = nextState
      })
      meta.update({ url: "https://api.example.com", responseTime: 2000, errorCode: 0 })

      await Bun.sleep(10)

      expect(oldState).toBe("IDLE")
      expect(newState).toBe("RUNNING")
    })

    test("Подписка не должна срабатыват при переходе в то же состояние", () => {
      let callbackCalled = false

      meta.onTransition(() => (callbackCalled = true))

      meta.update({ url: "https://api.example.com", responseTime: 2000, errorCode: 0 })

      expect(callbackCalled).toBe(false)
    })
  })

  describe("Множественные подписки", () => {
    test("Поддержка нескольких подписок", async () => {
      let firstCallbackCalled = false
      let secondCallbackCalled = false

      meta.onTransition(() => (firstCallbackCalled = true))
      meta.onTransition(() => (secondCallbackCalled = true))

      meta.update({ errorCode: 500 })
      await Bun.sleep(10)
      expect(firstCallbackCalled).toBe(true)
      expect(secondCallbackCalled).toBe(true)
    })

    test("Отписка не должна влиять на другие подписки", () => {
      let firstCallbackCalled = false
      let secondCallbackCalled = false

      const unsubscribe = meta.onTransition(() => (firstCallbackCalled = true))

      meta.onTransition(() => (secondCallbackCalled = true))

      unsubscribe()

      meta.update({ url: "https://api.example.com", responseTime: 3000, errorCode: 0 })

      expect(firstCallbackCalled).toBe(false)
      expect(secondCallbackCalled).toBe(true)
    })
  })

  describe("Последовательные изменения", () => {
    test("Корректное отслеживание цепочки изменений состояний", async () => {
      const collapses: { from: string; to: string }[] = []

      meta.onTransition((prevState, nextState) => collapses.push({ from: prevState as string, to: nextState as string }))

      // Переход в RUNNING
      meta.update({ url: "https://api.example.com", responseTime: 3000, errorCode: 0 })
      await Bun.sleep(10)
      // Переход в ERROR
      meta.update({ responseTime: 4000, errorCode: 500 })
      await Bun.sleep(10)
      // Переход обратно в IDLE
      meta.update({ url: "https://api.example.com", responseTime: 1000, errorCode: 0 })

      expect(collapses).toEqual([
        { from: "IDLE", to: "RUNNING" },
        { from: "RUNNING", to: "ERROR" },
        { from: "ERROR", to: "IDLE" },
      ])
    })
  })
})
