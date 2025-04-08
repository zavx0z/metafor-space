import { describe, expect, test } from "bun:test"
import { MetaFor } from "@metafor/space"
import { ParticleFromSnapshot } from "../../snapshot.js"

describe("Сериализация и десериализация частицы с состояниями IDLE, RUNNING, ERROR, SUCCESS", () => {
  const particle = MetaFor("Задача")
    .states("IDLE", "RUNNING", "ERROR", "SUCCESS")
    .context((t) => ({
      url: t.string({ title: "Адрес" }),
      retries: t.number({ title: "Количество попыток" }),
      errorCode: t.number({ title: "Код ошибки" }),
      isComplete: t.string({ title: "Завершено" }),
    }))
    .transitions([
      {
        from: "IDLE",
        to: [{ state: "RUNNING", when: { url: { include: "https" }, retries: { gt: 0, lt: 5 } } }],
      },
      {
        from: "RUNNING",
        to: [
          {state: "SUCCESS", when: {isComplete: "true"}},
          {state: "ERROR", when: {errorCode: {gt: 400, lt: 599}}}
        ]
      },
      {
        from: "ERROR",
        to: [{state: "IDLE", when: {retries: {gt: 0, lt: 5}}}]
      }
    ])
    .core(({update, context}) => ({
      updateUrl: () => update({url: context.url + ":8000"}),
    }))
    .actions({})
    .reactions([])


  describe.todo("Проверка сериализации ядра", () => {
    test.todo("Если параметр или функция ядра не используется в частице, не сериализовать его", () => {
    })
  })

  describe("Создание и начальная проверка состояния", () => {
    test("Должно корректно инициализировать частицу и проверять начальные данные", async () => {
      const particleInstance = particle.create({
        state: "IDLE",
        context: {url: "https://task.com", retries: 0}
      })
      // Теперь состояние должно быть IDLE, так как мы его указали в create()
      expect(particleInstance.state).toBe("IDLE")
      // Выполняем проверку перехода из IDLE в RUNNING
      particleInstance.update({url: "https://task.com", retries: 1})
      await Bun.sleep(100)
      expect(particleInstance.state).toBe("RUNNING")
    })
  })

  describe("Сериализация частицы", () => {
    test("Должна корректно сериализовать частицу", () => {
      const particleInstance = particle.create({
        state: "IDLE",
        context: {url: "https://task.com", retries: 1}
      })

      // Сериализация частицы через метод класса
      const serialized = particleInstance.snapshot()
      expect(serialized).toMatchSnapshot()
    })
  })
  const template = MetaFor("Задача")
    .states("IDLE", "RUNNING", "ERROR", "SUCCESS")
    .context((t) => ({
      url: t.string({ title: "Адрес" }),
      retries: t.number({ title: "Количество попыток" }),
      errorCode: t.number({ title: "Код ошибки" }),
      isComplete: t.string({ title: "Завершено" }),
    }))
    .transitions([
      {
        from: "IDLE",
        to: [{ state: "RUNNING", when: { url: { include: "https" }, retries: { gt: 0, lt: 5 } } }],
      },
      {
        from: "RUNNING",
        to: [
          {state: "SUCCESS", when: {isComplete: "true"}},
          {state: "ERROR", when: {errorCode: {gt: 400, lt: 599}}}
        ]
      }
    ])


  describe.skip("Десериализация частицы", () => {
    const particleInstance = template
      .core()
      .actions({})
      .reactions([]).create({
        state: "RUNNING",
        context: {url: "https://task.com", retries: 1}
      })
    const serialized = particleInstance.snapshot()
    const restoredParticle = ParticleFromSnapshot(serialized)

    test("Должна корректно восстановить состояние после десериализации", () => {
      console.log("Restored Particle State:", restoredParticle.state)
      console.log("Restored Particle Context:", restoredParticle.context)
      expect(restoredParticle.state).toBe("RUNNING")
    })
    test("Должна корректно выполнять переходы после восстановления", () => {
      restoredParticle.update({isComplete: "true"})
      expect(restoredParticle.state).toBe("SUCCESS")
    })
  })
})
