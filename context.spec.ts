import { describe, it, expect } from "bun:test"
import { MetaFor } from "./metafor"
import { types } from "./context"

describe("Основная функциональность создания и обновления контекстов", () => {
  it("создаёт контекст с правильными типами и значениями по умолчанию", () => {
    const userContext = MetaFor("user").context((types) => ({
      name: types.string.required({ default: "Гость" }),
      role: types.enum("user", "admin", "moderator").required({ default: "user" }),
      nickname: types.string(),
      bio: types.string.optional(),
      priority: types.enum("low", "medium", "high")(),
      tags: types.array.optional({ default: [] }),
    }))
    expect(userContext.context.name, 'Поле name должно быть "Гость" по умолчанию').toBe("Гость")
    expect(userContext.context.role, 'Поле role должно быть "user" по умолчанию').toBe("user")
    expect(userContext.context.nickname, "Поле nickname должно быть null по умолчанию").toBe(null)
    expect(userContext.context.bio, "Поле bio должно быть null по умолчанию").toBe(null)
    expect(userContext.context.priority, "Поле priority должно быть null по умолчанию").toBe(null)
    expect(userContext.context.tags, "Поле tags должно быть [] по умолчанию").toEqual([])
  })

  it("обновляет только переданные значения, игнорирует undefined", () => {
    const ctx = MetaFor("user").context((types) => ({
      name: types.string.required({ default: "Гость" }),
      nickname: types.string(),
    }))
    ctx.update({ name: "test" })
    expect(ctx.context.name, 'Поле name должно обновиться на "test"').toBe("test")
    ctx.update({ nickname: "nick" })
    expect(ctx.context.nickname, 'Поле nickname должно обновиться на "nick"').toBe("nick")
    ctx.update({ nickname: null })
    expect(ctx.context.nickname, "Поле nickname должно обновиться на null").toBe(null)
    // ctx.update({ name: undefined }) // TS должен ругаться
  })

  it("не допускает undefined для optional полей (TS)", () => {
    const ctx = MetaFor("user").context((types) => ({
      nickname: types.string(),
    }))
    // ctx.update({ nickname: undefined }) // TS должен ругаться
    ctx.update({ nickname: null })
    expect(ctx.context.nickname, "Поле nickname должно быть null после update").toBe(null)
  })

  it("enum допускает только строки и числа", () => {
    // types.enum(true, false)() // TS должен ругаться
    // types.enum({})() // TS должен ругаться
    const ctx = MetaFor("user").context((types) => ({
      role: types.enum("user", "admin")(),
    }))
    expect(ctx.context.role, "Поле role должно быть null по умолчанию").toBe(null)
    ctx.update({ role: "admin" })
    expect(ctx.context.role, 'Поле role должно обновиться на "admin"').toBe("admin")
  })

  it("array допускает только строки, числа или булево", () => {
    // types.array({ default: [{}] }) // TS должен ругаться
    const ctx = MetaFor("user").context((types) => ({
      tags: types.array<string>({ default: ["a", "b"] }),
      numbers: types.array<number>(),
      flags: types.array<boolean>(),
    }))
    expect(ctx.context.tags, 'Поле tags должно быть ["a", "b"] по умолчанию').toEqual(["a", "b"])
    expect(ctx.context.numbers, "Поле numbers должно быть null по умолчанию").toBe(null)
    expect(ctx.context.flags, "Поле flags должно быть null по умолчанию").toBe(null)
  })

  it("корректно работает с разными типами", () => {
    const ctx = MetaFor("complex").context((types) => ({
      title: types.string.required({ default: "Заголовок" }),
      description: types.string(),
      age: types.number.required({ default: 18 }),
      score: types.number(),
      isActive: types.boolean.required({ default: true }),
      isVerified: types.boolean(),
      status: types.enum("draft", "published", "archived").required({ default: "draft" }),
      category: types.enum("tech", "design", "business")(),
      tags: types.array.required<string>({ default: [] }),
      permissions: types.array<number>(),
      flags: types.array<boolean>(),
    }))
    ctx.update({
      title: "Новый заголовок",
      description: "Новое описание",
      age: 25,
      score: 100,
      isActive: false,
      isVerified: true,
      status: "published",
      category: "tech",
      tags: ["typescript", "library"],
      permissions: [1, 2, 3],
      flags: [true, false, true],
    })
    expect(ctx.context.title, 'Поле title должно быть "Новый заголовок"').toBe("Новый заголовок")
    expect(ctx.context.description, 'Поле description должно быть "Новое описание"').toBe("Новое описание")
    expect(ctx.context.age, "Поле age должно быть 25").toBe(25)
    expect(ctx.context.score, "Поле score должно быть 100").toBe(100)
    expect(ctx.context.isActive, "Поле isActive должно быть false").toBe(false)
    expect(ctx.context.isVerified, "Поле isVerified должно быть true").toBe(true)
    expect(ctx.context.status, 'Поле status должно быть "published"').toBe("published")
    expect(ctx.context.category, 'Поле category должно быть "tech"').toBe("tech")
    expect(ctx.context.tags, 'Поле tags должно быть ["typescript", "library"]').toEqual(["typescript", "library"])
    expect(ctx.context.permissions, "Поле permissions должно быть [1, 2, 3]").toEqual([1, 2, 3])
    expect(ctx.context.flags, "Поле flags должно быть [true, false, true]").toEqual([true, false, true])
  })

  describe("Иммутабельность контекста", () => {
    it("запрещает прямое изменение значений контекста", () => {
      const ctx = MetaFor("user").context((types) => ({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      }))
      // ctx.context.name = "other" // будет ошибка линтинга
      // Попытка прямого изменения должна вызывать ошибку
      expect(() => {
        ;(ctx.context as any).name = "Новое имя"
      }, "Должна быть ошибка при прямом изменении поля name").toThrow("Прямое изменение контекста запрещено")

      expect(() => {
        ;(ctx.context as any).status = "process"
      }, "Должна быть ошибка при прямом изменении поля status").toThrow("Прямое изменение контекста запрещено")

      expect(() => {
        ;(ctx.context as any).newField = "значение"
      }, "Должна быть ошибка при прямом добавлении нового поля").toThrow("Прямое изменение контекста запрещено")
    })

    it("запрещает удаление свойств контекста", () => {
      const ctx = MetaFor("user").context((types) => ({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      }))

      // Попытка удаления свойства должна вызывать ошибку
      expect(() => {
        delete (ctx.context as any).name
      }, "Должна быть ошибка при удалении поля name").toThrow("Удаление свойств контекста запрещено")

      expect(() => {
        delete (ctx.context as any).status
      }, "Должна быть ошибка при удалении поля status").toThrow("Удаление свойств контекста запрещено")
    })

    it("позволяет читать значения контекста", () => {
      const ctx = MetaFor("user").context((types) => ({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      }))

      // Чтение значений должно работать
      expect(ctx.context.name, 'Поле name должно быть "Гость"').toBe("Гость")
      expect(ctx.context.status, 'Поле status должно быть "start"').toBe("start")
    })

    it("обновление через update() работает корректно", () => {
      const ctx = MetaFor("user").context((types) => ({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      }))

      // Обновление через update() должно работать
      ctx.update({ name: "Новое имя", status: "process" })
      expect(ctx.context.name, 'Поле name должно обновиться на "Новое имя"').toBe("Новое имя")
      expect(ctx.context.status, 'Поле status должно обновиться на "process"').toBe("process")
    })

    it("контекст остается иммутабельным после обновления", () => {
      const ctx = MetaFor("user").context((types) => ({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      }))

      ctx.update({ name: "Новое имя" })

      // После обновления прямое изменение все еще должно быть запрещено
      expect(() => {
        ;(ctx.context as any).name = "Другое имя"
      }, "Должна быть ошибка при прямом изменении поля name после update").toThrow(
        "Прямое изменение контекста запрещено"
      )

      expect(() => {
        ;(ctx.context as any).status = "end"
      }, "Должна быть ошибка при прямом изменении поля status после update").toThrow(
        "Прямое изменение контекста запрещено"
      )
    })
  })
})

describe("Примеры использования (документация)", () => {
  it("MetaFor: создание и обновление userContext", () => {
    const schema = {
      name: types.string.required({ default: "Гость" }),
      age: types.number.optional(),
      isActive: types.boolean.required({ default: true }),
      role: types.enum("user", "admin", "moderator").required({ default: "user" }),
      tags: types.array.optional(),
    }
    const userContext = MetaFor("user").context(() => schema)
    expect(userContext.context, "userContext должен содержать значения по умолчанию для всех полей").toPlainObjectEqual(
      schema,
      {
        name: "Гость",
        age: null,
        isActive: true,
        role: "user",
        tags: null,
      }
    )

    const updated = userContext.update({ name: "Иван", age: 25 })
    expect(
      updated,
      "После update должны обновиться только переданные поля, остальные остаться прежними"
    ).toPlainObjectEqual(schema, {
      name: "Иван",
      age: 25,
      isActive: true,
      role: "user",
      tags: null,
    })
  })

  it("MetaFor: создание и обновление productContext", () => {
    const schema = {
      id: types.string.required(),
      name: types.string.required({ default: "Новый продукт" }),
      price: types.number.required({ default: 0 }),
      inStock: types.boolean.required({ default: false }),
      category: types.enum("electronics", "clothing", "books").optional(),
      images: types.array.required({ default: [] }),
    }
    const productContext = MetaFor("product").context(() => schema)
    expect(
      productContext.context,
      "productContext должен содержать значения по умолчанию для всех полей"
    ).toPlainObjectEqual(schema, {
      id: "",
      name: "Новый продукт",
      price: 0,
      inStock: false,
      category: null,
      images: [],
    })

    const updated = productContext.update({
      id: "prod-123",
      name: "iPhone 15",
      price: 99999,
      inStock: true,
      category: "electronics",
    })
    expect(
      updated,
      "После update должны обновиться только переданные поля, остальные остаться прежними"
    ).toPlainObjectEqual(schema, {
      id: "prod-123",
      name: "iPhone 15",
      price: 99999,
      inStock: true,
      category: "electronics",
      images: [],
    })
  })

  it("MetaFor: создание и обновление articleContext", () => {
    const schema = {
      title: types.string.required({ default: "Заголовок" }),
      content: types.string.optional(),
      published: types.boolean.required({ default: false }),
      views: types.number.required({ default: 0 }),
    }
    const articleContext = MetaFor("article").context(() => schema)
    expect(
      articleContext.context,
      "articleContext должен содержать значения по умолчанию для всех полей"
    ).toPlainObjectEqual(schema, {
      title: "Заголовок",
      content: null,
      published: false,
      views: 0,
    })

    const updated = articleContext.update({
      title: "Новый заголовок",
      content: "Содержание статьи",
      published: true,
    })
    expect(
      updated,
      "После update должны обновиться только переданные поля, остальные остаться прежними"
    ).toPlainObjectEqual(schema, {
      title: "Новый заголовок",
      content: "Содержание статьи",
      published: true,
      views: 0,
    })
  })
})
