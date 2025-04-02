import { validateContextDefinition as validateContextDefinitionNotWrapped } from "./context.js"
import { validateCore as validateCoreNotWrapped } from "./core.js"
import { validateCycles } from "./transitions.js"
import { validateTriggers } from "./trigger.js"
import { validateParticleOptions as validateParticleOptionsNotWrapped } from "./create.js"
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
 @property {"actions" | "triggers" | "transitions" | "states" | "core" | "create"} src Источник сообщения
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
 Валидация переходов

 @param {Object} params Параметры валидации
 @param {string} params.tag Имя частицы
 @param {import('../types/transitions.d.ts').Transitions<any, any>} params.transitions Массив переходов
 @param {import('../types/context.d.ts').ContextDefinition} params.contextDefinition Определение контекста
 */
export function validateTransitions({ tag, transitions, contextDefinition }) {
  if (!Array.isArray(transitions)) {
    sendError({
      id: tag,
      message: `Transitions должен быть массивом, получено: ${typeof transitions}`,
      src: "transitions",
    })
    return
  }

  if (transitions.length === 0) {
    sendWarning({ id: tag, message: "Переходы отсутствуют. Частица не будет менять состояние.", src: "transitions" })
    return
  }

  // Проверка наличия обязательных полей
  transitions.forEach((transition, index) => {
    if (!transition.from) {
      sendError({
        id: tag,
        message: `Отсутствует обязательное поле 'from' в transitions[${index}]`,
        src: "transitions",
      })
    }

    if (!transition.to) {
      sendError({ id: tag, message: `Отсутствует обязательное поле 'to' в transitions[${index}]`, src: "transitions" })
    } else if (!Array.isArray(transition.to)) {
      sendError({ id: tag, message: `Поле 'to' должно быть массивом в transitions[${index}]`, src: "transitions" })
    } else {
      transition.to.forEach((to, toIndex) => {
        if (!to.state) {
          sendError({
            id: tag,
            message: `Отсутствует обязательное поле 'state' в transitions[${index}].to[${toIndex}]`,
            src: "transitions",
          })
        }
        if (!to.when) {
          sendError({
            id: tag,
            message: `Отсутствует обязательное поле 'trigger' в transitions[${index}].to[${toIndex}]`,
            src: "transitions",
          })
        }
      })
    }
  })

  // Проверка на циклы
  validateCycles({ transitions: transitions })

  // Валидация триггеров
  try {
    validateTriggers({ tag, transitions: transitions, contextDefinition })
  } catch (error) {
    const { message } = /**@type {Error}*/ (error)
    sendError({ id: tag, message, src: "triggers" })
  }
}

/**
 Проверяет корректность конфигурации ядра

 @param {Object} params Параметры валидации
 @param {string} params.tag Идентификатор частицы
 @param {import('../types/core').CoreDefinition<any, any>} params.core Конфигурация ядра
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
 @param {import('../types/create').CreateParams<any, any, any>} params.options Конфигурация инстанса частицы
 @param {string[]} params.states Состояния частицы
 @throws {Error} Если найдены ошибки в конфигурации частицы
 */
export function validateCreateOptions({ tag, options, states }) {
  try {
    validateParticleOptionsNotWrapped({ options, states })
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
