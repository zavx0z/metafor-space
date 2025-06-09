import {describe, expect, test} from "bun:test"
import {MetaFor, type Meta} from "@metafor/space"
// FIXME:
describe("Синхронизация core и context", async () => {
  document.body.innerHTML = `<metafor-test></metafor-test>`

  const Meta = MetaFor("test")
    .states("IDLE", "push", "pop")
    .context((t) => ({
      process: t.enum("pop", "push")({nullable: true}),
      dataLength: t.number({default: 0}),
    }))
    .core(({update}) => ({
      data: [],
      popData() {
        this.data.splice(0, this.data.length)
        update({dataLength: this.data.length, process: null})

      },
      pushData(data: any) {
        this.data.push(data)
        update({dataLength: this.data.length, process: null})
      },
    }))
    .transitions([
      {
        from: "IDLE",
        to: [
          {state: "push", when: {process: "push"}},
          {state: "pop", when: {process: "pop"}}
        ]
      },
      {
        from: "push",
        action: ({core}) => core.pushData(),
        to: [
          {state: "IDLE", when: {process: null}},
          {state: "pop", when: {process: "pop"}}
        ]
      },
      {
        from: "pop",
        action: ({core}) => core.popData(),
        to: [{state: "IDLE", when: {process: null}}]
      }
    ])
    .create({state: "IDLE"})
  const meta = document.querySelector('metafor-test') as Meta<typeof Meta.state, typeof Meta.context>

  let count = 50
  const delay = 20
  const interval = setInterval(() => {
    meta.update({process: "push"})
    count--
    if (count === 0) clearInterval(interval)
  }, delay)

  meta.onUpdate((values) => {
    // console.log("upd", values)
    if (values.dataLength > 47) {
      test("Данные ядра синхронизируются с контекстом", () => {
        // meta.core.popData()
        meta.update({process: "pop"})
        // Simulate heavy synchronous computation (~1 second)
        // let result = 0
        // for (let i = 0; i < 100_000_000; i++) {
        //   result += Math.sin(i) * Math.cos(i)
        // }
        expect(meta.context.dataLength).toBe(0)
        // expect(meta.core.data.length).toBe(0)
      })
    }
  })
  await Bun.sleep(delay * count)
})
