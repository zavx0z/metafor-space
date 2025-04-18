import { describe, expect, test } from "bun:test"
import { MetaFor } from "@metafor/space"
import { messagesFixture } from "../../fixtures/broadcast"

describe("update", async () => {
  const { waitForMessages } = messagesFixture()

  const meta = MetaFor("test")
    .states("INITIAL", "NEXT", "FINAL")
    .context((t) => ({
      field1: t.string({ nullable: true }),
      field2: t.number({ default: 0 }),
    }))
    .core(({ update }) => ({
      coreMethod: () => {
        update({ field1: "test" })
      },
      complexMethod: () => {
        update({ field1: "test1", field2: 1 })
      },
    }))
    .transitions([
      {
        from: "INITIAL",
        action: ({ update }) => update({ field2: 42 }),
        to: [{ state: "NEXT", when: { field2: 42 } }],
      },
      {
        from: "NEXT",
        action: ({ update }) => update({ field1: "action1", field2: 42 }),
        to: [{ state: "FINAL", when: { field2: 100, field1: "test" } }],
      },
    ])
    .create({ state: "INITIAL" })

  const messages = await waitForMessages()

  expect(messages[0].patch.op, "Первое сообщение о добавлении новой meta").toBe("add")

  test("actionInit в INITIAL", () => {
    expect(meta.state).toBe("NEXT")
    expect(messages[1]).toMatchObject({
      meta: {
        meta: "test",
        func: "unknown",
        target: "action",
        timestamp: expect.any(Number),
      },
      patch: {
        op: "replace",
        path: "/context",
        value: { field2: 42 },
      },
    })
    expect(messages[2].patch.path, "После обновления контекста получаем сообщение об изменении состояния").toBe(
      "/state"
    )
  })

  test("actionDouble в NEXT", () => {
    expect(meta.state).toBe("NEXT")
    expect(messages[3]).toMatchObject({
      meta: {
        meta: "test",
        func: "unknown",
        target: "action",
        timestamp: expect.any(Number),
      },
      patch: {
        op: "replace",
        path: "/context",
        value: { field1: "action1" },
      },
    })
  })

  test("update должен логировать источник вызова и измененные поля", async () => {
    // Проверяем одиночный вызов update из core
    meta.core.coreMethod()
    await Bun.sleep(10)
    expect(messages[4]).toMatchObject({
      meta: {
        meta: "test",
        func: "coreMethod",
        target: "core",
        timestamp: expect.any(Number),
      },
      patch: {
        op: "replace",
        path: "/context",
        value: { field1: "test" },
      },
    })

    // Проверяем множественные вызовы update из core
    meta.core.complexMethod()
    await Bun.sleep(10)
    expect(messages[5]).toEqual({
      meta: {
        meta: "test",
        func: "complexMethod",
        target: "core",
        timestamp: expect.any(Number),
      },
      patch: {
        op: "replace",
        path: "/context",
        value: { field1: "test1", field2: 1 },
      },
    })
  })
})
