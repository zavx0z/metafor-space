import type { ContextData, ContextDefinition } from "./context"
import type { Transitions } from "./transitions"
import type { Actions } from "./actions"
import type { CoreData, CoreDefinition } from "./core"
import type { ReactionType } from "./reaction"
import type { Meta } from "../index"

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
 @property actions - Действия
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
  transitions: Transitions<C, S>
  actions: Record<string, { read: string[]; write: string[] }>
  core: Record<string, { read: string[]; write: string[] }>
}

/**
 Сообщение для обмена данными между частицами

 @property meta - Метаданные сообщения
 @property meta.particle - Имя частицы
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
    particle: string
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
 Параметры конструктора Particle

 @template S - Тип состояний
 @template C - Тип контекста
 @template I - Тип действий

 @property channel - Канал для коммуникации
 @property id - Идентификатор частицы
 @property states - Список возможных состояний
 @property contextDefinition - Определение контекста
 @property transitions - Правила переходов
 @property initialState - Начальное состояние
 @property contextData - Начальные данные контекста
 @property actions - Действия частицы
 @property core - Определение ядра
 @property coreData - Данные ядра
 @property reactions - Реакции на изменения
 @property onTransition - Callback при изменении состояния
 @property onUpdate - Callback при изменении контекста
 @property destroy - Callback при уничтожении частицы
 */
export type MetaConstructor<S extends string, C extends ContextDefinition, I extends Record<string, any>> = {
  channel: BroadcastChannel
  id: string
  states: S[]
  contextDefinition: ContextDefinition
  transitions: Transitions<C, S>
  initialState: S
  contextData: ContextData<C>
  actions: Actions<C, I>
  core: CoreDefinition<I, C>
  coreData: CoreData<I>
  reactions: ReactionType<C, I>
  onTransition?: (oldState: S, newState: S, particle: Meta<S, C, I>) => void
  onUpdate?: (context: ContextData<C>, srcName?: string, funcName?: string) => void
  destroy?: (particle: Meta<S, C, I>) => void
}
