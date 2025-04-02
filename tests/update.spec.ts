import { describe, expect, test } from "bun:test"
import { MetaFor } from "../index"
import { messagesFixture } from "./fixtures/broadcast"

describe("update", async () => {
  const { waitForMessages } = messagesFixture()

  const particle = MetaFor("test")
    .states("INITIAL", "NEXT", "FINAL")
    .context((t) => ({
      field1: t.string({ nullable: true }),
      field2: t.number({ default: 0 }),
    }))
    .transitions([
      {
        from: "INITIAL",
        action: "actionInit",
        to: [{ state: "NEXT", when: { field2: 42 } }],
      },
      {
        from: "NEXT",
        action: "actionDouble",
        to: [{ state: "FINAL", when: { field2: 100, field1: "test" } }],
      },
    ])
    .core(({ update }) => ({
      coreMethod: () => {
        update({ field1: "test" })
      },
      complexMethod: () => {
        update({ field1: "test1", field2: 1 })
      },
    }))
    .actions({
      actionInit: ({ update }) => {
        update({ field2: 42 })
      },
      actionDouble: ({ update }) => {
        update({ field1: "action1", field2: 42 })
      },
    })
    .reactions([])
    .create({ state: "INITIAL" })

  const messages = await waitForMessages()

  expect(messages[0].patch.op, "Первое сообщение о добавлении нового частицы").toBe("add")

  test("actionInit в INITIAL", () => {
    expect(particle.state).toBe("NEXT")
    expect(messages[1]).toMatchObject({
      meta: {
        particle: "test",
        func: "actionInit",
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
    expect(particle.state).toBe("NEXT")
    expect(messages[3]).toMatchObject({
      meta: {
        particle: "test",
        func: "actionDouble",
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
    particle.core.coreMethod()
    await Bun.sleep(10)
    expect(messages[4]).toMatchObject({
      meta: {
        particle: "test",
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
    particle.core.complexMethod()
    await Bun.sleep(10)
    expect(messages[5]).toEqual({
      meta: {
        particle: "test",
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
