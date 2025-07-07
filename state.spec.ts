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

  it("работает с stateConfig и условиями переходов", () => {
    const { context, update } = MetaFor("user")
      .context((types) => ({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("idle", "loading", "success", "error").required({ default: "idle" }),
        error: types.string.optional(),
        active: types.boolean.required({ default: false }),
      }))
      .states({
        idle: {
          process: {
            action: ({ context }) => {
              expect(typeof context.name, 'context.name должен быть строкой').toBe('string')
            },
            error: ({ update }) => update({ status: "error" }),
          },
          to: {
            loading: { status: "idle" },
          },
        },
        loading: {
          process: {
            action: ({ context }) => {
              expect(typeof context.status, 'context.status должен быть строкой').toBe('string')
            },
            error: ({ update }) => update({ status: "error" }),
            success: ({ update }) => update({ name: "Успешно обновлено" }),
          },
          to: {
            success: { status: "loading" },
            error: { status: "loading" },
          },
        },
        success: {
          to: {
            idle: { status: "success" },
          },
        },
        error: {
          to: {
            idle: { status: "error" },
          },
        },
      })
    expect(context.name, 'Поле name должно быть "Гость" по умолчанию').toBe("Гость")
    expect(context.status, 'Поле status должно быть "idle" по умолчанию').toBe("idle")

    update({ name: "Пользователь", status: "loading" })
    expect(context.name, 'Поле name должно обновиться на "Пользователь"').toBe("Пользователь")
    expect(context.status, 'Поле status должно обновиться на "loading"').toBe("loading")
  })

  it("поддерживает сложные условия переходов", () => {
    const { context, update } = MetaFor("user")
      .context((types) => ({
        name: types.string.required({ default: "Гость" }),
        error: types.string.optional(),
        active: types.boolean.required({ default: false }),
        age: types.number.optional(),
      }))
      .states({
        "неактивно": {
          to: {
            "активно": { error: null, active: false },
          },
        },
        "активно": {
          to: {
            "неактивно": { error: null, active: true },
          },
        },
      })

    expect(context.active, 'Поле active должно быть false по умолчанию').toBe(false)
    expect(context.error, 'Поле error должно быть null по умолчанию').toBe(null)

    update({ active: true, error: null })
    expect(context.active, 'Поле active должно обновиться на true').toBe(true)
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
          to: { процесс: { status: "ожидание" } },
        },
        процесс: {
          to: { ожидание: { status: "процесс" } },
        },
      })
    // @ts-expect-error
    stateConfig["ошибка"]
    // Проверяем, что допустимые ключи доступны
    expect(Object.keys(stateConfig)).toContain("ожидание")
    expect(Object.keys(stateConfig)).toContain("процесс")
  })

  it("process функции получают update с полной типизацией", () => {
    const { context } = MetaFor("user")
      .context((types) => ({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("idle", "loading", "success", "error").required({ default: "idle" }),
      }))
      .states({
        idle: {
          process: {
            action: ({ context }) => {
              expect(typeof context.name, 'context.name должен быть строкой').toBe('string')
            },
            error: ({ update }) => update({ status: "error" }),
          },
          to: {
            loading: { status: "idle" },
          },
        },
        loading: {
          process: {
            action: ({ context }) => {
              expect(typeof context.status, 'context.status должен быть строкой').toBe('string')
            },
            error: ({ update }) => update({ status: "error" }),
            success: ({ update }) => update({ name: "Успешно обновлено" }),
          },
          to: {
            success: { status: "loading" },
            error: { status: "loading" },
          },
        },
        success: {
          to: {
            idle: { status: "success" },
          },
        },
        error: {
          to: {
            idle: { status: "error" },
          },
        },
      })

    expect(context.status, 'Статус должен быть "idle" по умолчанию').toBe("idle")
    expect(context.name, 'Имя должно быть "Гость" по умолчанию').toBe("Гость")
  })

  it("поддерживает различные типы условий", () => {
    const { context, update } = MetaFor("user")
      .context((types) => ({
        name: types.string.required({ default: "Гость" }),
        age: types.number.optional(),
        isActive: types.boolean.required({ default: false }),
        tags: types.array.optional<string>(),
        status: types.enum("pending", "approved", "rejected").required({ default: "pending" }),
        error: types.string.optional(),
      }))
      .states({
        pending: {
          to: {
            approved: { 
              status: "pending",
              isActive: true,
              age: { null: false, gte: 18 }
            },
            rejected: { 
              status: "pending",
              error: { null: false }
            },
          },
        },
        approved: {
          to: {
            pending: { status: "approved" },
          },
        },
        rejected: {
          to: {
            pending: { status: "rejected" },
          },
        },
      })

    expect(context.status, 'Статус должен быть "pending" по умолчанию').toBe("pending")
    expect(context.isActive, 'isActive должен быть false по умолчанию').toBe(false)

    update({ age: 25, isActive: true })
    expect(context.age, 'Возраст должен обновиться на 25').toBe(25)
    expect(context.isActive, 'isActive должен обновиться на true').toBe(true)
  })

  it("пример использования условий переходов как в документации", () => {
    const { context, update } = MetaFor("user")
      .context((types) => ({
        error: types.string.optional(),
        active: types.boolean.required({ default: false }),
      }))
      .states({
        "неактивно": {
          to: {
            "активно": { error: null, active: false },
          },
        },
        "активно": {
          to: {
            "неактивно": { error: null, active: true },
          },
        },
      })

    expect(context.active, 'Поле active должно быть false по умолчанию').toBe(false)
    expect(context.error, 'Поле error должно быть null по умолчанию').toBe(null)

    // Проверяем, что условия переходов корректно типизированы
    update({ active: true, error: null })
    expect(context.active, 'Поле active должно обновиться на true').toBe(true)
    expect(context.error, 'Поле error должно остаться null').toBe(null)
  })
})
