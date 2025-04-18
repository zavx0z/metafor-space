import { describe, expect, test } from "bun:test"
import { MetaFor } from "@metafor/space"

describe("null триггер", () => {
  test("Должен выполнить переход когда число null и триггер ожидает null", () => {
    const meta = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .core()
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { size: null } }] }])
      .create({ state: "ОЖИДАНИЕ" })
    meta.update({ size: null })
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Значение не nullable а триггер ожидает null (вывод предупреждения валидатора)", () => {
    let meta
    const template = MetaFor("NullTest").states("ОЖИДАНИЕ", "ДОБАВИТЬ")

    meta = template
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .core()
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { size: null } }] }])
      .create({ state: "ОЖИДАНИЕ" })
    meta.update({ size: null })
    // expect(particle.state).toBe("ОЖИДАНИЕ") FIXME: не должен обновлять на null если не nullable

    meta = template
      .context((t) => ({ name: t.string({ nullable: false, default: "" }) }))
      .core()
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { name: null } }] }])
      .create({ state: "ОЖИДАНИЕ" })
    meta.update({ name: null })
    // expect(particle.state).toBe("ОЖИДАНИЕ") FIXME: не должен обновлять на null если не nullable

    meta = template
      .context((t) => ({ active: t.boolean({ nullable: false, default: false }) }))
      .core()
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { active: null } }] }])
      .create({ state: "ОЖИДАНИЕ" })
    meta.update({ active: null })
    // expect(particle.state).toBe("ОЖИДАНИЕ") FIXME: не должен обновлять на null если не nullable

    meta = template
      .context((t) => ({ status: t.enum("active", "inactive")({ nullable: false, default: "active" }) }))
      .core()
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { status: null } }] }])
      .create({ state: "ОЖИДАНИЕ" })
    meta.update({ status: null })
    // expect(meta.state).toBe("ОЖИДАНИЕ") FIXME: не должен обновлять на null если не nullable
  })

  test("Должен выполнить переход когда строка null и триггер ожидает null", () => {
    const meta = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ name: t.string({ nullable: true }) }))
      .core()
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { name: null } }] }])
      .create({ state: "ОЖИДАНИЕ" })
    meta.update({ name: null })
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Должен выполнить переход когда boolean null и триггер ожидает null", () => {
    const meta = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ active: t.boolean({ nullable: true }) }))
      .core()
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { active: null } }] }])
      .create({ state: "ОЖИДАНИЕ" })
    meta.update({ active: null })
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Должен выполнить переход когда enum null и триггер ожидает null", () => {
    const meta = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ status: t.enum("active", "inactive")({ nullable: true }) }))
      .core()
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { status: null } }] }])
      .create({ state: "ОЖИДАНИЕ" })
    meta.update({ status: null })
    expect(meta.state).toBe("ДОБАВИТЬ")
  })
})

describe("isNull триггер", () => {
  test("Должен выполнить переход когда значение меняется с null на не-null и соответствует условиям", () => {
    const meta = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [
            {
              state: "ДОБАВИТЬ",
              when: { size: { isNull: false, gt: 4 } },
            },
          ],
        },
      ])
      .create({
        state: "ОЖИДАНИЕ",
        context: {
          size: null,
        },
        // debug: true
      })

    meta.update({ size: 10 })
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Не должен выполнять переход когда значение null, но триггер требует не-null", () => {
    const meta = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [
            {
              state: "ДОБАВИТЬ",
              when: {
                size: { isNull: false, gt: 4 },
              },
            },
          ],
        },
      ])
      .create({
        state: "ОЖИДАНИЕ",
        context: {
          size: null,
        },
      })

    expect(meta.state).toBe("ОЖИДАНИЕ")
  })

  test("Должен выполнить переход когда значение null и триггер ожидает {isNull: true}", () => {
    const meta = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .core()
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { size: { isNull: true } } }] }])
      .create({
        state: "ОЖИДАНИЕ",
        context: {},
      })
    meta.update({ size: null })
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Не должен выполнять переход когда значение не-null, но триггер ожидает null", () => {
    const meta = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [
            {
              state: "ДОБАВИТЬ",
              when: {
                size: { isNull: true },
              },
            },
          ],
        },
      ])
      .create({
        state: "ОЖИДАНИЕ",
        context: {
          size: 10,
        },
      })

    expect(meta.state).toBe("ОЖИДАНИЕ")
  })

  test("Должен обрабатывать множественные условия с isNull false", () => {
    const meta = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .core()
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [
            {
              state: "ДОБАВИТЬ",
              when: {
                size: { isNull: false, gt: 5, lt: 15 },
              },
            },
          ],
        },
      ])
      .create({
        state: "ОЖИДАНИЕ",
        context: {},
      })
    meta.update({ size: 10 })
    expect(meta.state).toBe("ДОБАВИТЬ")
  })

  test("Не должен выполнять переход когда одно из множественных условий не выполняется", () => {
    const meta = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .core()
      .transitions([
        /* FIXME: валидатор не должен пропускать такой триггер */
        { from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { size: { isNull: false, gt: 5, lt: 15 } } }] },
      ])
      .create({ state: "ОЖИДАНИЕ", context: { size: 20 } })
    expect(meta.state).toBe("ОЖИДАНИЕ")
  })

  test("Должен обрабатывать обновление значения с не-null на null", () => {
    const meta = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .core()
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { size: { isNull: true } } }] }])
      .create({
        state: "ОЖИДАНИЕ",
        context: { size: 10 },
      })
    meta.update({ size: null })
    expect(meta.state).toBe("ДОБАВИТЬ")
  })
})
