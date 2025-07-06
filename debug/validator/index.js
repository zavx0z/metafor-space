import { validateContextDefinition as validateContextDefinitionNotWrapped } from "./context.js"
import { validateCore as validateCoreNotWrapped } from "./core.js"
import { validateCycles } from "./transitions.js"
import { validateTriggers } from "./trigger.js"
// import { validateParticleOptions as validateParticleOptionsNotWrapped } from "./create.js"
import { validateStates as validateStatesNotWrapped } from "./state.js"

const channel = new BroadcastChannel("validator")

/** @param {{data: {destroy: boolean}}} params */
channel.onmessage = ({ data }) => {
  if (data.destroy) {
    setTimeout(() => {
      channel.close()
    }, 1000)
  }
}

/**
 @typedef {Object} Message
 @property {string} id Идентификатор частицы
 @property {string} message Сообщение
 @property {"actions" | "triggers" | "transitions" | "states" | "debug" | "create"} src Источник сообщения
 */

/**
 Отправляет сообщение об ошибке

 @param {Message} message Сообщение об ошибке
 */
function sendError(message) {
  channel.postMessage({ ...message, type: "error" })
}

/**
 Отправляет предупреждение

 @param {Message} message Сообщение предупреждения
 */
function sendWarning(message) {
  channel.postMessage({ ...message, type: "warning" })
}

// @ts-expect-error
export function validateContextDefinition({ tag, context }) {
  try {
    validateContextDefinitionNotWrapped(context)
  } catch (error) {
    const { message } = /**@type {Error}*/ (error)
    channel.postMessage({ id: tag, message })
  }
}

/**
 Преобразует объектный формат переходов в массив для валидации

 @param {Record<string, any>} objectTransitions - Переходы в объектном формате
 @returns {Array<any>} Переходы в массиве
 */
function convertObjectToArrayFormat(objectTransitions) {
  return Object.entries(objectTransitions).map(([state, transition]) => ({
    in: state,
    to: transition.to || {},
    action: transition.action,
    success: transition.success,
    error: transition.error
  }))
}

/**
 Валидация переходов

 @param {Object} params Параметры валидации
 @param {string} params.tag Имя частицы
 @param {Record<string, any> | Array<import('../../types/transitions').Transition<any, any, any, any>>} params.transitions Переходы в объектном или массивном формате
 @param {import('../../types/context').ContextDefinition} params.contextDefinition Определение контекста
 */
export function validateTransitions({ tag, transitions, contextDefinition }) {
  // Преобразуем объектный формат в массив для валидации
  let transitionsArray
  if (Array.isArray(transitions)) {
    transitionsArray = transitions
  } else if (typeof transitions === 'object' && transitions !== null) {
    transitionsArray = convertObjectToArrayFormat(transitions)
  } else {
    sendError({
      id: tag,
      message: `Transitions должен быть объектом или массивом, получено: ${typeof transitions}`,
      src: "transitions",
    })
    return
  }

  if (transitionsArray.length === 0) {
    sendWarning({ id: tag, message: "Переходы отсутствуют. Мета не будет менять состояние.", src: "transitions" })
    return
  }

  // Проверка наличия обязательных полей
  transitionsArray.forEach((transition, index) => {
    if (!transition.in) {
      sendError({
        id: tag,
        message: `Отсутствует обязательное поле 'in' в transitions[${index}]`,
        src: "transitions",
      })
    }

    if (!transition.to) {
      sendError({ id: tag, message: `Отсутствует обязательное поле 'to' в transitions[${index}]`, src: "transitions" })
    } else if (typeof transition.to !== 'object' || Array.isArray(transition.to)) {
      sendError({ id: tag, message: `Поле 'to' должно быть объектом в transitions[${index}]`, src: "transitions" })
    } else {
      Object.entries(transition.to).forEach(([state, conditions], toIndex) => {
        if (!state) {
          sendError({
            id: tag,
            message: `Отсутствует состояние в transitions[${index}].to[${toIndex}]`,
            src: "transitions",
          })
        }
        if (!conditions || typeof conditions !== 'object') {
          sendError({
            id: tag,
            message: `Отсутствуют условия для состояния '${state}' в transitions[${index}].to[${toIndex}]`,
            src: "transitions",
          })
        }
      })
    }
  })

  // Проверка на циклы
  validateCycles({ transitions: transitionsArray })

  // Валидация триггеров
  try {
    validateTriggers({ tag, transitions: transitionsArray, contextDefinition })
  } catch (error) {
    const { message } = /**@type {Error}*/ (error)
    sendError({ id: tag, message, src: "triggers" })
  }
}

/**
 Проверяет корректность конфигурации ядра

 @param {Object} params Параметры валидации
 @param {string} params.tag Идентификатор частицы
 @param {import('../../types/core').CoreDefinition<any, any>} params.core Конфигурация ядра
 @throws {Error} Если найдены ошибки в конфигурации ядра
 */
export function validateCore({ tag, core }) {
  try {
    validateCoreNotWrapped(core)
  } catch (error) {
    const { message } = /**@type {Error}*/ (error)
    sendError({ id: tag, message, src: "core" })
  }
}

/**
 Проверяет корректность конфигурации частицы

 @param {Object} params Параметры валидации
 @param {string} params.tag Идентификатор частицы
 @param {string[]} params.states Состояния частицы
 @throws {Error} Если найдены ошибки в конфигурации частицы
 */
export function validateCreateOptions({ tag,  states }) {
  try {
    // validateParticleOptionsNotWrapped({ options, states })
  } catch (error) {
    const { message } = /**@type {Error}*/ (error)
    sendError({ id: tag, message, src: "create" })
  }
}

/**
 Проверяет корректность состояний частицы

 @param {Object} params Параметры валидации
 @param {string} params.tag Идентификатор частицы
 @param {string[]} params.states Массив состояний
 */
export function validateStates({ tag, states }) {
  try {
    validateStatesNotWrapped({ id: tag, states })
  } catch (error) {
    const { message } = /**@type {Error}*/ (error)
    sendError({ id: tag, message, src: "states" })
  }
}
