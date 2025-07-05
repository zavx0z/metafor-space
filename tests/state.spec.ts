import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"


describe("Корректные переходы состояний при загрузке данных", () => {
  const tag = Bun.randomUUIDv7()
  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Meta = MetaFor(tag)
    .context((t) => ({
      url: t.string({title: "URL", nullable: true, default: "https://api.example.com/data"}),
      responseTime: t.number({title: "Время ответа", nullable: true, default: 0}),
      code: t.number({title: "Код ошибки", nullable: true, default: 0}),
    }))
    .core().reactions([]).states("IDLE", "LOADING", "SUCCESS", "ERROR").transitions("IDLE", [
      {
        in: "IDLE",
        to: {
          "LOADING": {url: {startsWith: "https://"}, responseTime: {gt: 0, lt: 5000}}
        }
      },
      {
        in: "LOADING",
        to: {
          "SUCCESS": {responseTime: {gt: 0, lt: 5000}, code: 200},
          "ERROR": {code: {gt: 400, lt: 599}}
        }
      },
      {
        in: "ERROR",
        to: {
          "LOADING": {responseTime: {gt: 0, lt: 5000}, code: {gt: 400, lt: 599}}
        }
      },
      {
        in: "SUCCESS",
        to: {
          "IDLE": {url: {include: "complete"}}
        }
      },
    ])
      .view({})
  const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

  describe("Инициализация и начальные состояния", () => {
    test("Начальное состояние должно быть IDLE", () => {
      expect(meta.state).toBe("IDLE")
    })
  })

  describe("Корректные переходы состояний", () => {
    test("Переход из IDLE в LOADING", () => {
      meta.update({url: "https://api.example.com/data", responseTime: 3000, code: 0})
      expect(meta.state).toBe("LOADING")
    })

    test("Переход из LOADING в SUCCESS", () => {
      meta.update({responseTime: 2500, code: 200})
      expect(meta.state).toBe("SUCCESS")
    })

    test("Переход из SUCCESS в IDLE", () => {
      meta.update({url: "https://api.example.com/data/complete"})
      expect(meta.state).toBe("IDLE")
    })
    test("Переход из IDLE в LOADING", () => {
      meta.update({url: "https://api.example.com/data", responseTime: 3000, code: 0})
      expect(meta.state).toBe("LOADING")
    })
    test("Переход из LOADING в ERROR при ошибке", () => {
      meta.update({responseTime: 4500, code: 500})
      expect(meta.state).toBe("ERROR")
    })

    test("Переход из ERROR в LOADING при повторной попытке", () => {
      meta.update({url: "https://api.example.com/data", responseTime: 4500, code: 500})
      expect(meta.state).toBe("LOADING")
    })

    test("Переход из LOADING в SUCCESS после исправления ошибки", () => {
      meta.update({responseTime: 2000, code: 200})
      expect(meta.state).toBe("SUCCESS")
    })
  })
})
