import type { MetricsMap, LayoutConfig } from "./graph-layout.t";


export const config: LayoutConfig = {
  base: {
    "elk.layered.spacing.edgeEdgeBetweenLayers": "36",
    "elk.spacing.edgeEdge": "36",
    // "elk.spacing.edgeNode": "36",
    "hierarchyHandling": "INCLUDE_CHILDREN",
    "elk.layered.layering.strategy": "LONGEST_PATH_SOURCE",
    "elk.padding": "[top=20.0, left=20.0, bottom=20.0, right=20.0]",
    "considerModelOrder.strategy": "PREFER_NODES",
  },
  meta: {
    "elk.spacing.nodeNode": "0",
    "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  },
  state: {
    "elk.spacing.nodeNode": "0",
    "elk.padding": "[top=0.0, left=0.0, bottom=0.0, right=0.0]",
    "portConstraints": "FIXED_POS",
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
      "port.side": "WEST",
    },
    east: {
      "port.side": "EAST",
    },
  },
}
export const data: MetricsMap = new Map([
  [
    "test/1",
    {
      states: {
        "node-meta-state/1": {
          state: "начало",
          width: 198,
          height: 110,
          x: 0,
          y: 40,
        },
        "node-meta-state/2": {
          state: "конец",
          width: 198,
          height: 110,
          x: 0,
          y: 40,
        },
      },
      conditions: {
        "node-meta-condition/1": {
          from: "начало",
          param: "status",
          to: "конец",
          width: 133,
          height: 32,
        },
        "node-meta-condition/2": {
          from: "конец",
          param: "status",
          to: "начало",
          width: 138,
          height: 32,
        },
      },
      sockets: {
        "node-meta-socket/1": {
          state: "начало",
          parent: "state",
          direction: "west",
          param: "status",
          size: 12,
          x: -6,
          y: 96,
        },
        "node-meta-socket/2": {
          state: "начало",
          parent: "state",
          direction: "east",
          param: "status",
          size: 12,
          x: 192,
          y: 96,
        },
        "node-meta-socket/3": {
          state: "конец",
          parent: "state",
          direction: "west",
          param: "status",
          size: 12,
          x: -6,
          y: 96,
        },
        "node-meta-socket/4": {
          state: "конец",
          parent: "state",
          direction: "east",
          param: "status",
          size: 12,
          x: 192,
          y: 96,
        },
        "node-meta-socket/5": {
          state: "конец",
          parent: "condition",
          direction: "west",
          param: "status",
          size: 12,
          x: -6,
          y: 50,
        },
        "node-meta-socket/6": {
          state: "конец",
          parent: "condition",
          direction: "east",
          param: "status",
          size: 12,
          x: 127,
          y: 50,
        },
        "node-meta-socket/7": {
          state: "начало",
          parent: "condition",
          direction: "west",
          param: "status",
          size: 12,
          x: -6,
          y: 50,
        },
        "node-meta-socket/8": {
          state: "начало",
          parent: "condition",
          direction: "east",
          param: "status",
          size: 12,
          x: 132,
          y: 50,
        },
      },
      params: {
        "node-meta-param/1": {
          state: "начало",
          param: "status",
          width: 182,
          height: 24,
          x: 8,
          y: 90,
        },
        "node-meta-param/2": {
          state: "конец",
          param: "status",
          width: 182,
          height: 24,
          x: 8,
          y: 90,
        },
      },
    },
  ],
])
