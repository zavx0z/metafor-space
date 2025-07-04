/** @type {import("./graph-layout.t.js").createStatePorts} */
export function createStatePorts(sockets, stateName, statePosition) {
  return Object.entries(sockets)
    .filter(([_, socket]) => socket.state === stateName && socket.parent === "state")
    .map(([keySocket, socket]) => ({
      id: keySocket,
      x: /**@type{number}*/(socket.x) - statePosition.x,
      y: /**@type{number}*/(socket.y) - statePosition.y,
      width: socket.size ?? 12,
      height: socket.size ?? 12
    }))
}

/** @type {import("./graph-layout.t.js").createConditionPorts} */
export function createConditionPorts(sockets, stateName, config) {
  return Object.entries(sockets)
    .filter(([_, socket]) => socket.state === stateName && socket.parent === "condition")
    .map(([keySocket, socket]) => ({
      id: keySocket,
      layoutOptions: socket.direction === 'west' ? config.port.west : config.port.east,
      width: socket.size / 2,
      height: socket.size / 2
    }))
}

/** @type {import("./graph-layout.t.js").createStateNode} */
export function createStateNode(keyState, valState, sockets, config) {
  return {
    layoutOptions: config.state,
    id: keyState,
    width: valState.width,
    height: valState.height,
    ports: createStatePorts(sockets, valState.state, {x: valState.x || 0, y: valState.y || 0})
  }
}

/** @type {import("./graph-layout.t.js").createConditionNodes} */
export function createConditionNodes(conditions, stateName, sockets, config) {
  return Object.entries(conditions)
    .filter(([_, val]) => val.to === stateName)
    .map(([key, val]) => ({
      layoutOptions: config.condition,
      id: key,
      width: val.width,
      height: val.height,
      ports: createConditionPorts(sockets, stateName, config)
    }))
}

/** @type {import("./graph-layout.t.js").createInternalEdges} */
export function createInternalEdges(sockets, stateName) {
  return Object.entries(sockets)
    .filter(([_, socket]) =>
      socket.state === stateName
      && socket.parent === "condition"
      && socket.direction === "east"
    )
    .map(([key, socketCond]) => {
      const target = Object.entries(sockets)
        .find(([_, socketState]) =>
          socketState.state === stateName
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
    .filter(edge => edge !== undefined)
}

/** @type {import("./graph-layout.t.js").createExternalEdges} */
export function createExternalEdges(sockets) {
  return Object.entries(sockets)
    .filter(([_, socket]) =>
      socket.parent === "state"
      && socket.direction === "east"
    )
    .map(([key, socketCond]) => {
      const target = Object.entries(sockets)
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
    .filter(edge => edge !== undefined)
}

/** @type {import("./graph-layout.t.js").createStateGroup} */
export function createStateGroup(keyState, valState, metrics, config) {
  return /**@type{import("elkjs").ElkNode}*/({
    layoutOptions: config.meta,
    id: valState.state,
    children: [
      ...createConditionNodes(metrics.conditions, valState.state, metrics.sockets, config),
      createStateNode(keyState, valState, metrics.sockets, config)
    ],
    edges: createInternalEdges(metrics.sockets, valState.state)
  })
}

/** @type {import("./graph-layout.t.js").createElkData} */
export function createElkData(metaId, metrics, config) {
  return {
    id: metaId,
    layoutOptions: config.base,
    children: Object.entries(metrics.states).map(([keyState, valState]) =>
      createStateGroup(keyState, valState, metrics, config)
    ),
    edges: createExternalEdges(metrics.sockets)
  }
}