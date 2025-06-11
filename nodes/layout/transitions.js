import {parseTriggerPortId, conditionId, conditionPortId} from "../id.js"
import {operatorSymbols} from "../operators.js"

/** @type{import("./transitions").extractBaseConditions} */
export const extractBaseConditions = snapshot => {

  /** @type{Map<string, import("./transitions").TransitionConditionsPorts>} */
  let triggers = new Map()

  snapshot.states.map(state => {
    for (const transition of snapshot.transitions) {
      if (transition.from !== state) {
        for (const target of transition.to) {
          if (target.state === state) {
            for (const condition of Object.keys(target.when)) {
              const id = conditionId({meta: snapshot.id, state, condition})
              let trigger = triggers.get(id)
              if (!trigger) {
                triggers.set(id, {id, ports: []})
                trigger = triggers.get(id)
              }

              trigger?.ports.push({
                id: conditionPortId({
                  meta: snapshot.id,
                  from: transition.from,
                  to: target.state,
                  condition: condition,
                  direction: "west"
                })
              })
            }
          }
        }
      }
    }
  })
  return Array.from(triggers.values())
}

/** @type{import("./transitions").assignContent} */
const assignContent = (triggers, snapshot) => {
  return triggers.map(trigger => ({
    ...trigger,
    ports: trigger.ports.map(port => {
      const {from, to, condition} = parseTriggerPortId(port.id)
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
/**
 * @param {SnapshotMetaForAny} snapshot
 * @returns {Array<{
 *   id: string,
 *   ports: Array<{
 *     id: string,
 *     operators: {
 *       [key: string]: {
 *         symbol: string,
 *         title: string,
 *         value: any
 *       }
 *     }
 *   }>
 * }>}
 */
export const extractTriggers = snapshot => {
  return assignContent(extractBaseConditions(snapshot), snapshot)
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
