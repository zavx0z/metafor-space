/**
 * Создает SVG путь с простыми скруглениями
 * @param {import('./graph-meta.t').Point[]} points - Массив точек пути
 * @param {number} radius - Радиус скругления углов
 * @returns {string} SVG path data
 */
export function getSimpleRoundedPath(points, radius) {
  if (points.length < 2) return ""

  /** @type {string[]} */
  const path = []

  // Начальная точка
  path.push(`M ${points[0].x} ${points[0].y}`)

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const next = points[i + 1]

    if (prev.y === curr.y) { // Горизонтальный сегмент
      path.push(`L ${curr.x - Math.sign(curr.x - prev.x) * radius} ${curr.y}`)
      path.push(`Q ${curr.x} ${curr.y} ${curr.x} ${curr.y + Math.sign(next.y - curr.y) * radius}`)
    } else { // Вертикальный сегмент
      path.push(`L ${curr.x} ${curr.y - Math.sign(curr.y - prev.y) * radius}`)
      path.push(`Q ${curr.x} ${curr.y} ${curr.x + Math.sign(next.x - curr.x) * radius} ${curr.y}`)
    }
  }

  // Последний сегмент
  const last = points[points.length - 1]
  path.push(`L ${last.x} ${last.y}`)

  return path.join(" ")
}

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