import {describe, expect, test, beforeEach} from "bun:test"
import {MetaFor} from "@metafor/space"


describe("Actions", () => {
  let count = 0
  beforeEach(() => {
    document.body.innerHTML = `<metafor-user-${count}></metafor-user-${count}>`
    count +=1
  })

  test("При входе в состояние выполняется действие", async () => {
    const user = MetaFor("user-0")
      .states("АНОНИМНЫЙ", "РЕГИСТРАЦИЯ", "АВТОРИЗАЦИЯ", "АВТОРИЗОВАН")
      .context(({string}) => ({
        nickname: string({title: "Имя", nullable: true}),
        email: string({title: "Email", nullable: true, default: "zavx0z@ya.ru"}),
        password: string({title: "Пароль", nullable: true, default: "123456"}),
      }))
      .core()
      .transitions([
        {
          from: "АНОНИМНЫЙ",
          to: [
            {
              state: "АВТОРИЗАЦИЯ",
              when: {email: {isNull: false}, password: {isNull: false}},
            },
          ],
        },
        {
          from: "АВТОРИЗАЦИЯ",
          action: ({update}) => {
            const nickname = "zavx0z"
            update({nickname})
          },
          to: [
            {
              state: "АВТОРИЗОВАН",
              when: {nickname: {isNull: false}},
            },
          ],
        },
      ])
      .create({
        state: "АНОНИМНЫЙ",
      })

    await Bun.sleep(200)
    expect(user.state).toBe("АВТОРИЗОВАН")
    expect(user.context.nickname).toBe("zavx0z")
  })

  test("Асинхронное действие", async () => {
    const user = MetaFor("user-1")
      .states("АНОНИМНЫЙ", "РЕГИСТРАЦИЯ", "АВТОРИЗАЦИЯ", "АВТОРИЗОВАН")
      .context(({string}) => ({
        nickname: string({title: "Имя", nullable: true}),
        email: string({title: "Email", nullable: true}),
        password: string({title: "Пароль", nullable: true}),
      }))
      .core()
      .transitions([
        {
          from: "АНОНИМНЫЙ",
          to: [
            {
              state: "АВТОРИЗАЦИЯ",
              when: {email: {isNull: false}, password: {isNull: false}},
            },
          ],
        },
        {
          from: "АВТОРИЗАЦИЯ",
          action: async ({update}) => {
            await new Promise((resolve) => setTimeout(resolve, 100))
            update({nickname: "async_user"})
          },
          to: [
            {
              state: "АВТОРИЗОВАН",
              when: {nickname: {isNull: false}},
            },
          ],
        },
      ])
      .create({
        state: "АНОНИМНЫЙ",
      })
    user.update({email: "test@test.com", password: "password"})
    await new Promise((resolve) => setTimeout(resolve, 150))
    expect(user.state).toBe("АВТОРИЗОВАН")
    expect(user.context.nickname).toBe("async_user")
  })

  test("Действие может обновлять несколько полей контекста", () => {
    const user = MetaFor("user-2")
      .states("АНОНИМНЫЙ", "РЕГИСТРАЦИЯ", "АВТОРИЗАЦИЯ", "АВТОРИЗОВАН")
      .context(({string}) => ({
        nickname: string({title: "Имя", nullable: true}),
        email: string({title: "Email", nullable: true}),
        password: string({title: "Пароль", nullable: true}),
      }))
      .core()
      .transitions([
        {
          from: "АНОНИМНЫЙ",
          to: [
            {
              state: "АВТОРИЗАЦИЯ",
              when: {email: {isNull: false}, password: {isNull: false}},
            },
          ],
        },
        {
          from: "АВТОРИЗАЦИЯ",
          action: ({update}) => {
            update({
              nickname: "multi_update",
              email: "updated@email.com",
            })
          },
          to: [
            {
              state: "АВТОРИЗОВАН",
              when: {nickname: {isNull: false}},
            },
          ],
        },
      ])
      .create({
        state: "АНОНИМНЫЙ"
      })
    user.update({email: "initial@email.com", password: "password"})
    expect(user.context.nickname).toBe("multi_update")
    expect(user.context.email).toBe("updated@email.com")
  })

  test("Действие не выполняется если триггеры не сработали", () => {
    let actionCalled = false
    const user = MetaFor("user-3")
      .states("АНОНИМНЫЙ", "РЕГИСТРАЦИЯ", "АВТОРИЗАЦИЯ", "АВТОРИЗОВАН")
      .context(({string}) => ({
        nickname: string({title: "Имя", nullable: true}),
        email: string({title: "Email", nullable: true}),
        password: string({title: "Пароль", nullable: true}),
      }))
      .core()
      .transitions([
        {
          from: "АНОНИМНЫЙ",
          to: [
            {
              state: "АВТОРИЗАЦИЯ",
              when: {email: {isNull: false}, password: {isNull: false}},
            },
          ],
        },
        {
          from: "АВТОРИЗАЦИЯ",
          action: ({update}) => {
            actionCalled = true
            update({nickname: "should_not_update"})
          },
          to: [
            {
              state: "АВТОРИЗОВАН",
              when: {nickname: {isNull: false}},
            },
          ],
        },
      ])
      .create({state: "АНОНИМНЫЙ"})
    user.update({email: "test@test.com"})
    expect(user.state).toBe("АНОНИМНЫЙ")
    expect(actionCalled).toBe(false)
    expect(user.context.nickname).toBeNull()
  })
})
