import { describe, expect, test } from "bun:test"
import { MetaFor } from "@metafor/space"
import { messagesFixture } from "../../../fixtures/broadcast"

describe("Инициализация c действием", async () => {
  const {waitForMessages} = messagesFixture()

  const initialState = "INITIAL"
  const initialContext = {value: "initial"}

  const nextContext = {value: "next"}

  const otherState = "OTHER"
  const otherContext = {value: "other"}

  const meta = MetaFor("test-particle")
    .states("INITIAL", "OTHER", "NEXT")
    .context((t) => ({
      value: t.string({ nullable: true }),
    }))
    .core()
    .transitions([
      {
        from: "INITIAL",
        action:  async ({update}) => {
          await Bun.sleep(1000)
          update(nextContext)
        }, // Асинхронное действие - так можно проверить блокировку,
        to: [{ state: "NEXT", when: { value: nextContext.value } }],
      },
      {
        from: "NEXT",
        action:  async ({update}) => {
          await Bun.sleep(1000)
          update(otherContext)
        }, // Асинхронное действие - так можно проверить блокировку,
        to: [{state: "OTHER", when: {value: otherContext.value}}]
      }
    ])
    .create({
      state: initialState,
      context: initialContext
    })

  test.todo("Условия meta заблокированы до окончания автопереходов")
  test.todo("Независимо от блокировки, сообщения с изменениями отправляются")
  const block = meta.process // Блокировку до окончания действия можно перехватить сразу после выполнения синхронного конструктора
  const messages = await waitForMessages()

  describe("Присваивание контекста/состояния и отправка snapshot meta", () => {
    const firstMessage = messages[0]

    test("Тип патча - `add`", () =>
      expect(firstMessage.patch.op, "Патч типа add должен быть при первой инициализации meta").toBe("add"))
    test("Состояние равно параметру state в create", () => expect(firstMessage.patch.value.state).toBe(initialState))
    test("Контекст равен параметру context в create", () =>
      expect(firstMessage.patch.value.context).toEqual(initialContext))
  })
  describe("Действия с автопереходами", () => {
    describe("Выполнение первого действия и отправка patch'а meta", () => {
      const secondMessage = messages[1]
      test("Блокировка условий", () => expect(block, "Условия должны быть заблокированы до выполнения всех действий автоперехода").toBe(true))
      test("Тип патча - `replace`", () => expect(secondMessage.patch.op, "Патч типа replace должен быть при изменениях").toBe("replace"))
    })
    describe("Выполнение второго действия и отправка patch'а meta", async () => {
      const thirdMessage = messages[2]
      test("Блокировка условий", () => expect(block, "Условия должны быть заблокированы до выполнения всех действий автоперехода").toBe(true))
      test("Тип патча replace", () => expect(thirdMessage.patch.op, "Патч типа replace должен быть при изменениях").toBe("replace"))
    })
  })
  describe("meta инициализирован", async () => {
    test("Условия разблокированы", () => expect(meta.process, "Условия должны быть разблокированы после выполнения всех действий автоперехода").toBe(false))
    test("Состояние не равно параметру state в create", () => expect(meta.state, "Должно быть равно последнему состоянию в переходе (автопереход)").toBe(otherState))
    test("Контекст не равен параметру context в create", () => expect(meta.context, "Должен быть равен контексту в последнем переходе").toEqual(otherContext))
  })
})
