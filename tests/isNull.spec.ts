//@ts-nocheck
import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"


describe("null условие перехода", () => {
  test("Должен выполнить переход когда параметр меняется с числа на null и условие ожидает null", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({
        size: t.number({nullable: true, default: 0})
      }))
      .core()
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .transitions("ОЖИДАНИЕ", [
        {
          in: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: null}}]
        }
      ])
      .reactions([])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>
    meta.update({size: null})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Значение не nullable а триггер ожидает null", () => { // TODO: (вывод предупреждения валидатора)
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({
        size: t.number({nullable: false, default: 0}),
        name: t.string({nullable: false, default: ""}),
        active: t.boolean({nullable: false, default: false}),
        status: t.enum("active", "inactive")({nullable: false, default: "active"}),
      }))
      .core()
      .states("ОЖИДАНИЕ", "число", "строка", "булево")
      .transitions("ОЖИДАНИЕ", [
        {
          in: "ОЖИДАНИЕ",
          to: [
            {state: "число", when: {size: null}},
            {state: "строка", when: {name: null}},
            {state: "булево", when: {active: null}},
          ]
        }
      ]).reactions([])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({size: null})
    expect(meta.state, "не должен обновлять на null если не nullable").toBe("ОЖИДАНИЕ")
    // expect(meta.context.size).toBe(0) // TODO: проверять контекстное значение на тип

    meta.update({name: null})
    expect(meta.state, "не должен обновлять на null если не nullable").toBe("ОЖИДАНИЕ")

    meta.update({active: null})
    expect(meta.state, "не должен обновлять на null если не nullable").toBe("ОЖИДАНИЕ")

    meta.update({status: null})
    expect(meta.state, "не должен обновлять на null если не nullable").toBe("ОЖИДАНИЕ")
  })

  test("Должен выполнить переход когда строка null и триггер ожидает null", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({name: t.string({nullable: true})}))
      .core()
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .transitions("ОЖИДАНИЕ", [
        {
          in: "ОЖИДАНИЕ", to: [{state: "ДОБАВИТЬ", when: {name: null}}]
        }
      ]).reactions([])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({name: null})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Должен выполнить переход когда boolean null и триггер ожидает null", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({active: t.boolean({nullable: true})}))
      .core()
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .transitions("ОЖИДАНИЕ", [
        {
          in: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {active: null}}]
        }
      ]).reactions([])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({active: null})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Должен выполнить переход когда enum null и триггер ожидает null", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({
        status: t.enum("active", "inactive")({nullable: true})
      })).core()
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .transitions("ОЖИДАНИЕ", [
        {
          in: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {status: null}}]
        }
      ]).reactions([])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({status: null})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })
})

describe("isNull триггер", () => {
  test("Должен выполнить переход когда значение меняется с null на не-null и соответствует условиям", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({
        size: t.number({nullable: true})
      }))
      .core()
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .transitions("ОЖИДАНИЕ", [
        {
          in: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: {isNull: false, gt: 4}}}],
        },
      ]).reactions([])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({size: 10})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Не должен выполнять переход когда значение null, но триггер требует не-null", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({size: t.number({nullable: true})}))
      .core()
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .transitions("ОЖИДАНИЕ", [
        {
          in: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: {isNull: false, gt: 4}}}],
        },
      ]).reactions([])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    expect(meta.state).toBe("ОЖИДАНИЕ")
  })

  test("Должен выполнить переход когда значение null и триггер ожидает {isNull: true}", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({size: t.number({nullable: true})}))
      .core()
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .transitions("ОЖИДАНИЕ", [
        {
          in: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: {isNull: true}}}]
        }
      ]).reactions([])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({size: null})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Не должен выполнять переход когда значение не-null, но триггер ожидает null", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({
        size: t.number({nullable: true, default: 0})
      }))
      .core()
      .transitions("ОЖИДАНИЕ", [
        {
          in: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: {isNull: true}}}],
        },
      ]).reactions([])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    expect(meta.state).toBe("ОЖИДАНИЕ")
  })

  test("Должен обрабатывать множественные условия с isNull false", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({size: t.number({nullable: true})}))
      .core()
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .transitions("ОЖИДАНИЕ", [
        {
          in: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: {isNull: false, gt: 5, lt: 15}}}],
        },
      ])
      .reactions([])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({size: 10})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Не должен выполнять переход когда одно из множественных условий не выполняется", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({size: t.number({nullable: true})}))
      .core()
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .transitions("ОЖИДАНИЕ", [
        /* FIXME: валидатор не должен пропускать такой триггер */
        {
          in: "ОЖИДАНИЕ",
          to: [{
            state: "ДОБАВИТЬ",
            when: {size: {isNull: false, gt: 5, lt: 15}}
          }]
        },
      ]).reactions([])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    expect(meta.state).toBe("ОЖИДАНИЕ")
  })

  test("Должен обрабатывать обновление значения с не-null на null", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context((t) => ({
        size: t.number({nullable: true, default: 1})
      }))
      .core()
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .transitions("ОЖИДАНИЕ", [
        {
          in: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: {isNull: true}}}]
        }
      ]).reactions([])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({size: null})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })
})
