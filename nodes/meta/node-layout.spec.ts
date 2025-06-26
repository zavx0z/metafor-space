import {test, describe, expect} from "bun:test"
import type {DataMetaMap} from "./node-layout.t.ts"
import ELK, {type ElkExtendedEdge, type ElkNode} from "elkjs"

describe("форматирование", () => {
  const data: DataMetaMap = new Map([
    [
      "test/1",
      {
        "states": {
          "node-meta-state/1": {
            "state": "начало",
            "width": 198,
            "height": 110,
            "x": 0,
            "y": 40
          },
          "node-meta-state/2": {
            "state": "конец",
            "width": 198,
            "height": 110,
            "x": 0,
            "y": 40
          }
        },
        "conditions": {
          "node-meta-condition/1": {
            "from": "начало",
            "param": "status",
            "to": "конец",
            "width": 133,
            "height": 32
          },
          "node-meta-condition/2": {
            "from": "конец",
            "param": "status",
            "to": "начало",
            "width": 138,
            "height": 32
          }
        },
        "sockets": {
          "node-meta-socket/1": {
            "state": "начало",
            "parent": "state",
            "direction": "west",
            "param": "status",
            "size": 12,
            "x": -6,
            "y": 96
          },
          "node-meta-socket/2": {
            "state": "начало",
            "parent": "state",
            "direction": "east",
            "param": "status",
            "size": 12,
            "x": 192,
            "y": 96
          },
          "node-meta-socket/3": {
            "state": "конец",
            "parent": "state",
            "direction": "west",
            "param": "status",
            "size": 12,
            "x": -6,
            "y": 96
          },
          "node-meta-socket/4": {
            "state": "конец",
            "parent": "state",
            "direction": "east",
            "param": "status",
            "size": 12,
            "x": 192,
            "y": 96
          },
          "node-meta-socket/5": {
            "state": "конец",
            "parent": "condition",
            "direction": "west",
            "param": "status",
            "size": 12,
            "x": -6,
            "y": 50
          },
          "node-meta-socket/6": {
            "state": "конец",
            "parent": "condition",
            "direction": "east",
            "param": "status",
            "size": 12,
            "x": 127,
            "y": 50
          },
          "node-meta-socket/7": {
            "state": "начало",
            "parent": "condition",
            "direction": "west",
            "param": "status",
            "size": 12,
            "x": -6,
            "y": 50
          },
          "node-meta-socket/8": {
            "state": "начало",
            "parent": "condition",
            "direction": "east",
            "param": "status",
            "size": 12,
            "x": 132,
            "y": 50
          }
        },
        "params": {
          "node-meta-param/1": {
            "state": "начало",
            "param": "status",
            "width": 182,
            "height": 24,
            "x": 8,
            "y": 90
          },
          "node-meta-param/2": {
            "state": "конец",
            "param": "status",
            "width": 182,
            "height": 24,
            "x": 8,
            "y": 90
          }
        }
      }
    ]
  ])
  const config = {
    base: {
      "elk.layered.spacing.edgeEdgeBetweenLayers": "36",
      "elk.spacing.edgeEdge": "36",
      // "elk.spacing.edgeNode": "36",
      "hierarchyHandling": "INCLUDE_CHILDREN",
      'elk.layered.layering.strategy': 'LONGEST_PATH_SOURCE',
      "elk.padding": "[top=20.0, left=20.0, bottom=20.0, right=20.0]",
      "considerModelOrder.strategy": 'PREFER_NODES'
    },
    meta: {
      'elk.spacing.nodeNode': "0",
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
    },
    state: {
      'elk.spacing.nodeNode': "0",
      "elk.padding": "[top=0.0, left=0.0, bottom=0.0, right=0.0]",
      "portConstraints": "FIXED_POS"
    },
    condition: {
      "elk.spacing.nodeNode": "0",
      "elk.padding": "[top=0.0, left=0.0, bottom=0.0, right=0.0]",
      "portConstraints": "FIXED_SIDE",
    },
    operator: {
      "portConstraints": "FIXED_SIDE",
      "portAlignment.west": "JUSTIFIED",
    },
    port: {
      west: {
        "port.side": "WEST"
      },
      east: {
        "port.side": "EAST"
      }
    }
  }
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
            .filter(([_, socket]) =>
              socket.state === valState.state && socket.parent === "state"
            )
            .map(([keySocket, socket]) => ({
              id: keySocket,
              x: socket.x! - valState.x!,
              y: socket.y! - valState.y!,
              width: socket.size,
              height: socket.size
            }))
        }]
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
            .filter(([_, socket]) =>
              socket.state === valState.state && socket.parent === "condition"
            )
            .map(([keySocket, socket]) => ({
              id: keySocket,
              layoutOptions: socket.direction === 'west' ? config.port.west : config.port.east,
              width: socket.size,
              height: socket.size
            }))
        }
      })
    expect(condition).toMatchSnapshot()
  })

  test("ребра между conditions -> state", () => {
    const edges = Object.entries(dataMeta.sockets)
      .filter(([_, socket]) =>
        socket.state === valState.state
        && socket.parent === "condition"
        && socket.direction === "east"
      )
      .map(([key, socketCond]) => {
        const target = Object.entries(dataMeta.sockets)
          .find(([_, socketState]) =>
            socketState.state === valState.state
            && socketState.param === socketCond.param
            && socketState.parent === "state"
            && socketState.direction === "west"
          )
        if (typeof target === 'undefined') return
        return {
          id: `${key}->${target[0]}`,
          sources: [key],
          targets: [target[0]]
        }
      })
    expect(edges).toMatchSnapshot()
  })

  test("ребра между state -> conditions", () => {
    const edges = Object.entries(dataMeta.sockets)
      .filter(([_, socket]) =>
        socket.parent === "state"
        && socket.direction === "east"
      )
      .map(([key, socketCond]) => {
        const target = Object.entries(dataMeta.sockets)
          .find(([_, socketState]) =>
            socketState.param === socketCond.param
            && socketState.parent === "condition"
            && socketState.direction === "west"
          )
        if (typeof target === 'undefined') return
        return {
          id: `${key}->${target[0]}`,
          sources: [key],
          targets: [target[0]]
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
              ports:

                Object.entries(dataMeta.sockets)
                  .filter(([_, socket]) =>
                    socket.state === valState.state && socket.parent === "state"
                  )
                  .map(([keySocket, socket]) => ({
                    id: keySocket,
                    labels: [{text: keySocket.split("/")[1]}],
                    x: socket.x! - valState.x!,
                    y: socket.y! - valState.y!,
                    width: socket.size,
                    height: socket.size
                  }))
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
                    .filter(([_, socket]) =>
                      socket.state === valState.state && socket.parent === "condition"
                    )
                    .map(([keySocket, socket]) => ({
                      id: keySocket,
                      labels: [{text: keySocket.split("/")[1]}],
                      layoutOptions: socket.direction === 'west' ? config.port.west : config.port.east,
                      width: socket.size,
                      height: socket.size
                    }))
                }
              })

          ],
          edges:

            Object.entries(dataMeta.sockets)
              .filter(([_, socket]) =>
                socket.state === valState.state
                && socket.parent === "condition"
                && socket.direction === "east"
              )
              .map(([key, socketCond]) => {
                const target = Object.entries(dataMeta.sockets)
                  .find(([_, socketState]) =>
                    socketState.state === valState.state
                    && socketState.param === socketCond.param
                    && socketState.parent === "state"
                    && socketState.direction === "west"
                  )
                if (typeof target === 'undefined') return
                return {
                  id: `${key}->${target[0]}`,
                  sources: [key],
                  targets: [target[0]]
                }
              }) as ElkExtendedEdge[]
        }
      }),
      edges:

        Object.entries(dataMeta.sockets)
          .filter(([_, socket]) =>
            socket.parent === "state"
            && socket.direction === "east"
          )
          .map(([key, socketCond]) => {
            const target = Object.entries(dataMeta.sockets)
              .find(([_, socketState]) =>
                socketState.param === socketCond.param
                && socketState.state !== socketCond.state
                && socketState.parent === "condition"
                && socketState.direction === "west"
              )
            if (typeof target === 'undefined') return
            return {
              id: `${key}->${target[0]}`,
              sources: [key],
              targets: [target[0]]
            }
          }) as ElkExtendedEdge[]

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
