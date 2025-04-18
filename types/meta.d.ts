import type { ContextData, ContextDefinition } from "./context"
import type { Transitions } from "./transitions"
import type { CoreData, CoreDefinition } from "./core"
import type { ReactionType } from "./reaction"
import type { Meta } from "./index"
import type { CreateOnTransitionCallBack } from "./create"

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
export type Snapshot<C extends Record<string, any>, S> = {
  id: string
  title?: string
  description?: string
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
  meta: {
    meta: string
    func: string
    target: string
    timestamp: number
  }
  patch: Patch
}

/**
 Патч для применения к частице

 @property path - Путь к частице
 @property op - Операция
 @property value - Значение
 */
export type Patch = {
  path: string
  op: "add" | "remove" | "replace" | "move" | "copy" | "test"
  value: any
}

/**
 Параметры конструктора Meta

 @template S - Тип состояний
 @template C - Тип контекста
 @template I - Тип действий

 @property channel - Канал для коммуникации
 @property id - Идентификатор meta
 @property states - Список возможных состояний
 @property contextDefinition - Определение контекста
 @property transitions - Правила переходов
 @property initialState - Начальное состояние
 @property contextData - Начальные данные контекста
 @property core - Определение ядра
 @property coreData - Данные ядра
 @property reactions - Реакции на изменения
 @property onTransition - Callback при изменении состояния
 @property onUpdate - Callback при изменении контекста
 @property destroy - Callback при уничтожении meta
 */
export type MetaConstructor<S extends string, C extends ContextDefinition, I extends Record<string, any>> = {
  channel: BroadcastChannel
  id: string
  states: S[]
  contextDefinition: ContextDefinition
  transitions: Transitions<S, C, I>
  initialState: S
  contextData: ContextData<C>
  core: CoreDefinition<I, C>
  coreData: CoreData<I>
  reactions: ReactionType<C, I>
  onTransition?: CreateOnTransitionCallBack<S, C, I>
  onUpdate?: OnUpdateCallBack<C>
  destroy?: (particle: Meta<S, C, I>) => void
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
export type OnTransition<S extends string, C extends ContextDefinition, I extends Record<string, any>> = (
  cb: OnTransitionCallBack<S, C, I>
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
export type OnTransitionCallBack<S extends string, C extends ContextDefinition, I extends Record<string, any>> = (
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
 * @param meta - Мета
 */
export type CreateOnTransitionCallBack<S extends string, C extends ContextDefinition, I extends Record<string, any>> = (
  preview: S | undefined,
  current: S | undefined,
  meta: Meta<S, C, I>
) => void