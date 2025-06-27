import { test, describe, expect } from "bun:test"
import type { DataMetaMap } from "./node-layout.t"
import { config, data } from "./node-layout.spec"
import ELK, { type ElkExtendedEdge, type ElkNode } from "elkjs"

describe("elk layout для ноды состояния", () => {
  const metaName = "test/1"
  const dataMeta = data.get(metaName)!

  const keyState = "node-meta-state/1"
  const valState = dataMeta.states[keyState]

  test("структура одной ноды состояния", () => {
    const stateNode = {
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
              labels: [{ text: keySocket.split("/")[1] }],
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
                  labels: [{ text: keySocket.split("/")[1] }],
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
    
    expect(stateNode).toMatchSnapshot()
  })

  test("elk layout для отдельной ноды состояния", async () => {
    const elk = new ELK()
    
    const stateNodeForLayout: ElkNode = {
      id: `layout-${valState.state}`,
      layoutOptions: config.base,
      children: [{
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
                labels: [{ text: keySocket.split("/")[1] }],
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
                    labels: [{ text: keySocket.split("/")[1] }],
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
      }]
    }

    const layout = await elk.layout(stateNodeForLayout)
    expect(layout).toMatchSnapshot()
  })

  test("вычисление позиций портов после layout", async () => {
    const elk = new ELK()
    
    // Создаем упрощенную структуру для тестирования позиций портов
    const simpleStateNode: ElkNode = {
      id: "simple-state",
      layoutOptions: config.state,
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
    }

    const portLayout = await elk.layout(simpleStateNode)
    
    // Проверяем, что порты имеют корректные позиции
    expect(portLayout.ports).toBeDefined()
    expect(portLayout.ports!.length).toBeGreaterThan(0)
    expect(portLayout).toMatchSnapshot()
  })
})
