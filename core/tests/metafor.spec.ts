import { describe, expect, test } from "bun:test"
import { MetaFor } from "@metafor/space"

describe("Конструктор MetaFor", () => {
  const nickname = "zavx0z"
  const email = "zavx0z@ya.ru"
  const password = "123456"

  const userMeta = MetaFor("user")
    .states("АНОНИМНЫЙ", "РЕГИСТРАЦИЯ", "АВТОРИЗАЦИЯ", "АВТОРИЗОВАН")
    .context((t) => ({
      nickname: t.string({ title: "Имя", nullable: true }),
      email: t.string({ title: "Email", nullable: true }),
      password: t.string({ title: "Пароль", nullable: true }),
    }))
    .transitions([
      {
        from: "АНОНИМНЫЙ",
        to: [{ state: "АВТОРИЗАЦИЯ", when: { email: { isNull: false }, password: { isNull: false } } }],
      },
      {
        from: "АВТОРИЗАЦИЯ",
        action: "login",
        to: [{ state: "АВТОРИЗОВАН", when: { nickname: { isNull: false } } }],
      },
    ])
    .core(()=>({
      password: "123456",
    }))
    .actions({
      login: ({ update }) => update({ nickname }),
    })

  test("view", () =>
    expect(Object.hasOwn(userMeta, "view"), "Функция-конструктор представления должна быть присутствовать").toBe(true))

  test("reactions", () =>
    expect(Object.hasOwn(userMeta, "reactions"), "Функция-конструктор реакций должна быть присутствовать").toBe(true))

  test("create", () =>
    expect(Object.hasOwn(userMeta, "create"), "Функция-конструктор создания должна быть присутствовать").toBe(true))

  test("Инициализация состояния без действия с контекстом который соответствует условию перехода", () => {
    const user = userMeta.create({
      state: "АНОНИМНЫЙ",
      context: { email, password },
    })
    expect(user.context, "Контекст должен быть обновлен").toEqual({ email, nickname, password })
    expect(user.state, "Триггеры должны быть обработаны и состояние должно измениться").toBe("АВТОРИЗОВАН")
  })
})
