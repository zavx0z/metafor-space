import {describe, expect, test} from "bun:test"
import {MetaFor} from "../../types"
import {messagesFixture} from "../fixtures/broadcast"

describe("Инициализация без действия", async () => {
  const {waitForMessages} = messagesFixture()

  const initialState = "INITIAL"
  const initialContext = {value: "initial"}

  const particle = MetaFor("test-particle")
    .states("INITIAL", "OTHER")
    .context((t)=>({
      value: t.string({nullable: true})
    }))
    .transitions([])
    .core()
    .actions({})
    .reactions([]).create({
      state: initialState,
      context: initialContext
    })

  const messages = await waitForMessages(10)

  describe("Присваивание контекста/состояния и отправка snapshot частицы", async () => {
    const message = messages[0]

    test("Тип патча add", () => {
      expect(message.patch.op, "Патч типа add должен быть при первой инициализации частицы").toBe("add")
    })

    test("Состояние равно параметру state в create", () => {
      expect(message.patch.value.state).toBe(initialState)
    })

    test("Контекст равен параметру context в create", () => {
      expect(message.patch.value.context).toEqual(initialContext)
    })
  })

  test("Сообщение единственное", () => {
    expect(messages, "Других сообщений не должно быть").toHaveLength(1)
  })

  describe("Частица инициализирована", async () => {
    test("Состояние равно параметру state в create", () => {
      expect(particle.state).toBe(initialState)
    })

    test("Контекст равен параметру context в create", () => {
      expect(particle.context).toEqual(initialContext)
    })
  })
})
