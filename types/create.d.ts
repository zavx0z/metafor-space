import type { ContextData, ContextDefinition, PartialContextData } from "./context"
import type { CoreData, CoreDefinition } from "./core"
import type { Meta } from "./index"
import type { Transitions } from "./transitions"
import type { ReactionType } from "./reaction"
import type { OnTransitionCallBack, OnUpdateCallBack } from "./meta"
/**
 Опции создания частицы в коллбеке create

 @typeParam C - Тип определения контекста
 @typeParam S - Тип строки состояния
 @typeParam I - Тип записи с произвольными значениями

 @remarks
 Объект конфигурации определяет все необходимые параметры для создания новой частицы

 @example
 ```javascript
 .create({
   state: "idle",
   meta: {name: "myParticle"}
 })
 ```
 */
export type CreateParams<C extends ContextDefinition, S extends string, I extends Record<string, any>> = {
  /** Метаданные частицы */
  meta?: {
    /** Имя частицы */
    name?: string
  }
  /** Заголовок частицы */
  title?: string
  /** Описание частицы */
  description?: string
  /** Начальное состояние */
  state: S
  /** Начальные данные контекста */
  context?: PartialContextData<C>
  /** Опции отображения */
  view?: {
    /** Флаг изолированного отображения (по умолчанию Shadow DOM) */
    isolated?: boolean
  }
  /** Начальные данные ядра */
  core?: CoreData<I>
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
  onTransition?: OnTransitionCallBack<S, C, I>
  /** Обработчик обновления контекста */
  onUpdate?: OnUpdateCallBack<C>
}

/**
 Параметры для функции используемой в коллбеке create
 @hidden

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
  options: CreateParams<C, S, I>
  states: S[]
  contextDefinition: ContextDefinition
  transitions: Transitions<S, C, I>
  coreDefinition: CoreDefinition<I, C>
  reactions: ReactionType<C, I>
}
