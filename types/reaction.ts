import type {ContextData, ContextDefinition, Update} from "./context.ts"
import type {Core, CoreData} from "./core.ts"
import type {MetaDataMessage} from "./meta.ts"


type ReactionActionParam<C extends ContextDefinition, I extends Record<string, unknown>> = {
  id: string
  patch: PatchMetaFor
  context: ContextData<C>
  meta: MetaDataMessage
  update: Update<C>
  core: Core<I>
}

type ReactionFilterParam<C extends ContextDefinition> = {
  meta: MetaDataMessage
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
export type Reaction<C extends ContextDefinition, I extends Record<string, unknown>> = {
  title: string
  block?: boolean
  // path?: string
  // op?: "add" | "remove" | "update"
  filter: ({context, patch, meta}: ReactionFilterParam<C>) => boolean
  action: ({id, patch, context, update, core}: ReactionActionParam<C, I>) => void
}

// & Partial<MetaDataMessage>

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
