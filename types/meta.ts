import type {ContextData, ContextDefinition} from "./context.ts"
import type {Transitions} from "./transitions.ts"
import type {CoreObj} from "./core.ts"

/**
 Снимок состояния частицы

 @template C - Тип контекста
 @template S - Тип состояния

 @property id - Идентификатор снимка
 @property title - Заголовок снимка
 @property description - Описание снимка
 @property state - Текущее состояние
 @property states - Доступные состояния
 @property context - Данные контекста
 @property types - Определение типов контекста
 @property transitions - Переходы
 @property core - Ядро
 */
export type Snapshot<S extends string, C extends ContextDefinition, I extends CoreObj> = {
  id: string
  // title: string
  description: string
  state: S
  states: readonly S[]
  context: ContextData<C>
  types: ContextDefinition
  transitions: Transitions<S, C, I>
  core: Record<string, { read: string[]; write: string[] }>
}

/**
 Сообщение для обмена данными между частицами

 @property meta - Метаданные сообщения
 @property meta.meta - Имя частицы
 @property meta.func - Имя функции
 @property meta.target - Цель функции
 @property meta.timestamp - Время отправки сообщения
 @property patch - Патч для применения к частице
 @property patch.path - Путь к частице
 @property patch.op - Операция
 @property patch.value - Значение
 */
export type BroadcastMessage = {
  meta: MetaDataMessage
  patch: PatchMetaFor
}

/** Метаданные сообщения
 @property tag -
 @property user - Идентификатор пользователя.
 @property device - Идентификатор устройства.
 @property tab - Идентификатор вкладки или окна браузера. Полезно для управления данными в нескольких вкладках или окнах.
 @property index - Уникальный идентификатор экземпляра компонента. Если не задан, генерируется автоматически.
 @property timestamp - Время отправки.
 */
type MetaDataMessage = {
  tag: string
  user?: number | null
  device?: string
  tab?: number
  index?: number
  func?: string
  target?: string
  timestamp?: number
}
/**
 * Уведомление об изменениях контекста
 *
 * @param cb - Коллбек
 * @returns - Функция для отписки от уведомлений
 */
export type OnUpdate<C extends ContextDefinition> = (cb: OnUpdateCallBack<C>) => () => void

/**
 * Коллбек обрабатывающий изменения контекста
 *
 * @param context - Контекст
 * @param srcName - Имя источника
 * @param funcName - Имя функции
 */
export type OnUpdateCallBack<C extends ContextDefinition> = (
  context: ContextData<C>,
  srcName?: string,
  funcName?: string
) => void

/**
 * Уведомление о переходах между состояниями
 *
 * @param cb - Коллбек
 * @returns - Функция для отписки от уведомлений
 */
export type OnTransition<S extends string> = (
  cb: OnTransitionCallBack<S>
) => () => void

/**
 * Коллбек обрабатывающий изменения состояний
 *
 * @template S - Тип состояний
 * @template C - Тип контекста
 * @template I - Тип действий
 *
 * @param preview - Предыдущее состояние
 * @param current - Текущее состояние
 * @param meta - Мета
 */
export type OnTransitionCallBack<S extends string> = (
  preview: S | undefined,
  current: S | undefined
) => void

/**
 * Коллбек обрабатывающий изменения состояний
 *
 * @template S - Тип состояний
 * @template C - Тип контекста
 * @template I - Тип действий
 *
 * @param preview - Предыдущее состояние
 * @param current - Текущее состояние
 * @param snapshot - Мета
 */
export type CreateOnTransitionCallBack<S extends string, C extends ContextDefinition, I extends Record<string, any>> = (
  preview: S | undefined,
  current: S | undefined,
  snapshot: Snapshot<S, C, I>
) => void