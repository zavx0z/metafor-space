import type {ContextData, ContextDefinition, Update} from "./context.ts"
import type {Core, CoreData, CoreObj} from "./core.ts"

/**
 @property user - Идентификатор пользователя.
 @property device - Идентификатор устройства.
 @property tab - Идентификатор вкладки или окна браузера. Полезно для управления данными в нескольких вкладках или окнах.
 @property index - Уникальный идентификатор экземпляра компонента. Если не задан, генерируется автоматически.
 @property timestamp - Время отправки.
 */
type MetaDataType = {
  user?: number | null
  device?: string
  tag?: string
  tab?: number
  index?: number
  timestamp?: number
}

type ReactionActionParam<C extends ContextDefinition, I extends CoreData<I>> = {
  patch: { path: string; op: "add" | "remove" | "update" | "replace"; value: any }
  context: ContextData<C>
  meta: MetaDataType
  update: Update<C>
  core: Core<I>
  element: HTMLElement
}

type ReactionFilterParam<C extends ContextDefinition> = {
  meta: MetaDataType
  context: ContextData<C>
  patch: PatchMetaFor
}
/**
 Тип реакции на изменение данных.

 @template C - Тип контекста
 @template I - Тип данных

 @property path - Путь к изменяемому свойству.
 @property op - Тип операции.
 @property action - Функция, которая будет вызвана при изменении данных.
 */
export type Reaction<C extends ContextDefinition, I extends CoreData<I>> = {
  // path?: string
  // op?: "add" | "remove" | "update"
  filter: ({context, patch, meta}: ReactionFilterParam<C>) => boolean
  action: ({patch, context, update, core, element}: ReactionActionParam<C, I>) => void
} & Partial<MetaDataType>

/** # Реакции

 Реакции - это функции, которые будут вызваны если фильтр пройдет.

 Фильтрация происходит по полям:
 - path
 - op
 - id
 - user
 - device
 - tab
 - meta
 - index
 - timestamp

 Если поле не указано, то оно не будет учитываться при фильтрации.

 @template C - Тип контекста
 @template I - Тип данных

 @property path - Путь к изменяемому свойству.
 @property op - Тип операции.
 @property action - Функция, которая будет вызвана при изменении данных.
 */
export type Reactions<C extends ContextDefinition, I extends Record<string, unknown>> = Array<Reaction<C, I>>
