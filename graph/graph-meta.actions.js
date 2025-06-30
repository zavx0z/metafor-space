/**
 * Создает SVG путь с простыми скруглениями
 * @param {Point[]} points - Массив точек пути
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