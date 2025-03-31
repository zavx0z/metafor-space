import type { ContextData, ContextDefinition, PartialContextData } from "./context"
import type { CoreData, CoreDefinition } from "./core"
import type { Particle } from "../index"
import type { Actions } from "./action"
import type { ReactionType } from "./reaction"

export type Meta = {
  name?: string
}

/**
 Опции графа
 
 */
export type GraphOptions = boolean

/**
 Опции отладки

 @property host - Хост для отладки
 @property port - Порт для отладки
 */
export type DebugOptions = boolean | { host?: string; port?: number }

/**
 Опции создания частицы в коллбеке create

 @property meta - Метаданные частицы
 @property title - Заголовок частицы
 @property description - Описание частицы
 @property state - Начальное состояние
 @property context - Начальные данные контекста
 @property core - Начальные данные ядра
 @property debug - Опции отладки
 @property graph - Опции визуализации графа
 @property onTransition - Обработчик смены состояния
 @property view - Опции отображения
 @property [view.isolated=true] - Флаг изолированного отображения (по умолчанию Shadow DOM)
 */
export type FabricCallbackCreateProps<
  C extends ContextDefinition,
  S extends string,
  I extends Record<string, any>
> = {
  meta?: Meta
  title?: string
  description?: string
  state: S
  context?: PartialContextData<C>
  view?: { isolated?: boolean }
  core?: CoreData<I>
  debug?: DebugOptions
  graph?: GraphOptions
  onTransition?: (oldState: S, newState: S, particle: Particle<S, C, I>) => void
  onUpdate?: (context: ContextData<C>, srcName?: string, funcName?: string) => void
}

/**
 Параметры для функции используемой в коллбеке create

 @template C - контекст
 @template S - состояние
 @template I - core

 @property development - режим разработки
 @property description - описание
 @property tag - тег
 @property options - опции
 @property states - состояния
 @property contextDefinition - определение контекста
 @property transitions - переходы
 @property actions - действия
 @property coreDefinition - определение ядра
 @property reactions - реакции
 */
export type FabricCallbackCreateFuncHelper<
  S extends string,
  C extends ContextDefinition,
  I extends Record<string, any>
> = {
  development?: boolean
  description?: string
  tag: string
  options: FabricCallbackCreateProps<C, S, I>
  states: S[]
  contextDefinition: ContextDefinition
  transitions: Transitions<C, S>
  actions: Actions<C, S, I>
  coreDefinition: CoreDefinition<I, C>
  reactions: ReactionType<C, I>
}
