import type {ContextData, ContextDefinition, Update} from "./context"
import type {Core} from "./core"

/**
 @property {number | null} user - Идентификатор пользователя.
 @property {string} device - Идентификатор устройства.
 @property {number} tab - Идентификатор вкладки или окна браузера. Полезно для управления данными в нескольких вкладках или окнах.
 @property {string} name - ID частицы.
 @property {number} index - Уникальный идентификатор экземпляра компонента. Если не задан, генерируется автоматически.
 @property {number} timestamp - Время отправки.
 */
type MetaDataType = {
  user?: number | null
  device?: string
  tab?: number
  particle: string
  index?: number
  timestamp?: number
}

/**
 Тип реакции на изменение данных.

 @template C - Тип контекста
 @template I - Тип данных

 @property {string} path - Путь к изменяемому свойству.
 @property {"add" | "remove" | "update"} op - Тип операции.
 @property {() => void} action - Функция, которая будет вызвана при изменении данных.
 */
export type ReactionType<C extends ContextDefinition, I extends Record<string, unknown>> = Array<
  {
    path?: string
    op?: "add" | "remove" | "update"
    action: ({patch, context, update, core}: {
      patch: {path: string; op: "add" | "remove" | "update" | "replace"; value: any}
      context: ContextData<C>
      meta: MetaDataType
      update: Update<C>
      core: Core<I>
    }) => void
  } & Partial<MetaDataType>
>
