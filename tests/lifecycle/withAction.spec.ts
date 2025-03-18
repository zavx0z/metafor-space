import { describe, expect, test } from "bun:test"
import { MetaFor } from "../../index"
import { messagesFixture } from "../fixtures/broadcast"

describe("Инициализация c действием", async () => {
  const {waitForMessages} = messagesFixture()

  const initialState = "INITIAL"
  const initialContext = {value: "initial"}

  const nextContext = {value: "next"}

  const otherState = "OTHER"
  const otherContext = {value: "other"}

  const particle = MetaFor("test-particle")
    .states("INITIAL", "OTHER", "NEXT")
    .context((t) => ({
      value: t.string({ nullable: true }),
    }))
    .transitions([
      {
        from: "INITIAL",
        action: "initial",
        to: [{ state: "NEXT", trigger: { value: nextContext.value } }],
      },
      {
        from: "NEXT",
        action: "next",
        to: [{state: "OTHER", trigger: {value: otherContext.value}}]
      }
    ])
    .core()
    .actions({
      initial: async ({update}) => {
        await Bun.sleep(1000)
        update(nextContext)
      }, // Асинхронное действие - так можно проверить блокировку
      next: async ({update}) => {
        await Bun.sleep(1000)
        update(otherContext)
      } // Асинхронное действие - так можно проверить блокировку
    })
    .reactions([])
    .create({
      state: initialState,
      context: initialContext
    })

  test.todo("Триггеры частицы заблокированы до окончания автопереходов")
  test.todo("Независимо от блокировки, сообщения с изменениями отправляются")
  const block = particle.process // Блокировку до окончания действия можно перехватить сразу после выполнения синхронного конструктора
  const messages = await waitForMessages()

  describe("Присваивание контекста/состояния и отправка snapshot частицы", () => {
    const firstMessage = messages[0]

    test("Тип патча - `add`", () => expect(firstMessage.patch.op, "Патч типа add должен быть при первой инициализации частицы").toBe("add"))
    test("Состояние равно параметру state в create", () => expect(firstMessage.patch.value.state).toBe(initialState))
    test("Контекст равен параметру context в create", () => expect(firstMessage.patch.value.context).toEqual(initialContext))
  })
  describe("Действия с автопереходами", () => {
    describe("Выполнение первого действия и отправка patch'а частицы", () => {
      const secondMessage = messages[1]
      test("Блокировка триггеров", () => expect(block, "Триггеры должны быть заблокированы до выполнения всех действий автоперехода").toBe(true))
      test("Тип патча - `replace`", () => expect(secondMessage.patch.op, "Патч типа replace должен быть при изменениях").toBe("replace"))
    })
    describe("Выполнение второго действия и отправка patch'а частицы", async () => {
      const thirdMessage = messages[2]
      test("Блокировка триггеров", () => expect(block, "Триггеры должны быть заблокированы до выполнения всех действий автоперехода").toBe(true))
      test("Тип патча replace", () => expect(thirdMessage.patch.op, "Патч типа replace должен быть при изменениях").toBe("replace"))
    })
  })
  describe("Атом инициализирован", async () => {
    test("Триггеры разблокированы", () => expect(particle.process, "Триггеры должны быть разблокированы после выполнения всех действий автоперехода").toBe(false))
    test("Состояние не равно параметру state в create", () => expect(particle.state, "Должно быть равно последнему состоянию в collapse (автопереход)").toBe(otherState))
    test("Контекст не равен параметру context в create", () => expect(particle.context, "Должен быть равен контексту в последнем collapse").toEqual(otherContext))
  })
})
