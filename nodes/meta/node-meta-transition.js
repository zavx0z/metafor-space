import {MetaFor} from "../../metafor.js"
import "./node-meta-condition.js"
import {conditionId, conditionPortId, parseConditionPortId} from "../id.js"
import {operatorSymbols} from "../operators.js"

export default MetaFor("node-meta-transition")
  .states('init', 'ready')
  .context(t => ({
    conditions: t.array({default: []})
  }))
  .core(() => /**@type{import("./node-meta-transition.t.js").Core}*/({
    conditions: null
  }))
  .view({
    render: ({html, context, repeat}) => repeat(context.conditions, c => html`
      <metafor-meta-condition id=${c}/>
    `),
    style: ({css}) => css`
      :host {
        --shadow-size: 0.5 !important;
        --background-color: rgba(var(--surface-400)) !important;
        position: absolute;
        display: flex;
        border-radius: 4px;
        flex-direction: column;
        align-items: stretch;
        gap: 2px;
        width: auto;
      }
    `
  })
  .transitions('init', [
    {
      in: "init",
      action: ({core, update}) => {

      },
      to: [{state: "ready", when: {conditions: {isEmpty: false}}}]
    }
  ])
  .reactions([])
  .create()

/** @type{import("./node-meta-transition.t").extractTransitions} */
export const extractTransitions = snapshot => {
  return assignContent(extractBaseConditions(snapshot), snapshot)
}

/** @type{import("./node-meta-transition.t").assignContent} */
const assignContent = (transitionsConditionsPorts, snapshot) => {
  return transitionsConditionsPorts.map(condition => ({
    id: condition.id,
    ports: condition.ports.map(port => {
      const {from, to, condition} = parseConditionPortId(port.id)
      const transition = snapshot.transitions.find(c => c.in === from)
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

/** @type{import("./node-meta-transition.t").extractBaseConditions} */
export const extractBaseConditions = snapshot => {

  /** @type{Map<string, import("./node-meta-transition.t").TransitionConditionsPorts>} */
  let conditions = new Map()

  snapshot.states.map(state => {
    for (const transition of snapshot.transitions) {
      if (transition.in !== state) {
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
                  from: transition.in,
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