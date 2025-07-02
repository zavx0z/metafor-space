import type {ContextData, ContextDefinition} from "./context.ts"
import type {Transitions} from "./transitions.ts"
import type {CoreObj} from "./core.ts"

/**
 Патч для применения к актору

 @property path - Путь к актору
 @property op - Операция
 @property value - Значение
 */
export type PatchMetaFor = {
  path: string
  op: "add" | "remove" | "replace" | "move" | "copy" | "test"
  value: any
}

/**
 Снимок состояния актора

 @template S - Тип состояния
 @template C - Тип контекста
 @template I - Тип ядра

 @property id - Идентификатор актора
 @property description - Описание актора
 @property state - Текущее состояние актора
 @property states - Доступные состояния актора
 @property context - Данные контекста актора
 @property types - Определение типов контекста
 @property transitions - Переходы между состояниями
 @property core - Данные ядра актора
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
 Сообщение для обмена данными между акторами

 @property meta - Метаданные сообщения
 @property meta.tag - Имя типа актора
 @property meta.index - Индекс экземпляра актора
 @property meta.func - Имя функции, инициировавшей сообщение
 @property meta.target - Цель сообщения
 @property meta.timestamp - Время отправки сообщения
 @property patch - Патч для применения к актору
 @property patch.path - Путь к изменяемому свойству актора
 @property patch.op - Операция (add, remove, replace, move, copy, test)
 @property patch.value - Значение для операции
 */
export type BroadcastMessage = {
  meta: MetaDataMessage
  patch: PatchMetaFor
}

/**
 Метаданные сообщения

 @property tag - Имя типа актора (компонента)
 @property user - Идентификатор пользователя
 @property device - Идентификатор устройства
 @property tab - Идентификатор вкладки или окна браузера. Полезно для управления данными в нескольких вкладках или окнах
 @property index - Уникальный идентификатор экземпляра актора. Если не задан, генерируется автоматически
 @property func - Имя функции, инициировавшей сообщение
 @property target - Цель сообщения
 @property timestamp - Время отправки сообщения в миллисекундах
 */
export type MetaDataMessage = {
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
 Уведомление об изменениях контекста

 @template C - Тип определения контекста
 @param cb - Коллбек для обработки изменений контекста
 @returns Функция для отписки от уведомлений
 */
export type OnUpdate<C extends ContextDefinition> = (cb: OnUpdateCallBack<C>) => () => void

/**
 Коллбек обрабатывающий изменения контекста

 @template C - Тип определения контекста
 @param context - Измененные данные контекста
 @param srcName - Имя источника изменения (action, core, reaction, view)
 @param funcName - Имя функции, инициировавшей изменение
 */
export type OnUpdateCallBack<C extends ContextDefinition> = (
  context: ContextData<C>,
  srcName?: string,
  funcName?: string
) => void

/**
 Уведомление о переходах между состояниями

 @template S - Тип состояний
 @param cb - Коллбек для обработки переходов между состояниями
 @returns Функция для отписки от уведомлений
 */
export type OnTransition<S extends string> = (
  cb: OnTransitionCallBack<S>
) => () => void

/**
 Коллбек обрабатывающий переходы между состояниями

 @template S - Тип состояний
 @param preview - Предыдущее состояние
 @param current - Текущее состояние
 */
export type OnTransitionCallBack<S extends string> = (
  preview: S | undefined,
  current: S | undefined
) => void

/**
 Коллбек обрабатывающий переходы между состояниями с доступом к снимку

 @template S - Тип состояний
 @template C - Тип контекста
 @template I - Тип ядра
 @param preview - Предыдущее состояние
 @param current - Текущее состояние
 @param snapshot - Снимок состояния актора
 */
export type CreateOnTransitionCallBack<S extends string, C extends ContextDefinition, I extends Record<string, any>> = (
  preview: S | undefined,
  current: S | undefined,
  snapshot: Snapshot<S, C, I>
) => void