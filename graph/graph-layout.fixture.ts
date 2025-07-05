import type {MetricsMap, LayoutConfig} from "./graph-layout.t";

export const config: LayoutConfig = {
  base: {
    "elk.layered.spacing.edgeEdgeBetweenLayers": 20,
    "elk.spacing.edgeEdge": 20,
    "elk.spacing.edgeNode": 20,
    "hierarchyHandling": "INCLUDE_CHILDREN",
    "elk.layered.layering.strategy": "LONGEST_PATH_SOURCE",
    "elk.padding": "[top=20.0, left=20.0, bottom=20.0, right=20.0]",
    "considerModelOrder.strategy": "PREFER_NODES",
    "elk.port.size": 12,
    // "elk.direction": "DOWN"
  },
  meta: {
    "elk.padding": "[top=0.0, left=0.0, bottom=0.0, right=0.0]",
    "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  },
  state: {
    "portConstraints": "FIXED_POS",
  },
  condition: {},
  operator: {
    "portConstraints": "FIXED_SIDE",
    "portAlignment.west": "JUSTIFIED",
    "portAlignment.east": "JUSTIFIED",
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
      "states": {
        "graph-context/1": {
          "state": "конец",
          "width": 238,
          "height": 128,
          "x": 0,
          "y": 40
        },
        "graph-context/2": {
          "state": "в процессе",
          "width": 238,
          "height": 128,
          "x": 0,
          "y": 40
        },
        "graph-context/3": {
          "state": "начало",
          "width": 238,
          "height": 128,
          "x": 0,
          "y": 40
        }
      },
      "conditions": {
        "graph-condition/1": {
          "from": "начало",
          "param": "status",
          "to": "конец",
          "width": 84,
          "height": 32
        },
        "graph-condition/2": {
          "from": "начало",
          "param": "status",
          "to": "в процессе",
          "width": 108,
          "height": 32
        },
        "graph-condition/3": {
          "from": "конец",
          "param": "status",
          "to": "начало",
          "width": 89,
          "height": 32
        }
      },
      "sockets": {
        "graph-socket/1": {
          "state": "конец",
          "parent": "condition",
          "direction": "west",
          "param": "status",
          "size": 12,
          "x": -6,
          "y": 50
        },
        "graph-socket/2": {
          "state": "конец",
          "parent": "condition",
          "direction": "east",
          "param": "status",
          "size": 12,
          "x": 78,
          "y": 50
        },
        "graph-socket/3": {
          "state": "конец",
          "parent": "state",
          "direction": "west",
          "param": "status",
          "size": 12,
          "x": -6,
          "y": 100
        },
        "graph-socket/4": {
          "state": "конец",
          "parent": "state",
          "direction": "east",
          "param": "status",
          "size": 12,
          "x": 232,
          "y": 100
        },
        "graph-socket/5": {
          "state": "конец",
          "parent": "state",
          "direction": "west",
          "param": "error",
          "size": 12,
          "x": -6,
          "y": 136
        },
        "graph-socket/6": {
          "state": "конец",
          "parent": "state",
          "direction": "east",
          "param": "error",
          "size": 12,
          "x": 232,
          "y": 136
        },
        "graph-socket/7": {
          "state": "в процессе",
          "parent": "condition",
          "direction": "west",
          "param": "status",
          "size": 12,
          "x": -6,
          "y": 50
        },
        "graph-socket/8": {
          "state": "в процессе",
          "parent": "condition",
          "direction": "east",
          "param": "status",
          "size": 12,
          "x": 102,
          "y": 50
        },
        "graph-socket/9": {
          "state": "в процессе",
          "parent": "state",
          "direction": "west",
          "param": "status",
          "size": 12,
          "x": -6,
          "y": 100
        },
        "graph-socket/10": {
          "state": "в процессе",
          "parent": "state",
          "direction": "east",
          "param": "status",
          "size": 12,
          "x": 232,
          "y": 100
        },
        "graph-socket/11": {
          "state": "в процессе",
          "parent": "state",
          "direction": "west",
          "param": "error",
          "size": 12,
          "x": -6,
          "y": 136
        },
        "graph-socket/12": {
          "state": "в процессе",
          "parent": "state",
          "direction": "east",
          "param": "error",
          "size": 12,
          "x": 232,
          "y": 136
        },
        "graph-socket/13": {
          "state": "начало",
          "parent": "condition",
          "direction": "west",
          "param": "status",
          "size": 12,
          "x": -6,
          "y": 50
        },
        "graph-socket/14": {
          "state": "начало",
          "parent": "condition",
          "direction": "east",
          "param": "status",
          "size": 12,
          "x": 83,
          "y": 50
        },
        "graph-socket/15": {
          "state": "начало",
          "parent": "state",
          "direction": "west",
          "param": "status",
          "size": 12,
          "x": -6,
          "y": 100
        },
        "graph-socket/16": {
          "state": "начало",
          "parent": "state",
          "direction": "east",
          "param": "status",
          "size": 12,
          "x": 232,
          "y": 100
        },
        "graph-socket/17": {
          "state": "начало",
          "parent": "state",
          "direction": "west",
          "param": "error",
          "size": 12,
          "x": -6,
          "y": 136
        },
        "graph-socket/18": {
          "state": "начало",
          "parent": "state",
          "direction": "east",
          "param": "error",
          "size": 12,
          "x": 232,
          "y": 136
        }
      },
      "params": {
        "graph-param/1": {
          "state": "конец",
          "param": "status",
          "width": 222,
          "height": 32
        },
        "graph-param/2": {
          "state": "конец",
          "param": "error",
          "width": 222,
          "height": 32
        },
        "graph-param/3": {
          "state": "в процессе",
          "param": "status",
          "width": 222,
          "height": 32
        },
        "graph-param/4": {
          "state": "в процессе",
          "param": "error",
          "width": 222,
          "height": 32
        },
        "graph-param/5": {
          "state": "начало",
          "param": "status",
          "width": 222,
          "height": 32
        },
        "graph-param/6": {
          "state": "начало",
          "param": "error",
          "width": 222,
          "height": 32
        }
      }
    }
  ],
])
