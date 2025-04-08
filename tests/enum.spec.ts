import {MetaFor} from "../types"
import {describe, expect, test} from "bun:test"

describe("Enum тип", () => {
  test("создание enum типа", () => {
    const particle = MetaFor("test-enum")
      .states("INITIAL", "FINAL")
      .context((t) => ({
        status: t.enum("active", "inactive", "pending")({ title: "Статус", nullable: true, default: "inactive" }),
      }))
      .transitions([
        {
          from: "INITIAL",
          to: [{ state: "FINAL", when: { status: "active" } }],
        },
      ])
      .core()
      .actions({})
      .create({ state: "INITIAL" })

    expect(particle.context.status).toBe("inactive")
  })

  test("проверка перехода по enum значению", async () => {
    const particle = MetaFor("test-enum")
      .states("INITIAL", "ACTIVE")
      .context((t) => ({
        status: t.enum("active", "inactive")({ default: "inactive" }),
      }))
      .transitions([
        {
          from: "INITIAL",
          to: [{ state: "ACTIVE", when: { status: "active" } }],
        },
      ])
      .core()
      .actions({})
      .create({ state: "INITIAL" })

    particle.update({status: "active"})
    expect(particle.state).toBe("ACTIVE")
  })

  test("сложные условия enum триггера", async () => {
    const particle = MetaFor("test-enum")
      .states("INITIAL", "ACTIVE", "INACTIVE")
      .context((t) => ({
        status: t.enum("active", "inactive", "pending")({ default: "pending" }),
      }))
      .transitions([
        {
          from: "INITIAL",
          to: [{ state: "ACTIVE", when: { status: { oneOf: ["active", "pending"] } } }],
        },
        {
          from: "ACTIVE",
          to: [{state: "INACTIVE", when: {status: "inactive"}}]
        }
      ])
      .core(({update}) => ({
        example: async () => {
          update({status: "inactive"})
        }
      }))
      .actions({
        example: ({update}) => {
          update({status: "active"})
        }
      })
      .reactions([]).create({state: "INITIAL"})

    particle.update({status: "active"})
    expect(particle.state).toBe("ACTIVE")

    particle.update({status: "inactive"})
    expect(particle.state).toBe("INACTIVE")
  })

  test("числовой enum тип", () => {
    const particle = MetaFor("test-enum")
      .states("INITIAL", "FINAL")
      .context((t) => ({
        status: t.enum(1, 2, 3)({ title: "Статус", nullable: true, default: 1 }),
      }))
      .transitions([])
      .core()
      .actions({})
      .create({ state: "INITIAL" })

    expect(particle.context.status).toBe(1)
  })

  test("проверка перехода по числовому enum значению", async () => {
    const particle = MetaFor("test-enum")
      .states("INITIAL", "ACTIVE")
      .context((t) => ({
        status: t.enum(1, 2)({ default: 1 }),
      }))
      .transitions([
        {
          from: "INITIAL",
          to: [{ state: "ACTIVE", when: { status: 2 } }],
        },
      ])
      .core()
      .actions({})
      .create({ state: "INITIAL" })

    particle.update({status: 2})
    expect(particle.state).toBe("ACTIVE")
  })

  test("смешанный enum тип", () => {
    const particle = MetaFor("test-enum")
      .states("INITIAL", "FINAL")
      .context((t) => ({
        status: t.enum("active", "inactive")({ title: "Статус", default: "active" }),
      }))
      .transitions([])
      .core()
      .actions({})
      .create({ state: "INITIAL" })

    expect(particle.context.status).toBe("active")
  })
})
