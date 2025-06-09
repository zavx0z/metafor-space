import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"
import type {Meta} from "../../metafor";

describe("null условие перехода", () => {
  test("Должен выполнить переход когда параметр меняется с числа на null и условие ожидает null", () => {
    document.body.innerHTML = `<metafor-test-1></metafor-test-1>`

    const Meta = MetaFor("test-1")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({
        size: t.number({nullable: true, default: 0})
      }))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: null}}]
        }
      ])
      .create({state: "ОЖИДАНИЕ"})
    const meta = document.querySelector('metafor-test-1') as Meta<typeof Meta.state, typeof Meta.context>
    meta.update({size: null})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Значение не nullable а триггер ожидает null", () => { // TODO: (вывод предупреждения валидатора)
    document.body.innerHTML = `<metafor-test-2></metafor-test-2>`
    const Meta = MetaFor("test-2", {development: true})
      .states("ОЖИДАНИЕ", "число", "строка", "булево")
      .context((t) => ({
        size: t.number({nullable: false, default: 0}),
        name: t.string({nullable: false, default: ""}),
        active: t.boolean({nullable: false, default: false}),
        status: t.enum("active", "inactive")({nullable: false, default: "active"}),
      }))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [
            {state: "число", when: {size: null}},
            {state: "строка", when: {name: null}},
            {state: "булево", when: {active: null}},
          ]
        }
      ])
      .create({state: "ОЖИДАНИЕ"})
    const meta = document.querySelector('metafor-test-2') as Meta<typeof Meta.state, typeof Meta.context>


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
    document.body.innerHTML = `<metafor-test-3></metafor-test-3>`
    const Meta = MetaFor("test-3")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({name: t.string({nullable: true})}))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ", to: [{state: "ДОБАВИТЬ", when: {name: null}}]
        }
      ])
      .create({state: "ОЖИДАНИЕ"})
    const meta = document.querySelector('metafor-test-3') as Meta<typeof Meta.state, typeof Meta.context>

    meta.update({name: null})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Должен выполнить переход когда boolean null и триггер ожидает null", () => {
    document.body.innerHTML = `<metafor-test-4></metafor-test-4>`
    const Meta = MetaFor("test-4")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({active: t.boolean({nullable: true})}))
      .core()
      .transitions([{from: "ОЖИДАНИЕ", to: [{state: "ДОБАВИТЬ", when: {active: null}}]}])
      .create({state: "ОЖИДАНИЕ"})
    const meta = document.querySelector('metafor-test-4') as Meta<typeof Meta.state, typeof Meta.context>

    meta.update({active: null})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Должен выполнить переход когда enum null и триггер ожидает null", () => {
    document.body.innerHTML = `<metafor-test-5></metafor-test-5>`
    const Meta = MetaFor("test-5")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({
        status: t.enum("active", "inactive")({nullable: true})
      }))
      .core()
      .transitions([{from: "ОЖИДАНИЕ", to: [{state: "ДОБАВИТЬ", when: {status: null}}]}])
      .create({state: "ОЖИДАНИЕ"})
    const meta = document.querySelector('metafor-test-5') as Meta<typeof Meta.state, typeof Meta.context>

    meta.update({status: null})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })
})

describe("isNull триггер", () => {
  test("Должен выполнить переход когда значение меняется с null на не-null и соответствует условиям", () => {
    document.body.innerHTML = `<metafor-test-6></metafor-test-6>`
    const Meta = MetaFor("test-6")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({
        size: t.number({nullable: true})
      }))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: {isNull: false, gt: 4}}}],
        },
      ])
      .create({state: "ОЖИДАНИЕ"})
    const meta = document.querySelector('metafor-test-6') as Meta<typeof Meta.state, typeof Meta.context>

    meta.update({size: 10})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Не должен выполнять переход когда значение null, но триггер требует не-null", () => {
    document.body.innerHTML = `<metafor-test-7></metafor-test-7>`
    const Meta = MetaFor("test-7")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({size: t.number({nullable: true})}))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: {isNull: false, gt: 4}}}],
        },
      ])
      .create({state: "ОЖИДАНИЕ"})
    const meta = document.querySelector('metafor-test-7') as Meta<typeof Meta.state, typeof Meta.context>

    expect(meta.state).toBe("ОЖИДАНИЕ")
  })

  test("Должен выполнить переход когда значение null и триггер ожидает {isNull: true}", () => {
    document.body.innerHTML = `<metafor-test-8></metafor-test-8>`
    const Meta = MetaFor("test-8")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({size: t.number({nullable: true})}))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: {isNull: true}}}]
        }
      ])
      .create({state: "ОЖИДАНИЕ"})
    const meta = document.querySelector('metafor-test-8') as Meta<typeof Meta.state, typeof Meta.context>
    meta.update({size: null})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Не должен выполнять переход когда значение не-null, но триггер ожидает null", () => {
    document.body.innerHTML = `<metafor-test-9></metafor-test-9>`
    const Meta = MetaFor("test-9")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({
        size: t.number({nullable: true, default: 0})
      }))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: {isNull: true}}}],
        },
      ])
      .create({state: "ОЖИДАНИЕ"})
    const meta = document.querySelector('metafor-test-9') as Meta<typeof Meta.state, typeof Meta.context>

    expect(meta.state).toBe("ОЖИДАНИЕ")
  })

  test("Должен обрабатывать множественные условия с isNull false", () => {
    document.body.innerHTML = `<metafor-test-10></metafor-test-10>`
    const Meta = MetaFor("test-10")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({size: t.number({nullable: true})}))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: {isNull: false, gt: 5, lt: 15}}}],
        },
      ])
      .create({state: "ОЖИДАНИЕ"})
    const meta = document.querySelector('metafor-test-10') as Meta<typeof Meta.state, typeof Meta.context>
    meta.update({size: 10})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Не должен выполнять переход когда одно из множественных условий не выполняется", () => {
    document.body.innerHTML = `<metafor-test-11></metafor-test-11>`
    const Meta = MetaFor("test-11")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({size: t.number({nullable: true})}))
      .core()
      .transitions([
        /* FIXME: валидатор не должен пропускать такой триггер */
        {
          from: "ОЖИДАНИЕ",
          to: [{
            state: "ДОБАВИТЬ",
            when: {size: {isNull: false, gt: 5, lt: 15}}
          }]
        },
      ])
      .create({state: "ОЖИДАНИЕ"})
    const meta = document.querySelector('metafor-test-11') as Meta<typeof Meta.state, typeof Meta.context>

    expect(meta.state).toBe("ОЖИДАНИЕ")
  })

  test("Должен обрабатывать обновление значения с не-null на null", () => {
    document.body.innerHTML = `<metafor-test-12></metafor-test-12>`

    const Meta = MetaFor("test-12")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({
        size: t.number({nullable: true, default: 1})
      }))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{state: "ДОБАВИТЬ", when: {size: {isNull: true}}}]
        }
      ])
      .create({state: "ОЖИДАНИЕ"})
    const meta = document.querySelector('metafor-test-12') as Meta<typeof Meta.state, typeof Meta.context>

    meta.update({size: null})
    expect(meta.state).toBe("ДОБАВИТЬ")
  })
})
