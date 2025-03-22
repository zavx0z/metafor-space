import type {TriggerType} from "./trigger.d.ts"
import type {ContextDefinition, ContextData} from "./context.d.ts"
import type {CoreObj} from "./core.d.ts"

/**
 * Переход к состоянию
 *
 * Используется для описания целевого состояния и условий триггера, необходимых для перехода.
 * Определяет, в какое состояние должна перейти частица при выполнении условий триггера.
 *
 * @interface TransitionTo
 * @template C - Тип данных контекста
 * @template S - Тип состояния
 * @property state - Целевое состояние
 * @property trigger - Условия триггера для перехода (может быть объектом с проверками или строкой/массивом строк)
 * 
 * @example
 * ```js
 * // Переход с использованием объекта проверки
 * { 
 *   state: "LOADED", 
 *   trigger: { items: { length: { gt: 0 } } } 
 * }
 * 
 * // Переход с использованием строкового триггера
 * {
 *   state: "LOADING",
 *   trigger: "loadRequested" 
 * }
 * 
 * // Переход с использованием массива строковых триггеров
 * {
 *   state: "ERROR",
 *   trigger: ["networkError", "validationError"]
 * }
 * ```
 */
export type TransitionTo<C extends ContextDefinition, S> = {
  state: S
  trigger: TriggerType<C> | string | string[]
}

/**
 * Переход между состояниями
 *
 * Описывает переход между состояниями, включая исходное состояние, действие, 
 * триггеры и целевые состояния.
 * 
 * Переходы управляют изменением состояния системы в зависимости от контекста и внешних событий.
 * Каждый переход включает начальное состояние, возможное действие или набор действий,
 * и массив целевых состояний с условиями триггеров.
 *
 * @interface Transition
 * @template C - Тип данных контекста
 * @template S - Тип состояния
 * @property from - Исходное состояние
 * @property action - Действие или массив действий, выполняемых при переходе. 
 *                    Ссылается на ключи из объекта actions, определенного в частице.
 * @property to - Массив целевых состояний с условиями триггеров
 * 
 * @example
 * ```js
 * // Переход с действием
 * {
 *   from: "IDLE",
 *   action: "fetchItems",  // Будет выполнено при переходе в состояние LOADING
 *   to: [
 *     { state: "LOADING", trigger: { isLoading: true } },
 *   ],
 * }
 * 
 * // Переход с несколькими возможными целевыми состояниями
 * {
 *   from: "LOADING",
 *   to: [
 *     { state: "LOADED", trigger: { items: { length: { gt: 0 } } } },
 *     { state: "ERROR", trigger: { error: { isNull: false } } },
 *   ],
 * }
 * 
 * // Переход с несколькими действиями
 * {
 *   from: "ERROR",
 *   action: ["logError", "showNotification"],
 *   to: [
 *     { state: "IDLE", trigger: "resetRequested" },
 *   ],
 * }
 * ```
 */
export type Transition<C extends ContextDefinition, S> = {
  from: S
  action?: string | string[]
  to: TransitionTo<C, S>[]
}

/**
 * Массив переходов
 *
 * Представляет собой массив объектов типа Transition, описывающих все возможные переходы для частицы.
 * Определяет полную логику переходов между состояниями частицы.
 *
 * В MetaFor переходы между состояниями:
 * - Автоматические: срабатывают при выполнении условий триггеров
 * - Декларативные: описаны как свойства состояния, а не как императивный код
 * - Управляемые контекстом: контекст определяет, какой переход будет активирован
 * - С возможностью выполнения действий: при переходе могут быть выполнены действия
 *
 * ### Жизненный цикл перехода:
 * 1. Обновление контекста через update() или внешние источники
 * 2. Проверка триггеров текущего состояния
 * 3. Если триггер сработал - переход в новое состояние
 * 4. Выполнение привязанных к переходу действий
 * 5. Разблокировка триггеров и проверка новых условий
 *
 * @type Transitions
 * @template C - Тип данных контекста
 * @template S - Тип состояния
 * 
 * @example
 * ```js
 * transitions([
 *   {
 *     from: "IDLE",
 *     action: "fetchItems",
 *     to: [
 *       { state: "LOADING", trigger: { isLoading: true } },
 *     ],
 *   },
 *   {
 *     from: "LOADING",
 *     to: [
 *       { state: "LOADED", trigger: { items: { length: { gt: 0 } } } },
 *       { state: "ERROR", trigger: { error: { isNull: false } } },
 *     ],
 *   },
 *   {
 *     from: "LOADED",
 *     action: "processItems",
 *     to: [
 *       { state: "PROCESSED", trigger: "processingComplete" },
 *     ],
 *   },
 *   {
 *     from: "ERROR",
 *     action: ["logError", "showNotification"], // Выполнение нескольких действий
 *     to: [
 *       { state: "IDLE", trigger: "retryRequested" },
 *     ],
 *   }
 * ])
 * 
 * // Триггер, вызывающий переход из IDLE в LOADING и выполнение action "fetchItems"
 * update({ isLoading: true })
 * 
 * // Триггер, вызывающий переход из LOADING в LOADED
 * update({ items: [1, 2, 3] })
 * ```
 */
export type Transitions<C extends ContextDefinition, S> = Array<Transition<C, S>>

/**
 * Параметры контекста, связанные с переходами
 * 
 * Расширяет определение контекста метаданными, необходимыми для 
 * управления переходами между состояниями.
 * 
 * @interface TransitionContext
 * @property trigger - Идентификатор триггера, активирующего переход между состояниями
 * @property state - Текущее состояние частицы
 */
export interface TransitionContext {
  trigger?: string
  state?: string
}

/**
 * Получение текущего состояния из контекста
 * 
 * @param context - Данные контекста
 * @returns Текущее состояние или undefined, если состояние не определено
 */
export function getState<C extends ContextDefinition>(context: ContextData<C>): string | undefined {
  return context.state
}

/**
 * Получение текущего триггера из контекста
 * 
 * @param context - Данные контекста
 * @returns Текущий триггер или undefined, если триггер не определен
 */
export function getTrigger<C extends ContextDefinition>(context: ContextData<C>): string | undefined {
  return context.trigger
}