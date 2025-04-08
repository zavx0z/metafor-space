import { describe, expect, test } from "bun:test"
import { MetaFor } from "@metafor/space"

describe("Пайплайн", () => {
  const particle = MetaFor("manager-progress")
    .states("IDLE", "ACTIVE", "COMPLETE")
    .context((t) => ({
      username: t.string({ title: "Имя пользователя", nullable: true }),
      progress: t.number({ title: "Прогресс", nullable: true }),
    }))
    .transitions([
      {
        from: "IDLE",
        action: "idle",
        to: [{ state: "ACTIVE", when: { username: { include: "user" }, progress: { gt: 0, lt: 50 } } }],
      },
      {
        from: "ACTIVE",
        action: "active",
        to: [{ state: "COMPLETE", when: { progress: { gt: 100 } } }],
      },
    ])
    .core()
    .actions({
      idle: ({ update }) => update({ username: "user123", progress: 20 }),
      active: ({ update }) => update({ progress: 101 }),
    })
    .create({
      description: "Управление прогрессом пользователя",
      state: "IDLE",
      context: {
        username: "",
        progress: 0,
      },
      onTransition: (preview, current) => {
        console.log(preview, current)
      },
    })
  test("Обновление контекста и переход в COMPLETE", () => {
    expect(particle.context).toEqual({ username: "user123", progress: 101 })
    expect(particle.state).toBe("COMPLETE")
  })
})
