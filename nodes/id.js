/** @param {import('./types/id').BasePortParams} params */
export const contextParameterId = ({atom, state, param}) => `/${atom.replace("/", "")}/${state}/${param}`

/**
 * @param {string} id
 * @returns {import('./types/id').BasePortParams}
 */
export const parseContextParameterId = id => {
  const [, atom, state, param] = id.split("/")
  return {atom, state, param}
}

/** @param {import('./types/id').ContextPortParams} params */
export const contextPortId = ({atom, state, param, direction}) => `/${atom.replace("/", "")}/${state}/${param}/${direction}`

/**
 * @param {string} id
 * @returns {import('./types/id').ContextPortParams}
 */
export const parseContextPortId = id => {
  const [, atom, state, param, dir] = id.split("/")
  const direction = dir === "input" || dir === "output" ? dir : "input"
  return {atom, state, param, direction}
}

/** @param {import('./types/id').TriggerPortParams} params */
export const conditionPortId = ({meta, from, to, condition, direction}) => `/${meta.replace("/", "")}/${from}/${to}/${condition}/${direction}`

/**
 * @param {string} id
 * @returns {import('./types/id').TriggerPortParams}
 */
export const parseTriggerPortId = id => {
  const [, atom, from, to, param, dir] = id.split("/")
  const direction = dir === "east" || dir === "west" ? dir : "west"
  return {meta: atom, from, to, condition: param, direction}
}

/** @param {import('./types/id').EdgeParams} params */
export const edgeId = ({sourceId, targetId}) => `${sourceId} -> ${targetId}`

/**
 * @param {string} id
 * @returns {import('./types/id').EdgeParams}
 */
export const parseEdgeId = id => {
  const [sourceId, targetId] = id.split(" -> ")
  return {sourceId, targetId}
}

/** @param {import('./types/id').StateParams} params */
export const stateId = ({atom, state}) => `/${atom.replace("/", "")}/${state}`

/**
 * @param {string} id
 * @returns {import('./types/id').StateParams}
 */
export const parseStateId = id => {
  const [, atom, state] = id.split("/")
  return {atom, state}
}

/** @param {import('./types/id').StateParams} params */
export const contextId = ({atom, state}) => `/${atom.replace("/", "")}/${state}/context`

/**
 * @param {string} id
 * @returns {import('./types/id').StateParams}
 */
export const parseContextId = id => {
  const [, atom, state] = id.split("/")
  return {atom, state}
}

/** @param {import('./types/id').TriggerParams} params */
export const conditionId = ({meta, state, condition}) => `/${meta.replace("/", "")}/${state}/${condition}/condition`

/**
 * @param {string} id
 * @returns {import('./types/id').TriggerParams}
 */
export const parseTriggerId = id => {
  const [, atom, state, param] = id.split("/")
  return {meta: atom, state, condition: param}
}

/** @param {import('./types/id').TriggerParameterParams} params */
export const triggerParameterId = ({atom, from, to, param}) => `/${atom.replace("/", "")}/${from}/${to}/${param}`

/**
 * @param {string} id
 * @returns {import('./types/id').TriggerParameterParams}
 */
export const parseTriggerParameterId = id => {
  const [, atom, from, to, param] = id.split("/")
  return {atom, from, to, param}
}

/** @param {import('./types/id').AtomParams} params */
export const atomId = ({atom}) => `/${atom.replace("/", "")}`

/** @param {string} id */
export const parseAtomId = id => {
  const [, atom] = id.split("/")
  return {atom}
}
export default {
  contextParameterId,
  parseContextParameterId,
  contextPortId,
  parseContextPortId,
  triggerPortId: conditionPortId,
  parseTriggerPortId,
  edgeId,
  parseEdgeId,
  stateId,
  parseStateId,
  contextId,
  parseContextId,
  triggerId: conditionId,
  parseTriggerId,
  triggerParameterId,
  parseTriggerParameterId,
  atomId,
  parseAtomId
}
