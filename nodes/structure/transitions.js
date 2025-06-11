import {parseConditionPortId, conditionId, conditionPortId} from "../id.js"
import {operatorSymbols} from "../operators.js"

/** @type{import("./transitions.js").extractTransitions} */
export const extractTransitions = snapshot => {
  return assignContent(extractBaseConditions(snapshot), snapshot)
}

/** @type{import("./transitions.js").assignContent} */
const assignContent = (transitionsConditionsPorts, snapshot) => {
  return transitionsConditionsPorts.map(condition => ({
    id: condition.id,
    ports: condition.ports.map(port => {
      const {from, to, condition} = parseConditionPortId(port.id)
      const transition = snapshot.transitions.find(c => c.from === from)
      const target = transition?.to.find(t => t.state === to)
      if (!target) throw new Error(`Не удалось найти целевой переход для ${port.id}`)

      const content = target.when[condition]
      /** @type {Record<string, { symbol: string; title: string; value: any }>} */
      const operators = {}
      if (typeof content === "object" && content !== null) {
        for (const operatorKey of Object.keys(content)) {
          const operator = operatorSymbols.get(operatorKey)
          if (!operator) throw new Error(`Неизвестный оператор: ${operatorKey}`)
          operators[operatorKey] = {
            symbol: operator.symbol,
            title: operator.title,
            // @ts-ignore
            value: content[operatorKey]
          }
        }
      } else {
        const eqOperator = operatorSymbols.get("eq")
        if (!eqOperator) throw new Error("Оператор eq не найден")
        operators.eq = {
          symbol: eqOperator.symbol,
          title: eqOperator.title,
          value: content
        }
      }
      return {...port, operators}
    })
  }))
}

/** @type{import("./transitions.js").extractBaseConditions} */
export const extractBaseConditions = snapshot => {

  /** @type{Map<string, import("./transitions.js").TransitionConditionsPorts>} */
  let conditions = new Map()

  snapshot.states.map(state => {
    for (const transition of snapshot.transitions) {
      if (transition.from !== state) {
        for (const target of transition.to) {
          if (target.state === state) {
            for (const condition of Object.keys(target.when)) {
              const id = conditionId({meta: snapshot.id, state, condition})
              let cond = conditions.get(id)
              if (!cond) {
                conditions.set(id, {id, ports: []})
                cond = conditions.get(id)
              }

              cond?.ports.push({
                id: conditionPortId({
                  meta: snapshot.id,
                  from: transition.from,
                  to: target.state,
                  condition,
                  direction: "west"
                })
              })
            }
          }
        }
      }
    }
  })
  return Array.from(conditions.values())
}

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
