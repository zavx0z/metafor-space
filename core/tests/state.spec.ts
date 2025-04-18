import { describe, expect, test } from "bun:test"
import { MetaFor } from "@metafor/space"

describe("Корректные переходы состояний при загрузке данных", () => {
  const template = MetaFor("Загрузчик данных")
    .states("IDLE", "LOADING", "SUCCESS", "ERROR")
    .context((t) => ({
      url: t.string({ title: "URL", nullable: true }),
      responseTime: t.number({ title: "Время ответа", nullable: true }),
      code: t.number({ title: "Код ошибки", nullable: true }),
    }))
    .core()
    .transitions([
      {
        from: "IDLE",
        to: [{ state: "LOADING", when: { url: { startsWith: "https://" }, responseTime: { gt: 0, lt: 5000 } } }],
      },
      {
        from: "LOADING",
        to: [
          { state: "SUCCESS", when: { responseTime: { gt: 0, lt: 5000 }, code: 200 } },
          { state: "ERROR", when: { code: { gt: 400, lt: 599 } } },
        ],
      },
      {
        from: "ERROR",
        to: [{ state: "LOADING", when: { responseTime: { gt: 0, lt: 5000 }, code: { gt: 400, lt: 599 } } }],
      },
      {
        from: "SUCCESS",
        to: [{ state: "IDLE", when: { url: { include: "complete" } } }],
      },
    ])
  const meta = template.create({
    state: "IDLE",
    context: { url: "https://api.example.com/data", responseTime: 0, code: 0 },
  })
  describe("Инициализация и начальные состояния", () => {
    test("Начальное состояние должно быть IDLE", () => {
      expect(meta.state).toBe("IDLE")
    })
  })

  describe("Корректные переходы состояний", () => {
    test("Переход из IDLE в LOADING", () => {
      meta.update({ url: "https://api.example.com/data", responseTime: 3000, code: 0 })
      expect(meta.state).toBe("LOADING")
    })

    test("Переход из LOADING в SUCCESS", () => {
      meta.update({ responseTime: 2500, code: 200 })
      expect(meta.state).toBe("SUCCESS")
    })

    test("Переход из SUCCESS в IDLE", () => {
      meta.update({ url: "https://api.example.com/data/complete" })
      expect(meta.state).toBe("IDLE")
    })
    test("Переход из IDLE в LOADING", () => {
      meta.update({ url: "https://api.example.com/data", responseTime: 3000, code: 0 })
      expect(meta.state).toBe("LOADING")
    })
    test("Переход из LOADING в ERROR при ошибке", () => {
      meta.update({ responseTime: 4500, code: 500 })
      expect(meta.state).toBe("ERROR")
    })

    test("Переход из ERROR в LOADING при повторной попытке", () => {
      meta.update({ url: "https://api.example.com/data", responseTime: 4500, code: 500 })
      expect(meta.state).toBe("LOADING")
    })

    test("Переход из LOADING в SUCCESS после исправления ошибки", () => {
      meta.update({ responseTime: 2000, code: 200 })
      expect(meta.state).toBe("SUCCESS")
    })
  })
})
