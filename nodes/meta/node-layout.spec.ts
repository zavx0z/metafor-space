import { test, describe, expect } from "bun:test"
import ELK, { type ElkExtendedEdge, type ElkNode } from "elkjs"
import { data, config } from "./node-layout.fixture.ts"

describe("форматирование", () => {
  const metaName = "test/1"
  const dataMeta = data.get(metaName)!

  const keyState = "node-meta-state/1"
  const valState = dataMeta.states[keyState]

  test("state", () => {
    const result = {
      layoutOptions: config.meta,
      id: valState.state,
      children: [
        {
          layoutOptions: config.state,
          id: keyState,
          width: valState.width,
          height: valState.height,
          ports: Object.entries(dataMeta.sockets)
            .filter(([_, socket]) => socket.state === valState.state && socket.parent === "state")
            .map(([keySocket, socket]) => ({
              id: keySocket,
              x: socket.x! - valState.x!,
              y: socket.y! - valState.y!,
              width: socket.size,
              height: socket.size,
            })),
        },
      ],
    }
    expect(result).toMatchSnapshot()
  })

  test("conditions", () => {
    const condition = Object.entries(dataMeta.conditions)
      .filter(([_, val]) => val.to === valState.state)
      .map(([key, val]) => {
        return {
          layoutOptions: config.condition,
          id: key,
          width: val.width,
          height: val.height,
          ports: Object.entries(dataMeta.sockets)
            .filter(([_, socket]) => socket.state === valState.state && socket.parent === "condition")
            .map(([keySocket, socket]) => ({
              id: keySocket,
              layoutOptions: socket.direction === "west" ? config.port.west : config.port.east,
              width: socket.size,
              height: socket.size,
            })),
        }
      })
    expect(condition).toMatchSnapshot()
  })

  test("ребра между conditions -> state", () => {
    const edges = Object.entries(dataMeta.sockets)
      .filter(
        ([_, socket]) => socket.state === valState.state && socket.parent === "condition" && socket.direction === "east"
      )
      .map(([key, socketCond]) => {
        const target = Object.entries(dataMeta.sockets).find(
          ([_, socketState]) =>
            socketState.state === valState.state &&
            socketState.param === socketCond.param &&
            socketState.parent === "state" &&
            socketState.direction === "west"
        )
        if (typeof target === "undefined") return
        return {
          id: `${key}->${target[0]}`,
          sources: [key],
          targets: [target[0]],
        }
      })
    expect(edges).toMatchSnapshot()
  })

  test("ребра между state -> conditions", () => {
    const edges = Object.entries(dataMeta.sockets)
      .filter(([_, socket]) => socket.parent === "state" && socket.direction === "east")
      .map(([key, socketCond]) => {
        const target = Object.entries(dataMeta.sockets).find(
          ([_, socketState]) =>
            socketState.param === socketCond.param &&
            socketState.parent === "condition" &&
            socketState.direction === "west"
        )
        if (typeof target === "undefined") return
        return {
          id: `${key}->${target[0]}`,
          sources: [key],
          targets: [target[0]],
        }
      })
    expect(edges).toMatchSnapshot()
  })

  let result: ElkNode

  test("подготовка данных", () => {
    result = {
      id: "test/1",
      layoutOptions: config.base,
      children: Object.entries(dataMeta.states).map(([keyState, valState]) => {
        return {
          layoutOptions: config.meta,
          id: valState.state,
          children: [
            {
              layoutOptions: config.state,
              id: keyState,
              width: valState.width,
              height: valState.height,
              ports: Object.entries(dataMeta.sockets)
                .filter(([_, socket]) => socket.state === valState.state && socket.parent === "state")
                .map(([keySocket, socket]) => ({
                  id: keySocket,
                  x: socket.x! - valState.x!,
                  y: socket.y! - valState.y!,
                  width: socket.size,
                  height: socket.size,
                })),
            },
            ...Object.entries(dataMeta.conditions)
              .filter(([_, val]) => val.to === valState.state)
              .map(([key, val]) => {
                return {
                  layoutOptions: config.condition,
                  id: key,
                  width: val.width,
                  height: val.height,
                  ports: Object.entries(dataMeta.sockets)
                    .filter(([_, socket]) => socket.state === valState.state && socket.parent === "condition")
                    .map(([keySocket, socket]) => ({
                      id: keySocket,
                      layoutOptions: socket.direction === "west" ? config.port.west : config.port.east,
                      width: socket.size,
                      height: socket.size,
                    })),
                }
              }),
          ],
          edges: Object.entries(dataMeta.sockets)
            .filter(
              ([_, socket]) =>
                socket.state === valState.state && socket.parent === "condition" && socket.direction === "east"
            )
            .map(([key, socketCond]) => {
              const target = Object.entries(dataMeta.sockets).find(
                ([_, socketState]) =>
                  socketState.state === valState.state &&
                  socketState.param === socketCond.param &&
                  socketState.parent === "state" &&
                  socketState.direction === "west"
              )
              if (typeof target === "undefined") return
              return {
                id: `${key}->${target[0]}`,
                sources: [key],
                targets: [target[0]],
              }
            }) as ElkExtendedEdge[],
        }
      }),
      edges: Object.entries(dataMeta.sockets)
        .filter(([_, socket]) => socket.parent === "state" && socket.direction === "east")
        .map(([key, socketCond]) => {
          const target = Object.entries(dataMeta.sockets).find(
            ([_, socketState]) =>
              socketState.param === socketCond.param &&
              socketState.state !== socketCond.state &&
              socketState.parent === "condition" &&
              socketState.direction === "west"
          )
          if (typeof target === "undefined") return
          return {
            id: `${key}->${target[0]}`,
            sources: [key],
            targets: [target[0]],
          }
        }) as ElkExtendedEdge[],
    }
    expect(result).toMatchSnapshot()
  })

  const elk = new ELK()
  test("elk layout", async () => {
    // test.skip("elk layout", async () => {
    const layout = await elk.layout(result)
    expect(layout).toMatchSnapshot()
  })
})
