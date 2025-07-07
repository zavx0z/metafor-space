import { describe, it, expect } from "bun:test"
import { MetaFor } from "./metafor"

describe("Новый API с state", () => {
  it("работает с пустым stateConfig", () => {
    const { context, update } = MetaFor("user")
      .context((types) => ({
        name: types.string.required({ default: "Гость" }),
        age: types.number.optional(),
      }))
      .states({})

    expect(context.name, 'Поле name должно быть "Гость" по умолчанию').toBe("Гость")
    expect(context.age, "Поле age должно быть null по умолчанию").toBe(null)

    update({ name: "Иван", age: 25 })
    expect(context.name, 'Поле name должно обновиться на "Иван"').toBe("Иван")
    expect(context.age, "Поле age должно обновиться на 25").toBe(25)
  })

  it("работает с stateConfig", () => {
    const { context, update } = MetaFor("user")
      .context((types) => ({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("idle", "loading", "success", "error").required({ default: "idle" }),
      }))
      .states({
        idle: {
          process: {
            action: () => {},
            error: () => {},
          },
          to: {
            loading: {},
          },
        },
        loading: {
          to: {
            success: {},
            error: {},
          },
        },
        success: {
          to: {
            idle: {},
          },
        },
        error: {
          process: {
            action: () => {},
            error: () => {},
            success: () => {},
          },
          to: {
            idle: {},
          },
        },
      })
    expect(context.name, 'Поле name должно быть "Гость" по умолчанию').toBe("Гость")
    expect(context.status, 'Поле status должно быть "idle" по умолчанию').toBe("idle")

    update({ name: "Пользователь", status: "loading" })
    expect(context.name, 'Поле name должно обновиться на "Пользователь"').toBe("Пользователь")
    expect(context.status, 'Поле status должно обновиться на "loading"').toBe("loading")
  })

  it("поддерживает onUpdate", () => {
    const { update, onUpdate } = MetaFor("user")
      .context((types) => ({
        name: types.string.required({ default: "Гость" }),
      }))
      .states({})

    let patches: any[] = []
    onUpdate((p: any[]) => {
      patches = p
    })

    update({ name: "Новое имя" })
    expect(patches.length, "Должен быть один патч").toBe(1)
    expect(patches[0].op, "op должен быть 'replace'").toBe("replace")
    expect(patches[0].path, "path должен быть '/name'").toBe("/name")
    expect(patches[0].value, "value должен быть 'Новое имя'").toBe("Новое имя")
  })

  it("типизация и автодополнение ключей stateConfig через MetaFor.stateConfig", () => {
    const { stateConfig } = MetaFor("user")
      .context((types) => ({
        status: types.enum("ожидание", "процесс").required({ default: "ожидание" }),
      }))
      .states({
        ожидание: {
          to: { процесс: {} },
        },
        процесс: {
          to: { ожидание: {} },
        },
      })
    // @ts-expect-error
    stateConfig["ошибка"]
    // Проверяем, что допустимые ключи доступны
    expect(Object.keys(stateConfig)).toContain("ожидание")
    expect(Object.keys(stateConfig)).toContain("процесс")
  })
})
