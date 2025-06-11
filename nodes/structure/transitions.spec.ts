import {describe, test, expect} from "bun:test"
import {MetaFor} from "../../metafor"
import {extractBaseConditions, extractTransitions} from "./transitions"

describe("Параметры условий переходов", () => {
  const tag = "01975c8r"
  document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
  MetaFor(tag)
    .states("idle", "start", "finish")
    .context((t) => ({
      process: t.enum("wait", "run", "end")({title: "Статус", default: "wait"}),
      count: t.number({title: "Числовое значение", default: 0})
    }))
    .core()
    .transitions("start", [
      {
        from: "idle",
        to: [{
          state: "start",
          when: {
            process: "run",
            count: 0
          }
        }]
      },
      {
        from: "start",
        to: [{
          state: "finish",
          when: {process: "end"}
        }],
      },
      {
        from: "finish",
        to: [
          {
            state: "start",
            when: {
              process: "run",
              count: {gt: 4}
            }
          },
          {
            state: "idle",
            when: {process: "wait"}
          }
        ],
      },
    ])
    .view({
      render: ({html}) => html``
    }).create({})
  const meta = document.querySelector(`metafor-${tag}`) as MetaAny

  const snapshot = meta.snapshot()

  test("Извлечение всех условий и формирование входных портов", () => {
    const result = extractBaseConditions(snapshot)
    expect(result).toMatchSnapshot()
  })

  test("Данные по всем портам всех условий переходов meta", () => {
    const result = extractTransitions(snapshot)
    expect(result).toMatchSnapshot()
  })
})