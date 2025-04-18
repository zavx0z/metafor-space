import { describe, expect, test } from "bun:test"
import { MetaFor } from "../index.js"

const particle = MetaFor("Обработчик событий")
  .states("IDLE", "RUNNING", "ERROR", "SUCCESS")
  .context((t) => ({
    url: t.string({ title: "URL", nullable: true }),
    responseTime: t.number({ title: "Время ответа", nullable: true }),
    errorCode: t.number({ title: "Код ошибки", nullable: true }),
  }))
  .transitions([
    {
      from: "IDLE",
      to: [{ state: "RUNNING", trigger: { url: { startsWith: "https://" }, responseTime: { gt: 0, lt: 5000 } } }],
    },
    {
      from: "RUNNING",
      to: [
        { state: "SUCCESS", trigger: { responseTime: { gt: 0, lt: 5000 }, errorCode: 200 } },
        { state: "ERROR", trigger: { errorCode: { gt: 400, lt: 599 } } },
      ],
    },
    {
      from: "ERROR",
      to: [{ state: "IDLE", trigger: { url: { startsWith: "https://" } } }],
    },
    {
      from: "SUCCESS",
      to: [{ state: "IDLE", trigger: { url: { startsWith: "https://" } } }],
    },
  ])
  .core()
  .actions({})
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
      let oldState = ""
      let newState = ""

      particle.onTransition((prevState, nextState) => {
        oldState = prevState
        newState = nextState
      })
      particle.update({ url: "https://api.example.com", responseTime: 2000, errorCode: 0 })

      await Bun.sleep(10)

      expect(oldState).toBe("IDLE")
      expect(newState).toBe("RUNNING")
    })

    test("Подписка не должна срабатыват при переходе в то же состояние", () => {
      let callbackCalled = false

      particle.onTransition(() => (callbackCalled = true))

      particle.update({ url: "https://api.example.com", responseTime: 2000, errorCode: 0 })

      expect(callbackCalled).toBe(false)
    })
  })

  describe("Множественные подписки", () => {
    test("Поддержка нескольких подписок", async () => {
      let firstCallbackCalled = false
      let secondCallbackCalled = false

      particle.onTransition(() => (firstCallbackCalled = true))
      particle.onTransition(() => (secondCallbackCalled = true))

      particle.update({ errorCode: 500 })
      await Bun.sleep(10)
      expect(firstCallbackCalled).toBe(true)
      expect(secondCallbackCalled).toBe(true)
    })

    test("Отписка не должна влиять на другие подписки", () => {
      let firstCallbackCalled = false
      let secondCallbackCalled = false

      const unsubscribe = particle.onTransition(() => (firstCallbackCalled = true))

      particle.onTransition(() => (secondCallbackCalled = true))

      unsubscribe()

      particle.update({ url: "https://api.example.com", responseTime: 3000, errorCode: 0 })

      expect(firstCallbackCalled).toBe(false)
      expect(secondCallbackCalled).toBe(true)
    })
  })

  describe("Последовательные изменения", () => {
    test("Корректное отслеживание цепочки изменений состояний", async () => {
      const collapses: { from: string; to: string }[] = []

      particle.onTransition((prevState, nextState) => collapses.push({ from: prevState, to: nextState }))

      // Переход в RUNNING
      particle.update({ url: "https://api.example.com", responseTime: 3000, errorCode: 0 })
      await Bun.sleep(10)
      // Переход в ERROR
      particle.update({ responseTime: 4000, errorCode: 500 })
      await Bun.sleep(10)
      // Переход обратно в IDLE
      particle.update({ url: "https://api.example.com", responseTime: 1000, errorCode: 0 })

      expect(collapses).toEqual([
        { from: "IDLE", to: "RUNNING" },
        { from: "RUNNING", to: "ERROR" },
        { from: "ERROR", to: "IDLE" },
      ])
    })
  })
})
