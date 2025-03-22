import type {ContextDefinition} from "./context.d.ts"
import type {CoreObj} from "./core.d.ts"
import type {Transitions} from "./transition.d.ts"

/**
 * Интерфейс определения состояния
 * 
 * Состояние в MetaFor - это именованная точка в жизненном цикле частицы,
 * которая определяет ее поведение и возможные переходы в другие состояния.
 * 
 * Состояния:
 * - Определяют бизнес-логику и поведение частицы
 * - Содержат декларативные правила переходов
 * - Автоматически активируются на основе контекста
 * - Управляют отображением UI через представление
 * 
 * @interface StateDefinition
 * @template C - Тип контекста
 * @template I - Тип внутренних данных ядра
 * @property transitions - Коллекция возможных переходов из этого состояния
 * 
 * @example
 * ```js
 * .states({
 *   // Состояние ожидания
 *   idle: {
 *     transitions: [
 *       { to: { state: "loading", when: "load" } }
 *     ]
 *   },
 *   
 *   // Состояние загрузки
 *   loading: {
 *     transitions: [
 *       { to: { state: "loaded", when: "done" } },
 *       { to: { state: "error", when: "error" } }
 *     ]
 *   },
 *   
 *   // Состояние с загруженными данными
 *   loaded: {
 *     transitions: [
 *       { to: { state: "loading", when: "refresh" } },
 *       { to: { state: "idle", when: "reset" } }
 *     ]
 *   },
 *   
 *   // Состояние ошибки
 *   error: {
 *     transitions: [
 *       { to: { state: "loading", when: "retry" } },
 *       { to: { state: "idle", when: "reset" } }
 *     ]
 *   }
 * })
 * ```
 */
export interface StateDefinition<C extends ContextDefinition, I extends CoreObj> {
  transitions?: Transitions<C, I>
}

/**
 * Коллекция состояний для частицы
 * 
 * Содержит набор именованных состояний, каждое из которых определяет
 * возможные переходы и связанные действия.
 * 
 * @interface StatesDefinition
 * @template C - Тип контекста
 * @template I - Тип внутренних данных ядра
 */
export type StatesDefinition<C extends ContextDefinition, I extends CoreObj> = Record<
  string,
  StateDefinition<C, I>
>

/**
 * Слушатель сигналов
 * 
 * Функция обратного вызова, которая вызывается при изменении состояния частицы.
 * Получает предыдущее и текущее состояние и может выполнять дополнительную логику.
 * 
 * @interface SignalListener
 * @template T - Тип состояния (строка)
 * @property preview - Предыдущее состояние
 * @property current - Текущее состояние
 */
type SignalListener<T extends string> = (preview: T, current: T) => void

/**
 * Тип сигнала
 * 
 * Объект для управления состоянием частицы.
 * Предоставляет методы для получения, установки и отслеживания изменения состояния.
 * 
 * Состояния в MetaFor являются основным элементом конечного автомата.
 * Они задаются как уникальные строки, определяющие текущие условия работы автомата.
 * 
 * Правила именования состояний:
 * 1. Используйте верхний регистр (UPPERCASE)
 * 2. Используйте описательные имена, отражающие суть состояния
 * 3. Для составных имен используйте пробелы между словами
 * 4. Обеспечьте уникальность состояний в рамках одной частицы
 * 
 * Примеры шаблонов состояний:
 * - Загрузка данных: "IDLE", "LOADING", "LOADED", "ERROR"
 * - Аутентификация: "ANONYMOUS", "AUTHENTICATING", "AUTHENTICATED", "AUTH ERROR"
 * - Формы: "INITIAL", "VALIDATING", "VALID", "INVALID", "SUBMITTING", "SUBMITTED", "SUBMIT ERROR"
 * 
 * @interface SignalType
 * @template T - Тип состояния (строка)
 * @property value - Получить текущее значение состояния
 * @property setValue - Установить новое значение состояния
 * @property onChange - Добавить слушатель изменения состояния
 * @property clear - Очистить все слушатели состояния
 * 
 * @example
 * ```
 * MetaFor("todo-list").states("IDLE", "LOADING", "LOADED", "ERROR")
 * ```
 */
export type SignalType<T extends string> = {
  value: () => T
  setValue: (state: T) => void
  onChange: (listener: SignalListener<T>) => () => void
  clear: () => void
}