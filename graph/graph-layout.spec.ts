import {test, describe, expect} from "bun:test"
import ELK, {type ElkNode} from "elkjs"
import {data, config} from "./graph-layout.fixture.ts"
import type {Metrics} from "./graph-layout.t.ts"
import {createElkData} from "./graph-layout.actions.js"

describe("форматирование", () => {
  const metaName = "test/1"
  const metrics = data.get(metaName)! as Metrics
  let elkData: ElkNode

  test("полностью подготовленные данные на актора", () => {
    elkData = createElkData(metaName, metrics, config)
    expect(elkData).toMatchSnapshot()
  })

  test("полностью layout на актора", async () => {
    const elk = new ELK()
    const layout = await elk.layout(elkData)
    expect(layout).toMatchSnapshot()
  })
})
