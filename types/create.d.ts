import type { ContextData, ContextDefinition, PartialContextData } from "./context"
import type { CoreData } from "./core"
import type { Particle } from "../index"

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
export type FabricCallbackCreateProps<C extends ContextDefinition, S extends string, I extends Record<string, any>> = {
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
   
   Принимает либо булевый флаг, либо объект с хостом и портом.
   Если булевый флаг true, то будет использоваться дефолтный хост и порт.
   Если объект, то будет использоваться указанный хост и порт.
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
  onTransition?: (oldState: S, newState: S, particle: Particle<S, C, I>) => void
  /** Обработчик обновления контекста */
  onUpdate?: (context: ContextData<C>, srcName?: string, funcName?: string) => void
}
