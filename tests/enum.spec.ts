import {MetaFor} from "@metafor/space"
import {describe, expect, test} from "bun:test"


describe("Enum тип", () => {
  test("создание enum типа", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({
        status: t.enum("active", "inactive", "pending")({title: "Статус", nullable: true, default: "inactive"}),
      }))
      .core().reactions([]).states("INITIAL", "FINAL").transitions("INITIAL", [
        {
          in: "INITIAL",
          to: [{state: "FINAL", when: {status: "active"}}],
        },
      ])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    expect(meta.context.status).toBe("inactive")
  })

  test("проверка перехода по enum значению", async () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({
        status: t.enum("active", "inactive")({default: "inactive"}),
      }))
      .core().reactions([]).states("INITIAL", "ACTIVE").transitions("INITIAL", [
        {
          in: "INITIAL",
          to: [{state: "ACTIVE", when: {status: "active"}}],
        },
      ])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({status: "active"})
    expect(meta.state).toBe("ACTIVE")
  })

  test("сложные условия enum", async () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({
        status: t.enum("active", "inactive", "pending")({default: "pending"}),
      }))
      .core(({update}) => ({
        example: async () => {
          update({status: "inactive"})
        },
      }))
      .reactions([])
      .states("INITIAL", "ACTIVE", "INACTIVE")
      .transitions("INITIAL", [
        {
          in: "INITIAL",
          to: [{state: "ACTIVE", when: {status: {oneOf: ["active", "pending"]}}}],
        },
        {
          in: "ACTIVE",
          to: [{state: "INACTIVE", when: {status: "inactive"}}],
        },
      ])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({status: "active"})
    expect(meta.state).toBe("ACTIVE")

    meta.update({status: "inactive"})
    expect(meta.state).toBe("INACTIVE")
  })

  test("числовой enum тип", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({
        status: t.enum(1, 2, 3)({title: "Статус", nullable: true, default: 1}),
      }))
      .core().reactions([]).states("INITIAL", "FINAL").transitions("INITIAL", [])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    expect(meta.context.status).toBe(1)
  })

  test("проверка перехода по числовому enum значению", async () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({
        status: t.enum(1, 2)({default: 1}),
      }))
      .core().reactions([]).states("INITIAL", "ACTIVE").transitions("INITIAL", [
        {
          in: "INITIAL",
          to: [{state: "ACTIVE", when: {status: 2}}],
        },
      ])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({status: 2})
    expect(meta.state).toBe("ACTIVE")
  })
})
