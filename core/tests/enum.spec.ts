import { MetaFor } from "@metafor/space"
import { describe, expect, test } from "bun:test"

describe("Enum тип", () => {
  test("создание enum типа", () => {
    const meta = MetaFor("test-enum")
      .states("INITIAL", "FINAL")
      .context((t) => ({
        status: t.enum("active", "inactive", "pending")({ title: "Статус", nullable: true, default: "inactive" }),
      }))
      .core()
      .transitions([
        {
          from: "INITIAL",
          to: [{ state: "FINAL", when: { status: "active" } }],
        },
      ])
      .create({ state: "INITIAL" })

    expect(meta.context.status).toBe("inactive")
  })

  test("проверка перехода по enum значению", async () => {
    const meta = MetaFor("test-enum")
      .states("INITIAL", "ACTIVE")
      .context((t) => ({
        status: t.enum("active", "inactive")({ default: "inactive" }),
      }))
      .core()
      .transitions([
        {
          from: "INITIAL",
          to: [{ state: "ACTIVE", when: { status: "active" } }],
        },
      ])
      .create({ state: "INITIAL" })

    meta.update({ status: "active" })
    expect(meta.state).toBe("ACTIVE")
  })

  test("сложные условия enum условия", async () => {
    const meta = MetaFor("test-enum")
      .states("INITIAL", "ACTIVE", "INACTIVE")
      .context((t) => ({
        status: t.enum("active", "inactive", "pending")({ default: "pending" }),
      }))
      .core(({ update }) => ({
        example: async () => {
          update({ status: "inactive" })
        },
      }))
      .transitions([
        {
          from: "INITIAL",
          to: [{ state: "ACTIVE", when: { status: { oneOf: ["active", "pending"] } } }],
        },
        {
          from: "ACTIVE",
          to: [{ state: "INACTIVE", when: { status: "inactive" } }],
        },
      ])
      .create({ state: "INITIAL" })

    meta.update({ status: "active" })
    expect(meta.state).toBe("ACTIVE")

    meta.update({ status: "inactive" })
    expect(meta.state).toBe("INACTIVE")
  })

  test("числовой enum тип", () => {
    const meta = MetaFor("test-enum")
      .states("INITIAL", "FINAL")
      .context((t) => ({
        status: t.enum(1, 2, 3)({ title: "Статус", nullable: true, default: 1 }),
      }))
      .core()
      .transitions([])
      .create({ state: "INITIAL" })

    expect(meta.context.status).toBe(1)
  })

  test("проверка перехода по числовому enum значению", async () => {
    const meta = MetaFor("test-enum")
      .states("INITIAL", "ACTIVE")
      .context((t) => ({
        status: t.enum(1, 2)({ default: 1 }),
      }))
      .core()
      .transitions([
        {
          from: "INITIAL",
          to: [{ state: "ACTIVE", when: { status: 2 } }],
        },
      ])
      .create({ state: "INITIAL" })

    meta.update({ status: 2 })
    expect(meta.state).toBe("ACTIVE")
  })

  test("смешанный enum тип", () => {
    const meta = MetaFor("test-enum")
      .states("INITIAL", "FINAL")
      .context((t) => ({
        status: t.enum("active", "inactive")({ title: "Статус", default: "active" }),
      }))
      .core()
      .transitions([])
      .create({ state: "INITIAL" })

    expect(meta.context.status).toBe("active")
  })
})
