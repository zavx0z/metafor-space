import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"


describe("Конструктор MetaFor", () => {
  const nickname = "zavx0z"
  const email = "zavx0z@ya.ru"
  const password = "123456"
  const tag = Bun.randomUUIDv7()
  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  const Fabric = MetaFor(tag)
    .context((t) => ({
      nickname: t.string({title: "Имя", nullable: true}),
      email: t.string({title: "Email", nullable: true, default: email}),
      password: t.string({title: "Пароль", nullable: true, default: password}),
    }))
    .core(() => ({
      password: "123456",
    }))
    .states("АНОНИМНЫЙ", "РЕГИСТРАЦИЯ", "АВТОРИЗАЦИЯ", "АВТОРИЗОВАН")
    .transitions("АНОНИМНЫЙ", [
      {
        in: "АНОНИМНЫЙ",
        to: [{state: "АВТОРИЗАЦИЯ", when: {email: {isNull: false}, password: {isNull: false}}}],
      },
      {
        in: "АВТОРИЗАЦИЯ",
        action: () => ({nickname}),
        to: [{state: "АВТОРИЗОВАН", when: {nickname: {isNull: false}}}],
      },
    ])

  // test("view", () =>
  //   expect(Object.hasOwn(Fabric, "view"), "Функция-конструктор представления должна быть присутствовать").toBe(true))

  test("reactions", () =>
    expect(Object.hasOwn(Fabric, "reactions"), "Функция-конструктор реакций должна быть присутствовать").toBe(true))

  test("Инициализация состояния без действия с контекстом который соответствует условию перехода", () => {
    const Meta = Fabric.reactions([]).view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    expect(meta.context, "Контекст должен быть обновлен").toEqual({email, nickname, password})
    expect(meta.state, "Триггеры должны быть обработаны и состояние должно измениться").toBe("АВТОРИЗОВАН")
  })
})
