// @ts-nocheck
import {
  contextId,
  contextPortId,
  edgeId,
  parseTriggerParameterId,
  parseTriggerPortId,
  stateId,
  triggerId,
  triggerParameterId,
  triggerPortId
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

/**
 * Формирует триггеры для состояния
 * @param {string} state - текущее состояние
 * @param {import("../../types/meta").Snapshot<any, any, any>} snapshot - снапшот с данными
 * @param {any} metrics - метрики для расчета layout
 // * @param {import("../../graph/types/index.ts").Metrics} metrics - метрики для расчета layout
 * @returns {Array<import('elkjs').ElkNode>} массив триггеров
 */
function createTriggers(state, snapshot, metrics) {
  const triggers = new Map()

  for (const collapse of snapshot.collapses) {
    if (collapse.from === state) continue

    for (const target of collapse.to) {
      if (target.state !== state) continue

      for (const param of Object.keys(target.trigger)) {
        const id = triggerId({atom: snapshot.id, state: state, param})

        const [width, height] = metrics.triggers.sizes[id]

        if (!triggers.get(param))
          triggers.set(param, {id, layoutOptions: config.trigger, children: [], width: width, height: height})
        const trigger = triggers.get(param)

        trigger.children.push({
          layoutOptions: config.triggerParameter,
          id: triggerParameterId({atom: snapshot.id, from: collapse.from, to: state, param}),
          width: width,
          height: metrics.triggers.portSpacing,
          ports: [{
            layoutOptions: config.port.west,
            id: triggerPortId({atom: snapshot.id, from: collapse.from, to: target.state, param, direction: 'west'})
          }]
        })
      }
    }
  }
  return Array.from(triggers.values())
}

/**
 * Преобразует формат collapses в формат ELK
 * @param {QMachineSnapshot} snapshot - объект с collapses и другими данными
 * @param {import("../../graph/types/index.ts").Metrics} metrics - метрики для расчета layout
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
                sourceId: triggerPortId({atom, from, to, param, direction: 'east'}),
                targetId: contextPortId({atom, state: to, param, direction: 'input'})
              }),
              sources: [triggerPortId({
                atom: snapshot.id,
                from,
                to,
                param,
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
          const {from, to, param} = parseTriggerPortId(parameter.id)
          return {
            id: edgeId({
              sourceId: contextPortId({atom: snapshot.id, state: from, param, direction: 'output'}),
              targetId: triggerPortId({atom: snapshot.id, from, to, param, direction: 'west'})
            }),
            sources: [contextPortId({atom: snapshot.id, state: from, param, direction: 'output'})],
            targets: [triggerPortId({atom: snapshot.id, from, to, param, direction: 'west'})]
          }
        })).flat()
  }
}