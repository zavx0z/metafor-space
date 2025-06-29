import type {ContextData, ContextDefinition, Update} from "./context.ts"
import type {Core, CoreData} from "./core.ts"
import type {MetaDataMessage} from "./meta.ts"

/**
 Параметры действия реакции

 @template C - Тип контекста актора
 @template I - Тип ядра актора
 */
type ReactionActionParam<C extends ContextDefinition, I extends Record<string, unknown>> = {
  id: string
  patch: PatchMetaFor
  context: ContextData<C>
  meta: MetaDataMessage
  update: Update<C>
  core: Core<I>
}

/**
 Параметры фильтра реакции

 @template C - Тип контекста актора
 */
type ReactionFilterParam<C extends ContextDefinition> = {
  meta: MetaDataMessage
  context: ContextData<C>
  patch: PatchMetaFor
}
/**
 Реакция на изменения в других акторах

 Реакция позволяет актору реагировать на изменения в других акторах системы.
 Фильтр определяет, какие сообщения будут обработаны, а действие выполняется при срабатывании фильтра.

 @template C - Тип контекста актора
 @template I - Тип ядра актора

 @property title - Название реакции для отладки
 @property block - Блокировать ли дальнейшее распространение события
 @property filter - Функция фильтрации сообщений
 @property action - Функция, выполняемая при срабатывании фильтра
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

 Массив реакций актора на изменения в других акторах системы.

 Каждая реакция содержит фильтр для определения релевантных сообщений и действие для их обработки.
 Фильтрация может происходить по любым полям сообщения:
 - meta.tag - тип актора-источника
 - meta.index - индекс экземпляра актора
 - meta.user, meta.device, meta.tab - идентификаторы сессии
 - patch.path - путь к изменяемому свойству
 - patch.op - тип операции
 - patch.value - значение изменения
 - context - текущий контекст реагирующего актора

 @template C - Тип контекста актора
 @template I - Тип ядра актора
 */
export type Reactions<C extends ContextDefinition, I extends Record<string, unknown>> = Array<Reaction<C, I>>
