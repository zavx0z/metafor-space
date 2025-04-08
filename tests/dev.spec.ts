import { describe, expect, it, afterAll } from "bun:test"
import { MetaFor } from "../types"

describe("Неполноценная частица в режиме разработки", async () => {
  const channel = new BroadcastChannel("validator")
  const messages: Map<string, { message: string; src: string }[]> = new Map()
  channel.onmessage = ({ data }) => {
    // console.debug("message", data)
    messages.set(data.id, [...(messages.get(data.id) || []), { message: data.message, src: data.src }])
  }

  afterAll(() => {
    channel.postMessage({ destroy: true })
    channel.close()
  })

  it("При отсутствии триггеров в коллапсах, переход не будет выполнен", async () => {
    const particle = MetaFor("dev-test-empty-trigger", { development: true })
      .states("ОЖИДАНИЕ", "РАБОТА")
      .context(({ number }) => ({
        parameter: number({ default: 0 }),
      }))
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{ state: "РАБОТА", when: {} }],
        },
      ])
      .core(() => ({}))
      .actions({})
      .create({ state: "ОЖИДАНИЕ" })

    const { state } = particle
    particle.destroy()

    expect(state).toBe("ОЖИДАНИЕ")
    await Bun.sleep(400)
    expect(messages.get("dev-test-empty-trigger")?.find((m) => m.src === "triggers")?.message).toEqual(
      'Пустой триггер в переходе из состояния "ОЖИДАНИЕ" в "РАБОТА". Триггер должен содержать хотя бы одно условие.'
    )
  })

  it("При наличии пустого состояния выводится предупреждение", async () => {
    const particle = MetaFor("dev-test-empty-state", { development: true })
      .states("", "ОТКРЫТ", "ЗАКРЫТ")
      .context(({ number }) => ({
        parameter: number({ default: 0 }),
      }))
      .transitions([])
      .core(() => ({}))
      .actions({})
      .create({ state: "ОТКРЫТ" })

    particle.destroy()
    await Bun.sleep(100)

    expect(messages.get("dev-test-empty-state")?.find((m) => m.src === "states")?.message).toEqual(
      "Состояние с индексом 0 имеет пустое имя. Все состояния должны иметь непустые строковые имена"
    )
    expect(messages.get("dev-test-empty-state")?.find((m) => m.src === "transitions")?.message).toEqual(
      "Переходы отсутствуют. Частица не будет менять состояние."
    )
  })
  it.todo("В графе отобразить состояние с пустым именем для редактирования")
})
