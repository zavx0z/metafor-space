import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"
import {messagesFixture} from "../../fixtures/broadcast.ts"


describe("Инициализация без действия", async () => {
  const tag = Bun.randomUUIDv7()
  const {waitForMessages} = messagesFixture({meta: tag})

  const initialState = "INITIAL"
  const initialContext = {value: "initial"}
  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Meta = MetaFor(tag)
    .states("INITIAL", "OTHER")
    .context((t) => ({
      value: t.string({nullable: true, default: initialContext.value})
    }))
    .core()
    .transitions(initialState, [])
    .reactions([])
    .view({})
  const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

  const messages = await waitForMessages(10)
  describe("Присваивание контекста/состояния и отправка snapshot meta", async () => {
    const message = messages[0]

    test("Тип патча add", () => {
      expect(message.patch.op, "Патч типа add должен быть при первой инициализации meta").toBe("add")
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

  describe("meta инициализирована", async () => {
    test("Состояние равно параметру state в create", () => {
      expect(meta.state).toBe(initialState)
    })

    test("Контекст равен параметру context в create", () => {
      expect(meta.context).toEqual(initialContext)
    })
  })
  await Bun.sleep(2000)
})
