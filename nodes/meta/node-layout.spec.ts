import { test, describe, expect } from "bun:test"
import ELK, {type ElkNode } from "elkjs"
import { data, config } from "./node-layout.fixture.ts"
import type { Metrics } from "./node-layout.t"
import {
  createStatePorts,
  createConditionPorts,
  createStateNode,
  createConditionNodes,
  createInternalEdges,
  createExternalEdges,
  createStateGroup,
  createElkData
} from "./node-layout.actions.js"

describe("форматирование", () => {
  const metaName = "test/1"
  const metrics = data.get(metaName)! as Metrics

  const keyState = "node-meta-state/1"
  const valState = metrics.states[keyState]

  test("state ports", () => {
    const ports = createStatePorts(metrics.sockets, valState.state, {x: valState.x || 0, y: valState.y || 0})
    expect(ports).toMatchSnapshot()
  })

  test("condition ports", () => {
    const ports = createConditionPorts(metrics.sockets, valState.state, config)
    expect(ports).toMatchSnapshot()
  })

  test("state", () => {
    const stateNode = createStateNode(keyState, valState, metrics.sockets, config)
    const result = {
      layoutOptions: config.meta,
      id: valState.state,
      children: [stateNode],
    }
    expect(result).toMatchSnapshot()
  })

  test("conditions", () => {
    const condition = createConditionNodes(metrics.conditions, valState.state, metrics.sockets, config)
    expect(condition).toMatchSnapshot()
  })

  test("ребра между conditions -> state", () => {
    const edges = createInternalEdges(metrics.sockets, valState.state)
    expect(edges).toMatchSnapshot()
  })

  test("ребра между state -> conditions", () => {
    const edges = createExternalEdges(metrics.sockets)
    expect(edges).toMatchSnapshot()
  })

  test("state group", () => {
    const stateGroup = createStateGroup(keyState, valState, metrics, config)
    expect(stateGroup).toMatchSnapshot()
  })

  let result: ElkNode

  test("создание ELK данных", () => {
    result = createElkData("test/1", metrics, config)
    expect(result).toMatchSnapshot()
  })

  const elk = new ELK()
  test("elk layout", async () => {
    const layout = await elk.layout(result)
    expect(layout).toMatchSnapshot()
  })
})
