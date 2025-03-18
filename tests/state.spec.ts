import { describe, expect, test } from "bun:test"
import { MetaFor } from "../index.js"

describe("Корректные переходы состояний при загрузке данных", () => {
  const template = MetaFor("Загрузчик данных")
    .states("IDLE", "LOADING", "SUCCESS", "ERROR")
    .context((t) => ({
      url: t.string({ title: "URL", nullable: true }),
      responseTime: t.number({ title: "Время ответа", nullable: true }),
      code: t.number({ title: "Код ошибки", nullable: true }),
    }))
    .transitions([
      {
        from: "IDLE",
        to: [{ state: "LOADING", trigger: { url: { startsWith: "https://" }, responseTime: { gt: 0, lt: 5000 } } }],
      },
      {
        from: "LOADING",
        to: [
          {state: "SUCCESS", trigger: {responseTime: {gt: 0, lt: 5000}, code: 200}},
          {state: "ERROR", trigger: {code: {gt: 400, lt: 599}}}
        ]
      },
      {
        from: "ERROR",
        to: [{state: "LOADING", trigger: {responseTime: {gt: 0, lt: 5000}, code: {gt: 400, lt: 599}}}]
      },
      {
        from: "SUCCESS",
        to: [{state: "IDLE", trigger: {url: {include: "complete"}}}]
      }
    ])
  const particle = template
    .core()
    .actions({})
    .reactions([]).create({
      state: "IDLE",
      context: {url: "https://api.example.com/data", responseTime: 0, code: 0}
    })
  describe("Инициализация и начальные состояния", () => {
    test("Начальное состояние должно быть IDLE", () => {
      expect(particle.state).toBe("IDLE")
    })
  })

  describe("Корректные переходы состояний", () => {
    test("Переход из IDLE в LOADING", () => {
      particle.update({url: "https://api.example.com/data", responseTime: 3000, code: 0})
      expect(particle.state).toBe("LOADING")
    })

    test("Переход из LOADING в SUCCESS", () => {
      particle.update({responseTime: 2500, code: 200})
      expect(particle.state).toBe("SUCCESS")
    })

    test("Переход из SUCCESS в IDLE", () => {
      particle.update({url: "https://api.example.com/data/complete"})
      expect(particle.state).toBe("IDLE")
    })
    test("Переход из IDLE в LOADING", () => {
      particle.update({url: "https://api.example.com/data", responseTime: 3000, code: 0})
      expect(particle.state).toBe("LOADING")
    })
    test("Переход из LOADING в ERROR при ошибке", () => {
      particle.update({responseTime: 4500, code: 500})
      expect(particle.state).toBe("ERROR")
    })

    test("Переход из ERROR в LOADING при повторной попытке", () => {
      particle.update({url: "https://api.example.com/data", responseTime: 4500, code: 500})
      expect(particle.state).toBe("LOADING")
    })

    test("Переход из LOADING в SUCCESS после исправления ошибки", () => {
      particle.update({responseTime: 2000, code: 200})
      expect(particle.state).toBe("SUCCESS")
    })
  })
})
