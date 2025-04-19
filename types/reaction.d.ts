import type { ContextData, ContextDefinition, Update } from "./context"
import type { Core } from "./core"

/**
 @property user - Идентификатор пользователя.
 @property device - Идентификатор устройства.
 @property tab - Идентификатор вкладки или окна браузера. Полезно для управления данными в нескольких вкладках или окнах.
 @property particle - ID частицы.
 @property index - Уникальный идентификатор экземпляра компонента. Если не задан, генерируется автоматически.
 @property timestamp - Время отправки.
 */
type MetaDataType = {
  user?: number | null
  device?: string
  tab?: number
  id?: string
  index?: number
  timestamp?: number
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
  path?: string
  op?: "add" | "remove" | "update"
  action: ({
    patch,
    context,
    update,
    core,
  }: {
    patch: { path: string; op: "add" | "remove" | "update" | "replace"; value: any }
    context: ContextData<C>
    meta: MetaDataType
    update: Update<C>
    core: Core<I>
  }) => void
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
- particle
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
