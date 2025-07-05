import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"
import {messagesFixture} from "../fixtures/broadcast.ts"


describe("update", async () => {
  const tag = Bun.randomUUIDv7()
  const {waitForMessages} = messagesFixture({meta: tag})

  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Meta = MetaFor(tag)
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
    .reactions({
      "": {
        filter: ({patch}) => patch.op === "add",
        action: ({update}) => {
          update({state: "reaction"})
        }
      }
    })
    .states("INITIAL", "action", "core", "core complex", "final", "reaction")
    .transitions("INITIAL", [
      {
        in: "INITIAL",
        action: () => ({state: "action"}),
        to: [{state: "action", when: {state: "action"}}],
      },
      {
        in: "action",
        action: () => ({state: "core", field1: "action complex"}),
        to: [{state: "core", when: {state: "core"}}],
      },
      {
        in: "core",
        action: ({core}) => core.coreMethod(),
        to: [{state: "core complex", when: {field1: "test"}}]
      },
      {
        in: "core complex",
        action: ({core}) => core.complexMethod(),
        to: [{state: "final", when: {field1: "test1", field2: 1}}]
      },
      {
        in: "final",
        to: [{state: "reaction", when: {state: "reaction"}}]
      }
    ])
    .view({})
  const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

  const messages = await waitForMessages()

  test("Сразу после инициализации: add / — снапшот", () => {
    expect(messages[0].patch.op).toBe("add")
    expect(messages[0].patch.path).toBe("/")
  })

  test("После инициализации: replace /context — переход к action", () => {
    expect(messages[1].patch).toMatchObject({
      op: "replace",
      path: "/context",
      value: {state: "action"}
    })
  })

  test("После перехода к action: replace /context — переход к core, field1: action complex", () => {
    expect(messages[2].patch).toMatchObject({
      op: "replace",
      path: "/context",
      value: {state: "core", field1: "action complex"}
    })
  })

  test("После перехода к core: replace /context — обновление field1: test (coreMethod)", () => {
    expect(messages[3].patch).toMatchObject({
      op: "replace",
      path: "/context",
      value: {field1: "test"}
    })
  })

  test("После coreMethod: replace /context — обновление field1: test1, field2: 1 (complexMethod)", () => {
    expect(messages[4].patch).toMatchObject({
      op: "replace",
      path: "/context",
      value: {field1: "test1", field2: 1}
    })
  })

  test("После complexMethod: replace /state — переход в final", () => {
    expect(messages[13].patch).toMatchObject({
      op: "replace",
      path: "/state",
      value: "final"
    })
  })

  test("После ручного update: replace /context — обновление field1: exist, field2: exist", async () => {
    meta.update({field1: "exist", field2: "exist", field3: "not exist"})
    //@ts-ignore
    expect(meta.context.field3).toBeUndefined()
    expect(meta.context).toBeObject({
      field1: "exist",
      field2: "exist",
      state: "core"
    })
    // Ждём появления сообщения
    await Bun.sleep(100)
    // Ожидаем, что следующее сообщение по индексу 14
    expect(messages[14].patch).toMatchObject({
      op: "replace",
      path: "/context",
      value: {field1: "exist", field2: "exist"}
    })
  })

  test("После реакции: replace /context — переход в reaction", async () => {
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
    await Bun.sleep(100)
    expect(meta.context.state).toBe("reaction")
    expect(meta.state).toBe("reaction")
    // Ожидаем, что следующее сообщение по индексу 15
    expect(messages[15].patch).toMatchObject({
      op: "replace",
      path: "/context",
      value: {state: "reaction"}
    })
  })

  test("После реакции: replace /state — подтверждение reaction", async () => {
    await Bun.sleep(100)
    // Ожидаем, что следующее сообщение по индексу 16
    expect(messages[16].patch).toMatchObject({
      op: "replace",
      path: "/state",
      value: "reaction"
    })
  })

})
