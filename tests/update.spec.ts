import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"
import {messagesFixture} from "../fixtures/broadcast.ts"


describe("update", async () => {
  const {waitForMessages} = messagesFixture()
  const tag = Bun.randomUUIDv7()
  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Meta = MetaFor(tag)
    .states("INITIAL", "action", "core", "core complex", "final", "reaction")
    .context((t) => ({
      field1: t.string({nullable: true}),
      field2: t.number({default: 0}),
      state: t.enum("initial", "action", "core", "reaction")({default: "initial"})
    }))
    .core(({update}) => ({
      coreMethod: () => {
        update({field1: "test"})
      },
      complexMethod: () => {
        update({field1: "test1", field2: 1})
      },
    }))
    .transitions("INITIAL", [
      {
        from: "INITIAL",
        action: ({update}) => update({state: "action"}),
        to: [{state: "action", when: {state: "action"}}],
      },
      {
        from: "action",
        action: ({update}) => update({state: "core", field1: "action complex"}),
        to: [{state: "core", when: {state: "core"}}],
      },
      {
        from: "core",
        action: ({core}) => core.coreMethod(),
        to: [{state: "core complex", when: {field1: "test"}}]
      },
      {
        from: "core complex",
        action: ({core}) => core.complexMethod(),
        to: [{state: "final", when: {field1: "test1", field2: 1}}]
      },
      {
        from: "final",
        to:[{state: "reaction", when: {state: "reaction"}}]
      }
    ]).reactions([
      {
        op: "add",
        action: ({update}) => {
          update({state: "reaction"})
        }
      }
    ]).create({
      onTransition: (prev, current) => {
        // console.log(prev, current)
      }
    })
  const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.context>

  const messages = await waitForMessages()

  expect(messages[0].patch.op, "Первое сообщение о добавлении новой meta").toBe("add")

  test("actionInit в INITIAL", () => {
    expect(messages[1]).toMatchObject({
      meta: {
        tag,
        timestamp: expect.any(Number),
      },
      patch: {
        op: "replace",
        path: "/context",
        value: {state: "action"},
      },
    })
    expect(messages[2].patch.path, "После обновления контекста получаем сообщение об изменении состояния").toBe(
      "/state"
    )
  })

  test("actionDouble в action", () => {
    expect(messages[3]).toMatchObject({
      meta: {
        tag,
        timestamp: expect.any(Number),
      },
      patch: {
        op: "replace",
        path: "/context",
        value: {state: "core", field1: "action complex"},
      },
    })
    expect(messages[4].patch.path, "После обновления контекста получаем сообщение об изменении состояния").toBe(
      "/state"
    )
  })

  test("update должен логировать источник вызова и измененные поля", async () => {
    expect(messages[5], "Проверяем одиночный вызов update из core").toMatchObject({
      meta: {
        tag,
        timestamp: expect.any(Number),
      },
      patch: {
        op: "replace",
        path: "/context",
        value: {field1: "test"},
      },
    })
    expect(messages[6].patch.path, "После обновления контекста получаем сообщение об изменении состояния").toBe(
      "/state"
    )
    expect(messages[7], "Проверяем множественные вызовы update из core").toEqual({
      meta: {
        tag,
        timestamp: expect.any(Number),
      },
      patch: {
        op: "replace",
        path: "/context",
        value: {field1: "test1", field2: 1},
      },
    })
    expect(messages[8].patch.path, "После обновления контекста получаем сообщение об изменении состояния").toBe(
      "/state"
    )
  })
  test("Несуществующие ключи не устанавливаются в контекст (из view может быть потому что не подсвечивает IDE)", () => {
    //@ts-ignore
    meta.update({field1: "exist", field2: "exist", field3: "not exist"})
    //@ts-ignore
    expect(meta.context.field3).toBeUndefined()
    expect(meta.context).toBeObject({
      field1: "exist",
      field2: "exist",
      state: "core"
    })
  })
  test("Обновление из реакции", async () => {
    const channel = new BroadcastChannel('channel')
    expect(meta.state).toBe("final")
    channel.postMessage({
      patch: {
        "path": "/",
        "op": "add",
        "value": {
          "id": "test"
        }
      }
    })
    await Bun.sleep(20)
    expect(meta.context.state).toBe("reaction")
    expect(meta.state).toBe("reaction")
  })
})
