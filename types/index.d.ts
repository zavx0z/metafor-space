import type { ContextData, ContextDefinition,  EnumDefinition, TypeDefinition } from "./context.d.ts"
import type {
  BooleanTriggerCondition,
  EnumTriggerCondition,
  NumberTriggerCondition,
  StringTriggerCondition,
} from "./trigger.d.ts"
import type {  TransitionTo } from "./transition.d.ts"
import type { Core, CoreDefinition } from "./core.d.ts"
import type { Action, Actions } from "./action.d.ts"
import type { SignalType } from "./state.d.ts"
import type { ReactionType } from "./reaction.d.ts"
import type { CreateOptions } from "./create.d.ts"

export type {
  SignalType,
  Action,
  Actions,
  CoreDefinition,
  Core,
  TransitionTo,
  ContextData,
  ContextDefinition,
  TypeDefinition,
  EnumDefinition,
  EnumTriggerCondition,
  NumberTriggerCondition,
  StringTriggerCondition,
  BooleanTriggerCondition,
}
/**
 * Снимок состояния частицы
 * @interface Snapshot
 * @template C
 * @template S
 * @property id - Идентификатор снимка
 * @property title - Заголовок снимка
 * @property description - Описание снимка
 * @property state - Текущее состояние
 * @property states - Доступные состояния
 * @property context - Данные контекста
 * @property types - Определение типов контекста
 * @property transitions - Переходы
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
 * Опции графа
 * @interface GraphOptions
 */
export type GraphOptions = boolean

/**
 * Опции отладки
 * @interface DebugOptions
 * @property host - Хост для отладки
 * @property port - Порт для отладки
 */
export type DebugOptions = boolean | { host?: string; port?: number }

export type Meta = {
  name?: string
}

/**
 * Создание частицы
 * @template C - Определение контекста
 * @template S - Тип состояния
 * @template I - Тип данных ядра
 * @param options - Опции создания частицы
 * @param tag - Идентификатор частицы
 * @param description - Описание частицы
 * @param states - Список состояний
 * @param contextDefinition - Определение контекста
 * @param transitions - Определение переходов
 * @param actions - Определение действий
 * @param coreDefinition - Определение ядра
 * @param reactions - Определение реакций
 * @returns - Частица
 * */
export type CreateMetaFor<C extends Record<string, any>, S extends string, I extends Record<string, any>> = {
  options: CreateOptions<C, S, I>
  tag: string
  description: string
  states: S[]
  contextDefinition: ContextDefinition
  transitions: Transitions<C, S>
  actions: Actions<C, I>
  coreDefinition: CoreDefinition<I, C>
  reactions: ReactionType<C, I>
}
