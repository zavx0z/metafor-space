import type { Actions } from "./action.d.ts"
import type { CoreData } from "./core.d.ts"
import type { Transitions } from "./transitions.d.ts"
import type { ContextData, ContextDefinition } from "./context.d.ts"
import type { CoreDefinition } from "./core.d.ts"
import type { ReactionType } from "./reaction.d.ts"
import type { Particle } from "../index.d.ts"

/**
 * Параметры обновления контекста
 * @interface UpdateContextParams
 * @template C - Тип контекста
 * @property context - Данные контекста для обновления
 * @property srcName - Имя источника изменения
 * @property funcName - Имя функции вызвавшей изменение
 */
export interface UpdateContextParams<C extends Record<string, any>> {
  context: ContextData<C>
  srcName?: string
  funcName?: string
}

/**
 * Параметры конструктора MetaFor
 * @property channel - Канал для коммуникации
 * @property id - Идентификатор частицы
 * @property states - Список возможных состояний
 * @property contextDefinition - Определение контекста
 * @property transitions - Правила переходов
 * @property initialState - Начальное состояние
 * @property contextData - Начальные данные контекста
 * @property actions - Действия частицы
 * @property core - Определение ядра
 * @property coreData - Данные ядра
 * @property reactions - Реакции на изменения
 * @property onTransition - Callback при изменении состояния
 * @property onUpdate - Callback при изменении контекста
 * @property destroy - Callback при уничтожении частицы
 */
export type ParticleConstructorParams<S extends string, C extends ContextDefinition, I extends Record<string, any>> = {
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
  onTransition?: (oldState: S, newState: S, particle: Particle<S, C, I>) => void
  onUpdate?: (context: ContextData<C>, srcName?: string, funcName?: string) => void
  destroy?: (particle: Particle<S, C, I>) => void
}
