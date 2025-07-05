import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"
import {messagesFixture} from "../../fixtures/broadcast.ts"


describe("MetaFor: инициализация без действия", async () => {
  const tag = Bun.randomUUIDv7()
  const {waitForMessages} = messagesFixture({meta: tag})

  const initialState = "INITIAL"
  const initialContext = {value: "initial"}

  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Meta = MetaFor(tag)
    .context((t) => ({
      value: t.string({nullable: true, default: initialContext.value})
    }))
    .core()
    .reactions({})
    .states("INITIAL", "OTHER").transitions(initialState, [])
    .view({})
  const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

  const messages = await waitForMessages(10)

  test("[init] Первый патч add содержит полную информацию об акторе", () => {
    expect(messages[0].patch.op).toBe("add")
    expect(messages[0].patch.path).toBe("/")
    expect(messages[0].patch.value.state).toBe(initialState)
    expect(messages[0].patch.value.context).toEqual(initialContext)
  })

  test("[init] Второй патч содержит состояние инициализации", () => {
    expect(messages[1].patch.op).toBe("replace")
    expect(messages[1].patch.path).toBe("/state")
    expect(messages[1].patch.value).toBe(initialState)
  })

  test("[meta] После инициализации meta.state и meta.context соответствуют", () => {
    expect(meta.state).toBe(initialState)
    expect(meta.context).toEqual(initialContext)
  })

  test("[count] Два сообщения: снапшот и установка состояния", () => {
    expect(messages).toHaveLength(2)
  })

  test("[messages] Сырые сообщения фикстуры", () => {
    expect(messages).toEqual([
      {
        meta: {
          tag: expect.any(String),
          index: expect.any(Number),
          timestamp: expect.any(Number),
        },
        patch: {
          path: "/",
          op: "add",
          value: expect.objectContaining({
            id: expect.stringContaining("/"),
            description: "",
            state: "INITIAL",
            states: ["INITIAL", "OTHER"],
            core: {},
            context: {value: "initial"},
            types: {
              value: {
                type: "string",
                nullable: true,
                default: "initial"
              }
            },
            transitions: [],
          }),
        },
      },
      {
        meta: {
          tag: expect.any(String),
          index: expect.any(Number),
          timestamp: expect.any(Number),
        },
        patch: {
          path: "/state",
          op: "replace",
          value: "INITIAL",
        },
      },
    ])
  })
})
