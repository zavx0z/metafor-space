import { describe, expect, test } from "bun:test"
import { MetaFor } from "../types"

describe("null триггер", () => {
  test("Должен выполнить переход когда число null и триггер ожидает null", () => {
    const particle = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { size: null } }] }])
      .core()
      .actions({})
      .create({ state: "ОЖИДАНИЕ" })
    particle.update({ size: null })
    expect(particle.state).toBe("ДОБАВИТЬ")
  })

  test("Значение не nullable а триггер ожидает null (вывод предупреждения валидатора)", () => {
    let particle
    const template = MetaFor("NullTest").states("ОЖИДАНИЕ", "ДОБАВИТЬ")

    particle = template
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { size: null } }] }])
      .core()
      .actions({})
      .create({ state: "ОЖИДАНИЕ" })
    particle.update({ size: null })
    // expect(particle.state).toBe("ОЖИДАНИЕ") FIXME: не должен обновлять на null если не nullable

    particle = template
      .context((t) => ({ name: t.string({ nullable: false, default: "" }) }))
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { name: null } }] }])
      .core()
      .actions({})
      .create({ state: "ОЖИДАНИЕ" })
    particle.update({ name: null })
    // expect(particle.state).toBe("ОЖИДАНИЕ") FIXME: не должен обновлять на null если не nullable

    particle = template
      .context((t) => ({ active: t.boolean({ nullable: false, default: false }) }))
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { active: null } }] }])
      .core()
      .actions({})
      .create({ state: "ОЖИДАНИЕ" })
    particle.update({ active: null })
    // expect(particle.state).toBe("ОЖИДАНИЕ") FIXME: не должен обновлять на null если не nullable

    particle = template
      .context((t) => ({ status: t.enum("active", "inactive")({ nullable: false, default: "active" }) }))
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { status: null } }] }])
      .core()
      .actions({})
      .create({ state: "ОЖИДАНИЕ" })
    particle.update({ status: null })
    // expect(particle.state).toBe("ОЖИДАНИЕ") FIXME: не должен обновлять на null если не nullable
  })

  test("Должен выполнить переход когда строка null и триггер ожидает null", () => {
    const particle = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ name: t.string({ nullable: true }) }))
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { name: null } }] }])
      .core()
      .actions({})
      .create({ state: "ОЖИДАНИЕ" })
    particle.update({ name: null })
    expect(particle.state).toBe("ДОБАВИТЬ")
  })

  test("Должен выполнить переход когда boolean null и триггер ожидает null", () => {
    const particle = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ active: t.boolean({ nullable: true }) }))
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { active: null } }] }])
      .core()
      .actions({})
      .create({ state: "ОЖИДАНИЕ" })
    particle.update({ active: null })
    expect(particle.state).toBe("ДОБАВИТЬ")
  })

  test("Должен выполнить переход когда enum null и триггер ожидает null", () => {
    const particle = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ status: t.enum("active", "inactive")({ nullable: true }) }))
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { status: null } }] }])
      .core()
      .actions({})
      .create({ state: "ОЖИДАНИЕ" })
    particle.update({ status: null })
    expect(particle.state).toBe("ДОБАВИТЬ")
  })
})

describe("isNull триггер", () => {
  test("Должен выполнить переход когда значение меняется с null на не-null и соответствует условиям", () => {
    const particle = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
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
      .core()
      .actions({})
      .reactions([])
      .create({
        state: "ОЖИДАНИЕ",
        context: {
          size: null,
        },
        // debug: true
      })

    particle.update({ size: 10 })
    expect(particle.state).toBe("ДОБАВИТЬ")
  })

  test("Не должен выполнять переход когда значение null, но триггер требует не-null", () => {
    const particle = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
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
      .core()
      .actions({})
      .reactions([])
      .create({
        state: "ОЖИДАНИЕ",
        context: {
          size: null,
        },
      })

    expect(particle.state).toBe("ОЖИДАНИЕ")
  })

  test("Должен выполнить переход когда значение null и триггер ожидает {isNull: true}", () => {
    const particle = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { size: { isNull: true } } }] }])
      .core()
      .actions({})
      .reactions([])
      .create({
        state: "ОЖИДАНИЕ",
        context: {},
      })
    particle.update({ size: null })
    expect(particle.state).toBe("ДОБАВИТЬ")
  })

  test("Не должен выполнять переход когда значение не-null, но триггер ожидает null", () => {
    const particle = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
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
      .core()
      .actions({})
      .reactions([])
      .create({
        state: "ОЖИДАНИЕ",
        context: {
          size: 10,
        },
      })

    expect(particle.state).toBe("ОЖИДАНИЕ")
  })

  test("Должен обрабатывать множественные условия с isNull false", () => {
    const particle = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
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
      .core()
      .actions({})
      .reactions([])
      .create({
        state: "ОЖИДАНИЕ",
        context: {},
      })
    particle.update({ size: 10 })
    expect(particle.state).toBe("ДОБАВИТЬ")
  })

  test("Не должен выполнять переход когда одно из множественных условий не выполняется", () => {
    const particle = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .transitions([
        /* FIXME: валидатор не должен пропускать такой триггер */
        { from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { size: { isNull: false, gt: 5, lt: 15 } } }] },
      ])
      .core()
      .actions({})
      .reactions([])
      .create({ state: "ОЖИДАНИЕ", context: { size: 20 } })
    expect(particle.state).toBe("ОЖИДАНИЕ")
  })

  test("Должен обрабатывать обновление значения с не-null на null", () => {
    const particle = MetaFor("NullTest")
      .states("ОЖИДАНИЕ", "ДОБАВИТЬ")
      .context((t) => ({ size: t.number({ nullable: true }) }))
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ДОБАВИТЬ", when: { size: { isNull: true } } }] }])
      .core()
      .actions({})
      .reactions([])
      .create({
        state: "ОЖИДАНИЕ",
        context: { size: 10 },
      })
    particle.update({ size: null })
    expect(particle.state).toBe("ДОБАВИТЬ")
  })
})
