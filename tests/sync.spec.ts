import { describe, expect, test } from "bun:test"
import { MetaFor } from "../index.js"

describe("Синхронизация core и context", async () => {
    const particle = MetaFor("sync-test")
    .states("IDLE")
    .context((t) => ({
      dataLength: t.number({ default: 0 }),
    }))
    .transitions([])
    .core(({update}) => ({
      data: [],
      popData() {
        update({dataLength: 0})
        this.data.splice(0, this.data.length)
      },
      pushData(data: any) {
        this.data.push(data)
        update({dataLength: this.data.length})
      }
    }))
    .actions({})
    .reactions([])
    .create({
      state: "IDLE"
    })

  let count = 50
  const delay = 100
  const interval = setInterval(() => {
    particle.core.pushData(count)
    count--
    if (count === 0) clearInterval(interval)
  }, delay)

  particle.onUpdate(values => {
    if (values.dataLength > 4) {
      test("Данные ядра синхронизируются с контекстом", () => {
        particle.core.popData()
        // Simulate heavy synchronous computation (~1 second)
        let result = 0
        for (let i = 0; i < 100_000_000; i++) {
          result += Math.sin(i) * Math.cos(i)
        }
        expect(particle.context.dataLength).toBe(0)
        expect(particle.core.data.length).toBe(0)
      })
    }
  })
  await Bun.sleep(delay * count)
})
