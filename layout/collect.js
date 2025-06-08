/**
 * Собирает позиции нод состояний из layout
 * @param {import('elkjs').ElkNode} layout - ELK layout
 * @returns {Array<{id: string, x: number, y: number}>}
 */
export const collectNodePositions = layout => {
  return (layout.children || []).map(stateLayout => {
    const context = stateLayout.children?.find(node => node.id.endsWith("context"))
    return {
      id: stateLayout.id,
      x: Number(stateLayout.x) + Number(context?.x || 0),
      y: Number(stateLayout.y) + Number(context?.y || 0)
    }
  })
}

/**
 * Собирает все рёбра из layout
 * @param {import('elkjs').ElkNode} layout - ELK layout
 * @returns {Array<{id: string, points: Array<{x: number, y: number}>, type: string}>}
 */
export const collectEdges = layout => {
  const rootEdges = /**@type {import('elkjs').ElkExtendedEdge[]} */ (layout.edges || [])
  const stateEdges = /**@type {import('elkjs').ElkExtendedEdge[]} */ (
    (layout.children || []).flatMap(stateLayout => {
      return (stateLayout.edges || [])
        .map(edge => {
          const [section] = edge.sections || []
          if (!section) return
          //@ts-ignore
          const points = [addOffset(section.startPoint, stateLayout), ...(section.bendPoints || []).map(point => addOffset(point, stateLayout)), addOffset(section.endPoint, stateLayout)]

          return {
            ...edge,
            sections: [
              {
                ...section,
                startPoint: points[0],
                bendPoints: points.slice(1, -1),
                endPoint: points[points.length - 1]
              }
            ]
          }
        })
        .filter(Boolean)
    })
  )

  return [...rootEdges, ...stateEdges].map(edge => {
    const [section] = edge.sections || []
    const points = [section.startPoint, ...(section.bendPoints || []), section.endPoint]

    const isEastToInput = edge.sources[0].includes("east") && edge.targets[0].includes("input")
    const isWestConnection = edge.sources[0].includes("west")

    const type = isEastToInput ? "east-input" : isWestConnection ? "west" : "other"

    return {
      id: edge.id,
      points,
      type
    }
  })
}

/**
 * Добавляет смещение состояния к точке
 * @param {{x: number, y: number}} point
 * @param {{x: number, y: number}} stateLayout
 * @returns {{x: number, y: number}}
 */
const addOffset = (point, stateLayout) => ({
  x: point.x + stateLayout.x,
  y: point.y + stateLayout.y
})
