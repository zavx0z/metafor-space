import { Meta } from "../index.js"

/**
 @param {Record<string, any>} snapshot
 @throws {Error}
 */
export function validateSnapshot(snapshot) {
  if (!snapshot.types) throw new Error("В снапшоте отсутствуют типы полей контекста")
  if (!snapshot.id || typeof snapshot.id !== "string")
    throw new Error("В снапшоте отсутствует или некорректно указан id частицы")
  if (!Array.isArray(snapshot.states) || snapshot.states.length === 0)
    throw new Error("В снапшоте отсутствуют или некорректно указаны состояния")
}

/**
 @template {import("../types/context.js").ContextDefinition} C
 @template {string} S
 @template {Record<string, unknown>} I

 @param {Record<string, any>} snapshot
 @returns {import('../index.js').Meta<S, C, I>}
 */
export function ParticleFromSnapshot(snapshot) {
  validateSnapshot(snapshot)
  const channel = new BroadcastChannel("channel")
  return new Meta({
    channel,
    id: snapshot.id,
    states: snapshot.states,
    contextDefinition: snapshot.types,
    transitions: snapshot.transitions,
    initialState: snapshot.state,
    contextData: snapshot.context,
    actions: {},
    core: () => /** @type {I} */ ({}),
    coreData: {},
    reactions: [],
    onTransition: () => {},
    destroy: () => {},
  })
}
