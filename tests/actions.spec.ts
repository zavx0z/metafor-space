import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"


describe("Actions", () => {

  test("При входе в состояние выполняется действие", async () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context(({string}) => ({
        nickname: string({title: "Имя", nullable: true}),
        email: string({title: "Email", nullable: true, default: "zavx0z@ya.ru"}),
        password: string({title: "Пароль", nullable: true, default: "123456"}),
      }))
      .core()
      .reactions([])
      .states("АНОНИМНЫЙ", "РЕГИСТРАЦИЯ", "АВТОРИЗАЦИЯ", "АВТОРИЗОВАН")
      .transitions("АНОНИМНЫЙ", [
        {
          in: "АНОНИМНЫЙ",
          to: {
            "АВТОРИЗАЦИЯ": {email: {isNull: false}, password: {isNull: false}}
          }
        },
        {
          in: "АВТОРИЗАЦИЯ",
          action: () => {
            const nickname = "zavx0z"
            return {nickname}
          },
          to: {
            "АВТОРИЗОВАН": {nickname: {isNull: false}}
          }
        },
      ])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    await Bun.sleep(200)
    expect(meta.state).toBe("АВТОРИЗОВАН")
    expect(meta.context.nickname).toBe("zavx0z")
  })

  test("Асинхронное действие", async () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context(({string}) => ({
        nickname: string({title: "Имя", nullable: true}),
        email: string({title: "Email", nullable: true}),
        password: string({title: "Пароль", nullable: true}),
      }))
      .core()
      .reactions([])
      .states("АНОНИМНЫЙ", "РЕГИСТРАЦИЯ", "АВТОРИЗАЦИЯ", "АВТОРИЗОВАН")
      .transitions("АНОНИМНЫЙ", [
        {
          in: "АНОНИМНЫЙ",
          to: {
            "АВТОРИЗАЦИЯ": {email: {isNull: false}, password: {isNull: false}}
          }
        },
        {
          in: "АВТОРИЗАЦИЯ",
          action: async () => {
            await new Promise((resolve) => setTimeout(resolve, 100))
            return {nickname: "async_user"}
          },
          to: {
            "АВТОРИЗОВАН": {nickname: {isNull: false}}
          }
        },
      ])
      .view({})

    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({email: "test@test.com", password: "password"})
    await new Promise((resolve) => setTimeout(resolve, 150))
    expect(meta.state).toBe("АВТОРИЗОВАН")
    expect(meta.context.nickname).toBe("async_user")
  })

  test("Действие может обновлять несколько полей контекста", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context(({string}) => ({
        nickname: string({title: "Имя", nullable: true}),
        email: string({title: "Email", nullable: true}),
        password: string({title: "Пароль", nullable: true}),
      }))
      .core()
      .reactions([])
      .states("АНОНИМНЫЙ", "РЕГИСТРАЦИЯ", "АВТОРИЗАЦИЯ", "АВТОРИЗОВАН")
      .transitions("АНОНИМНЫЙ", [
        {
          in: "АНОНИМНЫЙ",
          to: {
            "АВТОРИЗАЦИЯ": {email: {isNull: false}, password: {isNull: false}}
          }
        },
        {
          in: "АВТОРИЗАЦИЯ",
          action: () => {
            return {
              nickname: "multi_update",
              email: "updated@email.com",
            }
          },
          to: {
            "АВТОРИЗОВАН": {nickname: {isNull: false}}
          }
        },
      ])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({email: "initial@email.com", password: "password"})
    expect(meta.context.nickname).toBe("multi_update")
    expect(meta.context.email).toBe("updated@email.com")
  })

  test("Действие не выполняется если триггеры не сработали", () => {
    let actionCalled = false
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context(({string}) => ({
        nickname: string({title: "Имя", nullable: true}),
        email: string({title: "Email", nullable: true}),
        password: string({title: "Пароль", nullable: true}),
      }))
      .core()
      .reactions([])
      .states("АНОНИМНЫЙ", "РЕГИСТРАЦИЯ", "АВТОРИЗАЦИЯ", "АВТОРИЗОВАН")
      .transitions("АНОНИМНЫЙ", [
        {
          in: "АНОНИМНЫЙ",
          to: {
            "АВТОРИЗАЦИЯ": {email: {isNull: false}, password: {isNull: false}}
          }
        },
        {
          in: "АВТОРИЗАЦИЯ",
          action: () => {
            actionCalled = true
            return {nickname: "should_not_update"}
          },
          to: {
            "АВТОРИЗОВАН": {nickname: {isNull: false}}
          }
        },
      ])
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({email: "test@test.com"})
    expect(meta.state).toBe("АНОНИМНЫЙ")
    expect(actionCalled).toBe(false)
    expect(meta.context.nickname).toBeNull()
  })
})
