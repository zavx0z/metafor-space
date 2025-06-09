import {describe, expect, test} from "bun:test"
import {MetaFor, type Meta} from "@metafor/space"

describe("Синхронизация core и context", async () => {
  document.body.innerHTML = `<metafor-test></metafor-test>`

  const Meta = MetaFor("test")
    .states("IDLE")
    .context((t) => ({
      dataLength: t.number({default: 0}),
    }))
    .core(({update}) => ({
      data: [],
      popData() {
        update({dataLength: 0})
        this.data.splice(0, this.data.length)
      },
      pushData(data: any) {
        this.data.push(data)
        update({dataLength: this.data.length})
      },
    }))
    .transitions([])
    .create({state: "IDLE"})
  const meta = document.querySelector('metafor-test') as Meta<typeof Meta.state, typeof Meta.context>

  let count = 50
  const delay = 20
  const interval = setInterval(() => {
    // meta.core.pushData(count)
    count--
    if (count === 0) clearInterval(interval)
  }, delay)

  meta.onUpdate((values) => {
    if (values.dataLength > 4) {
      test("Данные ядра синхронизируются с контекстом", () => {
        // meta.core.popData()
        // Simulate heavy synchronous computation (~1 second)
        let result = 0
        for (let i = 0; i < 100_000_000; i++) {
          result += Math.sin(i) * Math.cos(i)
        }
        expect(meta.context.dataLength).toBe(0)
        // expect(meta.core.data.length).toBe(0)
      })
    }
  })
  await Bun.sleep(delay * count)
})
