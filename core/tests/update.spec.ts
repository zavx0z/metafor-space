import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"
import {messagesFixture} from "../../fixtures/broadcast"


describe("update", async () => {
  const {waitForMessages} = messagesFixture()
  const tag = Bun.randomUUIDv7()
  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Meta = MetaFor(tag)
    .states("INITIAL", "action", "core", "core complex", "final")
    .context((t) => ({
      field1: t.string({nullable: true}),
      field2: t.number({default: 0}),
      state: t.enum("initial", "action", "core")({default: "initial"})
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
        meta: "",
        func: "unknown",
        target: "action",
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
        meta: "",
        func: "unknown",
        target: "action",
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
        meta: "",
        func: "coreMethod",
        target: "core",
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
        meta: "",
        func: "complexMethod",
        target: "core",
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
  test("Несуществующие ключи не устанавливаются в контекст", () => {
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
})
