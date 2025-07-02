/**
 * Собирает все рёбра из layout
 * @param {import("./graph-layout.t").TypedLayoutResult} layout - ELK layout
 * @returns {import('./graph-meta.t').Edge[]} Массив рёбер с типами
 */
export const collectEdges = layout => {
  const rootEdges = /**@type {import('elkjs').ElkExtendedEdge[]} */ (layout.edges || []).map(/**@type{import('elkjs').ElkExtendedEdge}*/edge=>{
    // console.log(edge)
    return edge
  })
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
  return [
    ...rootEdges.map(edge => {
      const [section] = edge.sections || []
      const points = [section.startPoint, ...(section.bendPoints || []), section.endPoint]
      /** @type {'east-input' | 'west' | 'other'} */
      let type
      if (edge.sources[0].includes("east") && edge.targets[0].includes("input")) type = "east-input"
      else if (edge.sources[0].includes("west")) type = "west"
      else type = "other"
      return {
        id: edge.id,
        points,
        type,
        sources: edge.sources,
        targets: edge.targets
      }
    }),
    ...stateEdges.map(edge => {
      const [section] = edge.sections || []
      const points = [section.startPoint, ...(section.bendPoints || []), section.endPoint]
      /** @type {'east-input' | 'west' | 'other'} */
      let type
      if (edge.sources[0].includes("east") && edge.targets[0].includes("input")) type = "east-input"
      else if (edge.sources[0].includes("west")) type = "west"
      else type = "other"
      return {
        id: edge.id,
        points,
        type,
        sources: edge.sources,
        targets: edge.targets
      }
    })
  ].flat()
}

/**
 * Добавляет смещение состояния к точке
 * @param {import('./graph-meta.t').Point} point
 * @param {import('./graph-meta.t').Point} stateLayout
 * @returns {import('./graph-meta.t').Point}
 */
const addOffset = (point, stateLayout) => ({
  x: point.x + stateLayout.x,
  y: point.y + stateLayout.y
})