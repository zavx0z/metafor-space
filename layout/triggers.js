import {parseTriggerPortId, triggerId, triggerPortId} from "../graph/id.js"
import {operatorSymbols} from "../graph/operators.js"

/**
 * Извлекает информацию о триггерах из снимка состояния атома.
 *
 * @param {QMachineSnapshot} snapshot
 *
 * @returns {Array<{
 *   id: string,
 *   ports: Array<{
 *     id: string,
 *     content: {
 *       symbol: string,
 *       title: string,
 *       value: any
 *     }
 *   }>
 * }>} Массив объектов триггеров
 */
const extractBaseTriggers = snapshot => {
  let triggers = new Map()
  snapshot.states.map(state => {
    for (const collapse of snapshot.collapses) {
      if (collapse.from !== state) {
        for (const target of collapse.to) {
          if (target.state === state) {
            for (const param of Object.keys(target.trigger)) {
              const id = triggerId({atom: snapshot.id, state: state, param})
              let trigger = triggers.get(id)
              if (!trigger) {
                triggers.set(id, {id: id, ports: []})
                trigger = triggers.get(id)
              }

              trigger.ports.push({
                id: triggerPortId({
                  atom: snapshot.id,
                  from: collapse.from,
                  to: target.state,
                  param,
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
/**
 *
 * @param {Array<{
 *   id: string,
 *   ports: Array<{
 *     id: string,
 *     content: {
 *       symbol: string,
 *       title: string,
 *       value: any
 *     }
 *   }>
 * }>} triggers
 * @param {QMachineSnapshot} snapshot
 * @returns {*}
 */
const assignContent = (triggers, snapshot) => {
  return triggers.map(trigger => ({
    ...trigger,
    ports: trigger.ports.map(port => {
      const {from, to, param} = parseTriggerPortId(port.id)
      const collapse = snapshot.collapses.find(c => c.from === from)
      const target = collapse?.to.find(t => t.state === to)
      if (!target) throw new Error(`Не удалось найти целевой переход для ${port.id}`)

      const content = target.trigger[param]
      /** @type {Record<string, { symbol: string; title: string; value: any }>} */
      const operators = {}
      if (typeof content === "object" && content !== null) {
        for (const operatorKey of Object.keys(content)) {
          const operator = operatorSymbols.get(operatorKey)
          if (!operator) throw new Error(`Неизвестный оператор: ${operatorKey}`)
          operators[operatorKey] = {
            symbol: operator.symbol,
            title: operator.title,
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
 * @param {QMachineSnapshot} snapshot
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
  return assignContent(extractBaseTriggers(snapshot), snapshot)
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
