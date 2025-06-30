/** @type {import("./node-layout.t").createElkData} */
export function createElkData(metaId, dataMeta, config) {
  return {
    id: metaId,
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
              .filter(([_, socket]) =>
                socket.state === valState.state && socket.parent === "state"
              )
              .map(([keySocket, socket]) => ({
                id: keySocket,
                x: /**@type{number}*/(socket.x) - /**@type{number}*/(valState.x),
                y: /**@type{number}*/(socket.y) - /**@type{number}*/(valState.y),
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
                    layoutOptions: socket.direction === 'west' ? config.port.west : config.port.east,
                    width: socket.size,
                    height: socket.size
                  }))
              }
            })
        ],
        edges:/**@type{import("elkjs").ElkExtendedEdge[]}*/(/**@type{unknown}*/(
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
            })
        ))
      }
    }),
    edges:/**@type{import("elkjs").ElkExtendedEdge[]}*/(/**@type{unknown}*/(
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
        })
    ))
  }
}