import { describe, expect, test } from "bun:test"
import { MetaFor } from "../index.js"

const userActor = MetaFor("user")
  .states("АНОНИМНЫЙ", "РЕГИСТРАЦИЯ", "АВТОРИЗАЦИЯ", "АВТОРИЗОВАН")
  .context((t) => ({
    nickname: t.string({ title: "Имя", nullable: true }),
    email: t.string({ title: "Email", nullable: true }),
    password: t.string({ title: "Пароль", nullable: true }),
  }))
  .transitions([
    {
      from: "АНОНИМНЫЙ",
      to: [{ state: "АВТОРИЗАЦИЯ", trigger: { email: { isNull: false }, password: { isNull: false } } }],
    },
    {
      from: "АВТОРИЗАЦИЯ",
      action: "login",
      to: [{ state: "АВТОРИЗОВАН", trigger: { nickname: { isNull: false } } }],
    },
  ])

describe("Инициализация частицы", () => {
  const nickname = "zavx0z"
  const email = "zavx0z@ya.ru"
  const password = "123456"

  test("Инициализация состояния без действия с контекстом который соответствует триггеру", async () => {
    const user = userActor
      .core()
      .actions({
        login: ({ update }) => update({ nickname }),
      })
      .create({
        state: "АНОНИМНЫЙ",
        context: { email, password },
      })
    await Bun.sleep(1000)
    expect(user.context, "Контекст должен быть обновлен").toEqual({ email, nickname, password })
    expect(user.state, "Триггеры должны быть обработаны и состояние должно измениться").toBe("АВТОРИЗОВАН")
  })
})
