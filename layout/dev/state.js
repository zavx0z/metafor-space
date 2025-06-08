import {Atom, t} from "../../machine/atom.js"
import "../../graph/components/quantum-graph.js"
import "../../graph/components/state/graph-state.js"
import "../../graph/components/atom/graph-atom.js"
import ID, {stateId} from "../../graph/id.js"
import ELK from "elkjs"

const channel = new BroadcastChannel("channel")
channel.onmessage = /** @param {MessageEvent<BroadcastMessage>} event */ ({data}) => {
  console.log(data.meta.target, data.meta.func, data.patch.value)
}

const atom = Atom("layout-test")
  .states("НАЧАЛО", "КОНЕЦ")
  .context({
    param1: t.string({title: "Param 1", default: "value1"}),
    param2: t.string({title: "Param 2"})
  })
  .collapses([
    {
      from: "НАЧАЛО",
      action: "first",
      to: [{state: "КОНЕЦ", trigger: {param1: "value1"}}]
    },
    {
      from: "КОНЕЦ",
      to: [{state: "НАЧАЛО", trigger: {param2: "value2"}}]
    }
  ])
  .core()
  .actions({})
  .create({state: "НАЧАЛО"})

const snapshot = atom.snapshot()

const graph = /** @type {QGraph} */ (document.querySelector("quantum-graph"))

const elk = new ELK()
const viewportElement = /** @type {QViewport} */ (document.querySelector("quantum-viewport"))

/**
 * @param {HTMLElement} component - Компонент в который будет вставлен HTML
 * @returns {HTMLElement}
 */
const layout = /** @type {HTMLElement} */ (
  html`
    <div>
      <svg class="connections"></svg>
      ${snapshot.states.map(state => {
        const stateId = ID.stateId({atom: atom.id, state: state})
        return html`
          <graph-state id="${stateId}" name="${state}"></graph-state>
        `()
      })}
    </div>
  `(graph.viewport.content)
)

const stateElements = /** @type {NodeListOf<QGraphState>} */ (document.querySelectorAll("graph-state"))
const metrics = /** @type {{id: string, width: number, height: number}[]}[] */ ([])
stateElements.forEach(state => {
  metrics.push({
    id: state.id,
    width: state.clientWidth,
    height: state.clientHeight
  })
})

/**
 * @type {object} Состояния для ELK
 * @property {string} id - Идентификатор состояния
 * @property {object} data - Данные состояния
 * @property {string} data.label - Название состояния
 * @property {object[]} children - Дочерние состояния
 */
const elkLayoutStates = {
  id: "root",
  children: snapshot.states.map(state => {
    const stateId = ID.stateId({atom: atom.id, state: state})
    return {
      id: stateId,
      width: metrics.find(metric => metric.id === stateId)?.width,
      height: metrics.find(metric => metric.id === stateId)?.height,
      children: []
    }
  })
}

const elkLayout = /** @type {import('elkjs').ElkNode} */ (await elk.layout(/**@type {import('elkjs').ElkNode} */ (elkLayoutStates)))

stateElements.forEach(state => {
  const {atom: atomName, state: stateName} = ID.parseStateId(state.id)
  const elkState = elkLayout.children?.find(elkState => elkState.id === state.id)
  state.style.transform = `translate(${elkState?.x}px, ${elkState?.y}px)`
})

console.log(elkLayout)
viewportElement.centerOnElement(/** @type {HTMLElement} */ (document.querySelector("graph-state")), {maxWidth: "40%"})
