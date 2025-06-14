/**
 * Собирает позиции триггеров из layout
 * @param {import('elkjs').ElkNode} layout - ELK layout
 * @returns {Array<{
 *   id: string,
 *   x: number,
 *   y: number
 * }>}
 */
export const collectTriggerPositions = layout => {
  return (layout.children || []).flatMap(stateLayout => {
    return (stateLayout.children || [])
      .filter(child => child.id.includes("trigger"))
      .map(triggerNode => ({
        id: triggerNode.id,
        x: Number(stateLayout.x) + Number(triggerNode.x),
        y: Number(stateLayout.y) + Number(triggerNode.y)
      }))
  })
}

/**
 * Собирает параметры триггеров из layout
 * @param {import('elkjs').ElkNode} layout - ELK layout
 * @returns {Map<string, Array<{
 *   id: string,
 *   position: number
 * }>>}
 */
export const collectTriggerParameters = layout => {
  const paramMap = new Map()
  ;(layout.children || []).flatMap(stateLayout => {
    return (stateLayout.children || [])
      .filter(child => child.id.includes("trigger"))
      .filter(child => child.id.includes("trigger"))
      .map(triggerNode => {
        /** @type {number[]} */
        const yPositions = (triggerNode.children || []).map(p => Number(p.y))
        const uniqueYPositions = [...new Set(yPositions)].sort((a, b) => a - b)

        paramMap.set(
          triggerNode.id,
          (triggerNode.children || []).map(param => {
            return {
              id: param.id,
              position: uniqueYPositions.indexOf(Number(param.y))
            }
          })
        )
      })
  })
  return paramMap
}
