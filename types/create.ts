import type {ContextData, ContextDefinition, PartialContextData} from "./context.ts"
import type {CoreData, CoreDefinition, CoreObj} from "./core.ts"
import type { Transitions } from "./transitions.ts"
import type { Reactions } from "./reaction.ts"
import type { CreateOnTransitionCallBack, OnUpdateCallBack } from "./meta.ts"
import type {ViewDefinition} from "./view.ts";
/**
 Опции создания экземпляра актора

 @template C - Тип определения контекста
 @template S - Тип строки состояния  
 @template I - Тип ядра актора

 @remarks
 Объект конфигурации определяет все необходимые параметры для создания нового экземпляра актора

 @example
 ```javascript
 .create({
   state: "idle",
   meta: {name: "myActor"}
 })
 ```
 */
export type CreateParams<C extends ContextDefinition, S extends string, I extends Record<string, any>> = {
  /** Метаданные актора */
  meta?: {
    /** Имя актора */
    name?: string
  }
  /** Заголовок актора */
  title?: string
  /** Описание актора */
  description?: string
  /** Начальные данные ядра актора */
  core?: CoreData<I> | Record<string, any>
  /**
     Опции отладки

     Принимает либо булевый флаг, либо объект с хостом и портом:

     - Если булевый флаг true, то будет использоваться дефолтный хост и порт.
     - Если объект, то будет использоваться указанный хост и порт.
     По умолчанию хост - localhost, порт - 3000.
     */
  debug?:
    | boolean
    | {
        /** Хост для отладки */
        host?: string
        /** Порт для отладки */
        port?: number
      }

  /** Опции визуализации графа */
  graph?: boolean
  /** Обработчик смены состояния */
  onTransition?: CreateOnTransitionCallBack<S, C, I>
  /** Обработчик обновления контекста */
  onUpdate?: OnUpdateCallBack<C>
}

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
  view?: ViewDefinition<I, C, S>
}
