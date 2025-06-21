import {
  contextId,
  contextPortId,
  edgeId,
  parseTriggerParameterId,
  parseConditionPortId,
  stateId,
  conditionId,
  triggerParameterId,
  conditionPortId
} from "../../nodes/id.js"

// /** @type {import("../../graph/types/index.js").LayoutConfig} */
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
  atom: {
    'elk.spacing.nodeNode': "0",
    'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  },
  state: {
    'elk.spacing.nodeNode': "0",
    "elk.padding": "[top=0.0, left=0.0, bottom=0.0, right=0.0]",
    "portConstraints": "FIXED_POS"
  },
  trigger: {
    "elk.spacing.nodeNode": "0",
    "elk.padding": "[top=0.0, left=0.0, bottom=0.0, right=0.0]"
  },
  triggerParameter: {
    "portConstraints": "FIXED_SIDE",
    "portAlignment.west": "JUSTIFIED",
  },
  port: {
    west: {
      "port.side": "WEST"
    }
  }
}

// * @param {import("../../graph/types/index.ts").Metrics} metrics - метрики для расчета layout

/**
 * Формирует триггеры для состояния
 * @param {string} state - текущее состояние
 * @param {SnapshotMetaForAny} snapshot - снапшот с данными
 * @param {any} metrics - метрики для расчета layout
 * @returns {Array<import('elkjs').ElkNode>} массив триггеров
 */
function createTriggers(state, snapshot, metrics) {
  const triggers = new Map()

  for (const collapse of snapshot.transitions) {
    if (collapse.in === state) continue

    for (const target of collapse.to) {
      if (target.state !== state) continue

      for (const param of Object.keys(target.when)) {
        const id = conditionId({meta: snapshot.id, state: state, condition: param})

        const [width, height] = metrics.triggers.sizes[id]

        if (!triggers.get(param))
          triggers.set(param, {id, layoutOptions: config.trigger, children: [], width: width, height: height})
        const trigger = triggers.get(param)

        trigger.children.push({
          layoutOptions: config.triggerParameter,
          id: triggerParameterId({atom: snapshot.id, from: collapse.in, to: state, param}),
          width: width,
          height: metrics.triggers.portSpacing,
          ports: [{
            layoutOptions: config.port.west,
            id: conditionPortId({
              meta: snapshot.id,
              from: collapse.in,
              to: target.state,
              condition: param,
              direction: 'west'
            })
          }]
        })
      }
    }
  }
  return Array.from(triggers.values())
}

// @param {import("../../graph/types/index.ts").Metrics} metrics - метрики для расчета layout

/**
 * Преобразует формат collapses в формат ELK
 * @param {SnapshotMetaForAny} snapshot - объект с collapses и другими данными
 * @param {*} metrics - метрики для расчета layout
 */
export function generate(snapshot, metrics) {
  /** @type {Array<import('elkjs').ElkNode>} */
  let allTriggers = []
  return {
    id: snapshot.id,
    layoutOptions: config.base,
    children: snapshot.states.map(state => {
      const triggers = createTriggers(state, snapshot, metrics)
      allTriggers.push(...triggers)

      return {
        layoutOptions: config.atom,
        id: stateId({atom: snapshot.id, state}),
        children: [
          {
            layoutOptions: config.state,
            id: contextId({atom: snapshot.id, state}),
            width: metrics.nodes[state].size[0],
            height: metrics.nodes[state].size[1],
            // children: Object.keys(snapshot.types).map(type => (
            //   {
            //     id: contextParameterId({atom: snapshot.id, state, param: type}),
            //     height: metrics.triggers.portSpacing,
            //     width: metrics.nodes[state].size[0],
            //   })
            // ),
            ports: Object.keys(snapshot.types).map(type => [
              {
                id: contextPortId({atom: snapshot.id, state, param: type, direction: 'input'}),
                x: metrics.nodes[state].sockets[type][0][0],
                y: metrics.nodes[state].sockets[type][0][1],
                height: metrics.socketSize,
                width: metrics.socketSize
              },
              {
                id: contextPortId({atom: snapshot.id, state, param: type, direction: 'output'}),
                x: metrics.nodes[state].sockets[type][1][0],
                y: metrics.nodes[state].sockets[type][1][1],
                height: metrics.socketSize,
                width: metrics.socketSize
              }
            ]).flat()
          },
          ...triggers
        ],
        edges: [ // ребра между триггерами и контекстом
          ...triggers.map(trigger => (trigger?.children || []).map(parameter => {
            const {from, to, param, atom} = parseTriggerParameterId(parameter.id)
            return {
              id: edgeId({
                sourceId: conditionPortId({meta: atom, from, to, condition: param, direction: 'east'}),
                targetId: contextPortId({atom, state: to, param, direction: 'input'})
              }),
              sources: [conditionPortId({
                meta: snapshot.id,
                from,
                to,
                condition: param,
                direction: 'east'
              }).replace("/east", "")],
              targets: [contextPortId({atom: snapshot.id, state: to, param, direction: 'input'})]
            }
          })).flat()
        ]
      }
    }),
    edges: allTriggers
      .map(trigger => (trigger?.children || [])
        .map(parameter => {
          const {from, to, condition} = parseConditionPortId(parameter.id)
          return {
            id: edgeId({
              sourceId: contextPortId({atom: snapshot.id, state: from, param: condition, direction: 'output'}),
              targetId: conditionPortId({meta: snapshot.id, from, to, condition, direction: 'west'})
            }),
            sources: [contextPortId({atom: snapshot.id, state: from, param: condition, direction: 'output'})],
            targets: [conditionPortId({meta: snapshot.id, from, to, condition, direction: 'west'})]
          }
        })).flat()
  }
}