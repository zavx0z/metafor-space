import type {ContextData, ContextDefinition, Update} from "./types/context.ts"
import type {Core, CoreDefinition, CoreObj} from "./types/core.ts"
import type {Transitions} from "./types/transitions.ts"
import type {Reactions} from "./types/reaction.ts"
import type {ViewDefinition} from "./types/view.ts"

/**
 Внутренние параметры для создания актора
 @internal

 @template S - Тип состояний
 @template C - Тип контекста
 @template I - Тип ядра

 @property development - Режим разработки с валидацией
 @property description - Описание актора
 @property tag - Тег (имя типа) актора
 @property states - Массив доступных состояний
 @property initialState - Начальное состояние актора
 @property contextDefinition - Определение типов контекста
 @property transitions - Переходы между состояниями
 @property coreDefinition - Определение ядра актора
 @property reactions - Реакции на изменения других акторов
 @property view - Определение представления актора
 */
export type FabricCallbackCreateFuncHelper<
  S extends string,
  C extends ContextDefinition,
  I extends CoreObj
> = {
  development?: boolean
  description?: string
  tag: string
  states: S[]
  initialState: S
  contextDefinition: ContextDefinition
  transitions: Transitions<S, C, I>
  coreDefinition: CoreDefinition<I, C>
  reactions?: Reactions<C, I>
  view: ViewDefinition<I, C, S>
}
/**
 Действие объявленное в transitions

 Может хранить и получать данные из core
 Также может получать доступ к сервисам core

 @template C - Тип данных контекста
 @template I - Тип внутренних данных

 @property context - Данные контекста
 @property element - HTML элемент актора
 @property core - Внутренние данные и сервисы
 */
export type Action<C extends ContextDefinition, I extends Record<string, unknown>> = (
  {context, element, core}: {
    context: ContextData<C>
    element: HTMLElement
    core: Core<I>
  }) => unknown | Promise<unknown>