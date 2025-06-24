import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"


describe("Пайплайн", () => {
  const tag = Bun.randomUUIDv7()
  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Meta = MetaFor(tag)
    .states("IDLE", "ACTIVE", "COMPLETE")
    .context((t) => ({
      username: t.string({title: "Имя пользователя", nullable: true, default: ""}),
      progress: t.number({title: "Прогресс", nullable: true, default: 0}),
    }))
    .core()
    .transitions("IDLE", [
      {
        in: "IDLE",
        action: ({update}) => update({username: "user123", progress: 20}),
        to: [{state: "ACTIVE", when: {username: {include: "user"}, progress: {gt: 0, lt: 50}}}],
      },
      {
        in: "ACTIVE",
        action: ({update}) => update({progress: 101}),
        to: [{state: "COMPLETE", when: {progress: {gt: 100}}}],
      },
    ]).reactions([])
    .view({})
  const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

  test("Обновление контекста и переход в COMPLETE", () => {
    expect(meta.context).toEqual({username: "user123", progress: 101})
    expect(meta.state).toBe("COMPLETE")
  })
})
