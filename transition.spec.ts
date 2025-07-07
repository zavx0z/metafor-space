import { describe, it, expect } from "bun:test"
import { MetaFor } from "./metafor"

describe("Условия переходов между состояниями", () => {
  describe("Базовые переходы", () => {
    it("работает с простыми условиями", () => {
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

      update({ active: true, error: null })
      expect(context.active, 'Поле active должно обновиться на true').toBe(true)
      expect(context.error, 'Поле error должно остаться null').toBe(null)
    })

    it("поддерживает переходы с проверкой статуса", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          status: types.enum("idle", "loading", "success", "error").required({ default: "idle" }),
          name: types.string.required({ default: "Гость" }),
        }))
        .states({
          idle: {
            to: {
              loading: { status: "idle" },
            },
          },
          loading: {
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
      update({ status: "loading" })
      expect(context.status, 'Статус должен обновиться на "loading"').toBe("loading")
    })
  })

  describe("Условия для булевых значений", () => {
    it("поддерживает прямое булево значение", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          isActive: types.boolean.required({ default: false }),
          isVerified: types.boolean.optional(),
        }))
        .states({
          inactive: {
            to: {
              active: { isActive: false },
            },
          },
          active: {
            to: {
              inactive: { isActive: true },
            },
          },
        })

      expect(context.isActive, 'isActive должен быть false по умолчанию').toBe(false)
      update({ isActive: true })
      expect(context.isActive, 'isActive должен обновиться на true').toBe(true)
    })

    it("поддерживает проверку на null для optional булевых полей", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          isVerified: types.boolean.optional(),
        }))
        .states({
          unverified: {
            to: {
              verified: { isVerified: null },
            },
          },
          verified: {
            to: {
              unverified: { isVerified: true },
            },
          },
        })

      expect(context.isVerified, 'isVerified должен быть null по умолчанию').toBe(null)
      update({ isVerified: true })
      expect(context.isVerified, 'isVerified должен обновиться на true').toBe(true)
    })

    it("поддерживает объект с условиями для булевых значений", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          isActive: types.boolean.required({ default: false }),
          isVerified: types.boolean.optional(),
        }))
        .states({
          pending: {
            to: {
              active: { 
                isActive: { eq: false },
                isVerified: { isNull: false }
              },
            },
          },
          active: {
            to: {
              pending: { 
                isActive: { eq: true },
                isVerified: { isNull: true }
              },
            },
          },
        })

      expect(context.isActive, 'isActive должен быть false по умолчанию').toBe(false)
      expect(context.isVerified, 'isVerified должен быть null по умолчанию').toBe(null)
    })
  })

  describe("Условия для строк", () => {
    it("поддерживает прямое строковое значение", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          name: types.string.required({ default: "Гость" }),
          email: types.string.optional(),
        }))
        .states({
          guest: {
            to: {
              user: { name: "Гость" },
            },
          },
          user: {
            to: {
              guest: { name: { notEq: "Гость" } },
            },
          },
        })

      expect(context.name, 'name должен быть "Гость" по умолчанию').toBe("Гость")
      update({ name: "Иван" })
      expect(context.name, 'name должен обновиться на "Иван"').toBe("Иван")
    })

    it("поддерживает регулярные выражения", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          email: types.string.optional(),
        }))
        .states({
          invalid: {
            to: {
              valid: { 
                email: { 
                  isNull: false,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                }
              },
            },
          },
          valid: {
            to: {
              invalid: { 
                email: { 
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                }
              },
            },
          },
        })

      expect(context.email, 'email должен быть null по умолчанию').toBe(null)
      update({ email: "test@example.com" })
      expect(context.email, 'email должен обновиться на "test@example.com"').toBe("test@example.com")
    })

    it("поддерживает проверку на null", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          name: types.string.required({ default: "Гость" }),
          email: types.string.optional(),
        }))
        .states({
          anonymous: {
            to: {
              named: { 
                name: { notEq: "Гость" },
                email: null
              },
            },
          },
          named: {
            to: {
              anonymous: { 
                name: "Гость",
                email: { isNull: false }
              },
            },
          },
        })

      expect(context.name, 'name должен быть "Гость" по умолчанию').toBe("Гость")
      expect(context.email, 'email должен быть null по умолчанию').toBe(null)
    })

    it("поддерживает сложные строковые условия", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          username: types.string.optional(),
        }))
        .states({
          invalid: {
            to: {
              valid: { 
                username: {
                  isNull: false,
                  length: { min: 3, max: 20 },
                  pattern: /^[a-zA-Z0-9_]+$/,
                  notInclude: "admin",
                  notStartsWith: "test"
                }
              },
            },
          },
          valid: {
            to: {
              invalid: { 
                username: {
                  length: { min: 1, max: 2 }
                }
              },
            },
          },
        })

      expect(context.username, 'username должен быть null по умолчанию').toBe(null)
      update({ username: "john_doe" })
      expect(context.username, 'username должен обновиться на "john_doe"').toBe("john_doe")
    })
  })

  describe("Условия для чисел", () => {
    it("поддерживает прямое числовое значение", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          age: types.number.optional(),
          score: types.number.required({ default: 0 }),
        }))
        .states({
          young: {
            to: {
              adult: { age: 18 },
            },
          },
          adult: {
            to: {
              young: { age: { lt: 18 } },
            },
          },
        })

      expect(context.age, 'age должен быть null по умолчанию').toBe(null)
      expect(context.score, 'score должен быть 0 по умолчанию').toBe(0)
      update({ age: 25 })
      expect(context.age, 'age должен обновиться на 25').toBe(25)
    })

    it("поддерживает проверку на null", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          age: types.number.optional(),
        }))
        .states({
          unknown: {
            to: {
              known: { age: null },
            },
          },
          known: {
            to: {
              unknown: { age: { isNull: false } },
            },
          },
        })

      expect(context.age, 'age должен быть null по умолчанию').toBe(null)
      update({ age: 30 })
      expect(context.age, 'age должен обновиться на 30').toBe(30)
    })

    it("поддерживает сложные числовые условия", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          age: types.number.optional(),
          score: types.number.required({ default: 0 }),
        }))
        .states({
          beginner: {
            to: {
              intermediate: { 
                age: { isNull: false, gte: 18 },
                score: { gte: 100, lt: 500 }
              },
            },
          },
          intermediate: {
            to: {
              expert: { 
                score: { gte: 500, lt: 1000 }
              },
            },
          },
          expert: {
            to: {
              beginner: { 
                score: { lt: 100 }
              },
            },
          },
        })

      expect(context.age, 'age должен быть null по умолчанию').toBe(null)
      expect(context.score, 'score должен быть 0 по умолчанию').toBe(0)
      update({ age: 25, score: 250 })
      expect(context.age, 'age должен обновиться на 25').toBe(25)
      expect(context.score, 'score должен обновиться на 250').toBe(250)
    })

    it("поддерживает диапазоны чисел", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          rating: types.number.optional(),
        }))
        .states({
          low: {
            to: {
              medium: { rating: { between: [1, 3] } },
            },
          },
          medium: {
            to: {
              high: { rating: { between: [4, 7] } },
            },
          },
          high: {
            to: {
              low: { rating: { between: [8, 10] } },
            },
          },
        })

      expect(context.rating, 'rating должен быть null по умолчанию').toBe(null)
      update({ rating: 5 })
      expect(context.rating, 'rating должен обновиться на 5').toBe(5)
    })
  })

  describe("Условия для enum", () => {
    it("поддерживает прямое enum значение", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          status: types.enum("pending", "approved", "rejected").required({ default: "pending" }),
          role: types.enum("user", "admin", "moderator").optional(),
        }))
        .states({
          pending: {
            to: {
              approved: { status: "pending" },
            },
          },
          approved: {
            to: {
              rejected: { status: "approved" },
            },
          },
          rejected: {
            to: {
              pending: { status: "rejected" },
            },
          },
        })

      expect(context.status, 'status должен быть "pending" по умолчанию').toBe("pending")
      update({ status: "approved" })
      expect(context.status, 'status должен обновиться на "approved"').toBe("approved")
    })

    it("поддерживает проверку на null для optional enum", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          role: types.enum("user", "admin", "moderator").optional(),
        }))
        .states({
          unassigned: {
            to: {
              assigned: { role: null },
            },
          },
          assigned: {
            to: {
              unassigned: { role: { isNull: false } },
            },
          },
        })

      expect(context.role, 'role должен быть null по умолчанию').toBe(null)
      update({ role: "admin" })
      expect(context.role, 'role должен обновиться на "admin"').toBe("admin")
    })

    it("поддерживает сложные enum условия", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          status: types.enum("draft", "review", "published", "archived").required({ default: "draft" }),
        }))
        .states({
          draft: {
            to: {
              review: { status: "draft" },
            },
          },
          review: {
            to: {
              published: { status: "review" },
              draft: { status: { notEq: "published" } },
            },
          },
          published: {
            to: {
              archived: { status: { notEq: "draft" } },
            },
          },
          archived: {
            to: {
              draft: { status: "archived" },
            },
          },
        })

      expect(context.status, 'status должен быть "draft" по умолчанию').toBe("draft")
      update({ status: "review" })
      expect(context.status, 'status должен обновиться на "review"').toBe("review")
    })
  })

  describe("Условия для массивов", () => {
    it("поддерживает прямое значение массива", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          tags: types.array.optional<string>(),
          permissions: types.array.required<number>({ default: [] }),
        }))
        .states({
          empty: {
            to: {
              tagged: { tags: [] },
            },
          },
          tagged: {
            to: {
              empty: { tags: { isNull: false, isEmpty: false } },
            },
          },
        })

      expect(context.tags, 'tags должен быть null по умолчанию').toBe(null)
      expect(context.permissions, 'permissions должен быть [] по умолчанию').toEqual([])
      update({ tags: ["typescript", "react"] })
      expect(context.tags, 'tags должен обновиться на ["typescript", "react"]').toEqual(["typescript", "react"])
    })

    it("поддерживает проверку на null", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          tags: types.array.optional<string>(),
        }))
        .states({
          untagged: {
            to: {
              tagged: { tags: null },
            },
          },
          tagged: {
            to: {
              untagged: { tags: { isNull: false } },
            },
          },
        })

      expect(context.tags, 'tags должен быть null по умолчанию').toBe(null)
      update({ tags: ["javascript"] })
      expect(context.tags, 'tags должен обновиться на ["javascript"]').toEqual(["javascript"])
    })

    it("поддерживает сложные условия для массивов", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          tags: types.array.optional<string>(),
          scores: types.array.required<number>({ default: [] }),
        }))
        .states({
          beginner: {
            to: {
              intermediate: { 
                tags: { 
                  isNull: false,
                  length: { min: 1, max: 5 },
                  includes: "javascript"
                },
                scores: {
                  length: { min: 3 },
                  every: (score: number) => score >= 0
                }
              },
            },
          },
          intermediate: {
            to: {
              expert: { 
                tags: { 
                  length: { min: 3 },
                  some: (tag: string) => tag.includes("advanced")
                }
              },
            },
          },
          expert: {
            to: {
              beginner: { 
                tags: { isEmpty: true }
              },
            },
          },
        })

      expect(context.tags, 'tags должен быть null по умолчанию').toBe(null)
      expect(context.scores, 'scores должен быть [] по умолчанию').toEqual([])
      update({ tags: ["javascript", "typescript"], scores: [85, 90, 95] })
      expect(context.tags, 'tags должен обновиться').toEqual(["javascript", "typescript"])
      expect(context.scores, 'scores должен обновиться').toEqual([85, 90, 95])
    })
  })

  describe("Комбинированные условия", () => {
    it("поддерживает множественные условия разных типов", () => {
      const { context, update } = MetaFor("user")
        .context((types) => ({
          name: types.string.required({ default: "Гость" }),
          age: types.number.optional(),
          isActive: types.boolean.required({ default: false }),
          status: types.enum("pending", "approved", "rejected").required({ default: "pending" }),
          tags: types.array.optional<string>(),
        }))
        .states({
          pending: {
            to: {
              approved: { 
                name: { notEq: "Гость" },
                age: { isNull: false, gte: 18 },
                isActive: true,
                status: "pending",
                tags: { isNull: false, length: { min: 1 } }
              },
            },
          },
          approved: {
            to: {
              rejected: { 
                status: "approved",
                isActive: false
              },
            },
          },
          rejected: {
            to: {
              pending: { 
                status: "rejected",
                tags: { isEmpty: true }
              },
            },
          },
        })

      expect(context.name, 'name должен быть "Гость" по умолчанию').toBe("Гость")
      expect(context.age, 'age должен быть null по умолчанию').toBe(null)
      expect(context.isActive, 'isActive должен быть false по умолчанию').toBe(false)
      expect(context.status, 'status должен быть "pending" по умолчанию').toBe("pending")
      expect(context.tags, 'tags должен быть null по умолчанию').toBe(null)

      update({ 
        name: "Иван", 
        age: 25, 
        isActive: true, 
        tags: ["developer", "typescript"] 
      })
      
      expect(context.name, 'name должен обновиться на "Иван"').toBe("Иван")
      expect(context.age, 'age должен обновиться на 25').toBe(25)
      expect(context.isActive, 'isActive должен обновиться на true').toBe(true)
      expect(context.tags, 'tags должен обновиться').toEqual(["developer", "typescript"])
    })

    it("поддерживает сложную валидацию формы", () => {
      const { context, update } = MetaFor("form")
        .context((types) => ({
          email: types.string.optional(),
          password: types.string.optional(),
          username: types.string.optional(),
          age: types.number.optional(),
          agreeToTerms: types.boolean.required({ default: false }),
        }))
        .states({
          "не заполнено": {
            to: {
              "заполняется": {
                email: { isNull: false, include: "@" },
                password: { isNull: false, length: { min: 8 } },
                username: { isNull: false, pattern: /^[a-zA-Z0-9_]+$/ }
              },
            },
          },
          "заполняется": {
            to: {
              "валидно": {
                email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
                password: { length: { min: 8, max: 128 } },
                username: { length: { min: 3, max: 20 } },
                age: { gte: 13 },
                agreeToTerms: true
              },
              "не валидно": {
                email: { isNull: false, notInclude: "@" }
              },
            },
          },
          "валидно": {
            to: {
              "заполняется": {
                email: null
              },
            },
          },
          "не валидно": {
            to: {
              "заполняется": {
                email: { include: "@" }
              },
            },
          },
        })

      expect(context.email, 'email должен быть null по умолчанию').toBe(null)
      expect(context.password, 'password должен быть null по умолчанию').toBe(null)
      expect(context.username, 'username должен быть null по умолчанию').toBe(null)
      expect(context.age, 'age должен быть null по умолчанию').toBe(null)
      expect(context.agreeToTerms, 'agreeToTerms должен быть false по умолчанию').toBe(false)

      update({ 
        email: "test@example.com",
        password: "secure pass 123",
        username: "test user",
        age: 25,
        agreeToTerms: true
      })

      expect(context.email, 'email должен обновиться').toBe("test@example.com")
      expect(context.password, 'password должен обновиться').toBe("secure pass 123")
      expect(context.username, 'username должен обновиться').toBe("test user")
      expect(context.age, 'age должен обновиться').toBe(25)
      expect(context.agreeToTerms, 'agreeToTerms должен обновиться').toBe(true)
    })
  })

  describe("Типизация и автодополнение", () => {
    it("обеспечивает правильную типизацию для всех типов условий", () => {
      const { context } = MetaFor("user")
        .context((types) => ({
          name: types.string.required({ default: "Гость" }),
          age: types.number.optional(),
          isActive: types.boolean.required({ default: false }),
          status: types.enum("pending", "approved", "rejected").required({ default: "pending" }),
          tags: types.array.optional<string>(),
        }))
        .states({
          test: {
            to: {
              next: {
                name: { eq: "test" },
                age: { gte: 18 },
                isActive: { eq: true },
                status: "pending",
                tags: { includes: "typescript" }
              },
            },
          },
          next: {
            to: {
              test: {
                name: "test",
                age: 18,
                isActive: true,
                status: "pending",
                tags: ["typescript"]
              },
            },
          },
        })

      // Проверяем, что контекст доступен для чтения
      expect(typeof context.name, 'context.name должен быть строкой').toBe('string')
      expect(typeof context.age === 'number' || context.age === null, 'context.age должен быть number | null').toBe(true)
      expect(typeof context.isActive, 'context.isActive должен быть boolean').toBe('boolean')
      expect(typeof context.status, 'context.status должен быть строкой').toBe('string')
      expect(Array.isArray(context.tags) || context.tags === null, 'context.tags должен быть массивом или null').toBe(true)
    })

    it("проверяет автодополнение ключей состояний", () => {
      const { stateConfig } = MetaFor("user")
        .context((types) => ({
          status: types.enum("idle", "loading", "success").required({ default: "idle" }),
        }))
        .states({
          idle: {
            to: { loading: { status: "idle" } },
          },
          loading: {
            to: { success: { status: "loading" } },
          },
          success: {
            to: { idle: { status: "success" } },
          },
        })

      // @ts-expect-error - несуществующее состояние должно вызывать ошибку TypeScript
      stateConfig["error"]

      // Проверяем, что допустимые ключи доступны
      expect(Object.keys(stateConfig)).toContain("idle")
      expect(Object.keys(stateConfig)).toContain("loading")
      expect(Object.keys(stateConfig)).toContain("success")
    })
  })
}) 