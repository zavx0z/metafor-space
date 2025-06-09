import { MetaFor } from "@metafor/space"
import { describe, expect, test } from "bun:test"

describe("Enum тип", () => {
  test("создание enum типа", () => {
    document.body.innerHTML = `<metafor-test-1></metafor-test-1>`

    const meta = MetaFor("test-1")
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
    document.body.innerHTML = `<metafor-test-2></metafor-test-2>`

    const meta = MetaFor("test-2")
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

  test("сложные условия enum", async () => {
    document.body.innerHTML = `<metafor-test-3></metafor-test-3>`

    const meta = MetaFor("test-3")
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
    document.body.innerHTML = `<metafor-test-4></metafor-test-4>`

    const meta = MetaFor("test-4")
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
    document.body.innerHTML = `<metafor-test-5></metafor-test-5>`

    const meta = MetaFor("test-5")
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
})
