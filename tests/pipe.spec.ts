import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"


describe("Пайплайн", () => {
  const tag = Bun.randomUUIDv7()
  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Meta = MetaFor(tag)
    .context((t) => ({
      username: t.string({title: "Имя пользователя", nullable: true, default: ""}),
      progress: t.number({title: "Прогресс", nullable: true, default: 0}),
    }))
    .core()
    .reactions({})
    .states("IDLE", "ACTIVE", "COMPLETE")
    .transitions("IDLE", {
      "IDLE": {
        action: () => ({username: "user123", progress: 20}),
        to: {"ACTIVE": {username: {include: "user"}, progress: {gt: 0, lt: 50}}},
      },
      "ACTIVE": {
        action: () => ({progress: 101}),
        to: {"COMPLETE": {progress: {gt: 100}}},
      },
    }).view({})
  const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

  test("Обновление контекста и переход в COMPLETE", () => {
    expect(meta.context).toEqual({username: "user123", progress: 101})
    expect(meta.state).toBe("COMPLETE")
  })
})
