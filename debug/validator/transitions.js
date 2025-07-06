/**
 Проверяет возможность циклического перехода между состояниями
 
 @param {Object} params
 @param {string} params.fromState Исходное состояние
 @param {string} params.toState Целевое состояние
 @param {Record<string, any>} params.forwardConditions Условия прямого перехода
 @param {Record<string, any>} params.backwardConditions Условия обратного перехода
 @throws {Error} Если найдена циклическая зависимость
 */
function canCreateCycle({ fromState, toState, forwardConditions, backwardConditions }) {
  const commonFields = Object.keys(forwardConditions).filter((key) => key in backwardConditions)

  for (const field of commonFields) {
    const forward = forwardConditions[field]
    const backward = backwardConditions[field]

    // Если одно из условий null, а другое - конкретное значение
    if (
      (forward === null && backward !== null) ||
      (backward === null && forward !== null)
    ) {
      // Это валидный случай - нет цикла
      continue
    }

    // Если оба условия null
    if (forward === null && backward === null) {
      // Это валидный случай - нет цикла
      continue
    }

    // Если оба условия являются объектами
    if (forward && backward && typeof forward === "object" && typeof backward === "object") {
      // Если используются числовые диапазоны
      if ('gt' in forward || 'gte' in forward || 'lt' in forward || 'lte' in forward) {
        const forwardRange = {
          min: forward.gt ?? forward.gte ?? -Infinity,
          max: forward.lt ?? forward.lte ?? Infinity,
        }
        const backwardRange = {
          min: backward.gt ?? backward.gte ?? -Infinity,
          max: backward.lt ?? backward.lte ?? Infinity,
        }

        const hasGap = forwardRange.max < backwardRange.min || backwardRange.max < forwardRange.min
        if (!hasGap) {
          throw new Error(
            `Обнаружена потенциальная циклическая зависимость в meta между состояниями ` +
            `${fromState} и ${toState}.\nУсловия переходов для поля "${field}":\n` +
            `${fromState} -> ${toState}: ${JSON.stringify(forward)}\n` +
            `${toState} -> ${fromState}: ${JSON.stringify(backward)}\n` +
            `Диапазоны:\n` +
            `${fromState} -> ${toState}: (${forwardRange.min}, ${forwardRange.max})\n` +
            `${toState} -> ${fromState}: (${backwardRange.min}, ${backwardRange.max})\n` +
            `Условия должны иметь непересекающиеся диапазоны значений`
          )
        }
      }
      // Для других типов условий (например, isNull)
      else if (forward.isNull === false && backward === null) {
        // Это валидный случай - нет цикла
      }
      else if (forward === null && backward.isNull === false) {
        // Это валидный случай - нет цикла
      }
      else {
        throw new Error(
          `Обнаружена потенциальная циклическая зависимость в meta между состояниями ` +
          `${fromState} и ${toState}.\nУсловия переходов для поля "${field}":\n` +
          `${fromState} -> ${toState}: ${JSON.stringify(forward)}\n` +
          `${toState} -> ${fromState}: ${JSON.stringify(backward)}\n` +
          `Условия противоречат друг другу`
        )
      }
    }
    // Если условия имеют разные типы, но не null
    else if (forward !== backward) {
      // Это валидный случай - нет цикла
      continue
    }
  }
}

/**
 Проверяет циклические зависимости
 
 @param {Object} params
 @param {Array<import('../../types/transitions').Transition<any, any, any>>} params.transitions Массив переходов
 */
export function validateCycles({ transitions: transitionsList }) {
  /** @type {Map<string, Array<{state: string, conditions: Record<string, any>}>>} */
  const transitions = new Map()

  // Строим граф переходов
  transitionsList.forEach((transition) => {
    if (!transitions.has(transition.in)) {
      transitions.set(transition.in, [])
    }
    // Обработка нового формата: объект с ключами-состояниями
    if (!transition.to) return
    Object.entries(transition.to).forEach(([state, conditions]) => {
      transitions.get(transition.in)?.push({
        state,
        conditions: conditions || {},
      })
    })
  })

  /**
   Рекурсивно проверяет циклы в графе переходов

   @param {string} state Текущее состояние
   @param {Set<string>} visited Множество посещенных состояний
   @param {Array<{state: string, conditions: Record<string, any>}>} path Путь в графе
   */
  function checkCycles(state, visited = new Set(), path = []) {
    if (visited.has(state)) {
      const cycleStart = path.findIndex((p) => p.state === state)
      const cycle = path.slice(cycleStart)

      for (let i = 0; i < cycle.length; i++) {
        const current = cycle[i]
        const next = cycle[(i + 1) % cycle.length]

        const forwardTransitions = transitions.get(current.state) || []
        const forwardTransition = forwardTransitions.find((t) => t.state === next.state)

        const backwardTransitions = transitions.get(next.state) || []
        const backwardTransition = backwardTransitions.find((t) => t.state === current.state)

        if (forwardTransition && backwardTransition) {
          canCreateCycle({
            fromState: current.state,
            toState: next.state,
            forwardConditions: forwardTransition.conditions,
            backwardConditions: backwardTransition.conditions,
          })
        }
      }
      return
    }
    visited.add(state)
    const nextTransitions = transitions.get(state) || []
    for (const transition of nextTransitions)
      checkCycles(transition.state, visited, [...path, { state, conditions: transition.conditions }])
    visited.delete(state)
  }
  // Проверяем циклы из каждого состояния
  for (const state of transitions.keys()) checkCycles(state)
}
