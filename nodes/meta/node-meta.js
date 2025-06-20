import {MetaFor} from "../../metafor.js"
import "./node-meta-state.js"
import "./node-meta-transition.js"
import {conditionId, conditionPortId, parseConditionPortId} from "../id.js"
import {operatorSymbols} from "../operators.js"

export default MetaFor("node-meta", {development: true, description: "Node"})
  .states("init", "ready")
  .context(t => ({
    title: t.string({title: "Заголовок", nullable: true}),
    states: t.array({title: "Состояния", default: []}),
    transitions: t.array({title: "Переходы", default: []})
  }))
  .core(() => /**@type{import("./node-meta.t").Core}*/ ({
    snapshot: null,
    transitions: []
  }))
  .view({
    render: ({html, context, core, repeat}) => html`
      <header data-drag-selector="graph-atom">
        <div><!--кнопки слева--></div>
        <h2 class="noselect">${context.title}</h2>
        <div><!--кнопки справа-->
          <button aria-label="Редактировать">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor">
              <path
                d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"/>
            </svg>
          </button>
        </div>
      </header>
      <section class="content" data-drag-selector="graph-atom">
        <atom-svg></atom-svg>
        ${repeat(context.transitions, i => html`
          <metafor-node-meta-transition
            id=${i}
            .core=${{conditions: core.transitions.find(t => t.id === i)?.ports}}
          />`)}
        ${repeat(context.states, i => html`
          <metafor-node-meta-state
            id=${i}
            .context=${{title: i}}
            .core=${{
              data: {
                types: core.snapshot?.types,
                context: core.snapshot?.context,
              }
            }}
          />
        `)}
      </section>
    `,
    style: ({css}) => {
      const width = "444px"
      const height = "444px"
      const borderRadius = "7px"
      return css`
        :host {
          --font-color: rgb(var(--surface-50));
          --background-color: rgba(var(--surface-100) / calc(var(--background-alpha) * 0.1));

          position: absolute;
          display: flex;
          flex-direction: column;
          min-width: fit-content;
          user-select: none;
          will-change: transform;
          box-sizing: border-box;
          border-radius: ${borderRadius};

          opacity: 0;
          transition: opacity 1s ease-in-out;
        }

        :host(.theme-dark) {
          --background-color: rgba(var(--surface-900) / var(--background-alpha));
        }

        :host([data-state="ready"]) {
          opacity: 1;
        }

        header {
          --background-color: rgba(var(--surface-500) / var(--background-alpha));

          position: relative;
          padding: 8px 6px;
          z-index: 2;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--background-color);
          box-sizing: border-box;
          user-select: none;
          border-top-left-radius: inherit;
          border-top-right-radius: inherit;

          & > div:first-child {
            flex: 1;
            display: flex;
            gap: 4px;
            padding-left: 4px;
          }

          & > h2 {
            flex: 1;
            text-align: center;
            margin: 0;
            padding: 0;
          }

          & > div:last-child {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            padding-right: 4px;
            gap: 4px;
          }

          button {
            background: none;
            border: none;
            padding: 4px;
            cursor: pointer;
            border-radius: 4px;
            color: var(--font-color);

            &:hover {
              background-color: rgba(0, 0, 0, 0.05);
            }

            & svg {
              display: block;
            }
          }
        }

        section {
          display: flex;
          position: relative;
          background-color: var(--background-color);
          width: ${width};
          height: ${height};
          border-bottom-right-radius: inherit;
          border-bottom-left-radius: inherit;
        }

        svg.connections path {
          &.next {
            stroke: rgb(var(--secondary-500));
          }

          &.active {
            stroke: rgb(var(--secondary-500));
          }

          &.preview {
            stroke: rgb(var(--primary-500));
          }
        }
      `
    }
  })
  .transitions("init", [
    {
      in: "init",
      action: ({update, core}) => {
        if (core.snapshot) {
          const transitions = extractTransitions(core.snapshot)
          core.transitions = transitions
          update({
            transitions: transitions.map(i => i.id),
            states: [...core.snapshot?.states]
          })
        }
      },
      to: [{
        state: "ready", when: {
          title: {isNull: false},
          states: {isEmpty: false},
          transitions: {isEmpty: false}
        }
      }]
    },
    {
      in: "ready",
      action: ({core}) => {
        requestAnimationFrame(() => {
          core.snapshot = null
          core.transitions = []
        })
      },
      to: [{state: "init", when: {title: null}}]
    }
  ])
  .reactions([
    {
      filter: ({meta, context}) => meta.tag === context.title,
      action: ({meta, patch}) => {
        // console.log("Node reaction", meta, patch)
      }
    }
  ])
  .create({})

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