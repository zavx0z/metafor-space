import type { ContextData, ContextDefinition, Update } from "./context.d.ts"
import type { Core } from "./core.d.ts"

/**
 Действия объявленные в конструкторе Meta в actions

 Предпочтительно не использовать чистые действия, а объявлять их в transitions.

 @template C - Тип данных контекста
 @template I - Тип внутренних данных

 @property [key: string]: Action<C, I> - Действие
 */
export type Actions<C extends ContextDefinition, I extends Record<string, unknown>> = { [key: string]: Action<C, I> }

/**
 Действие объявленное в конструкторе Meta в actions

 Может хранить и получать данные из core
 Также может получать доступ к сервисам core

 @template C - Тип данных контекста
 @template I - Тип внутренних данных
 @property context - Данные контекста
 @property update - Функция обновления контекста
 @property core - Внутренние данные и сервисы
 */
export type Action<C extends ContextDefinition, I extends Record<string, unknown>> = ({
  context,
  update,
}: {
  context: ContextData<C>
  update: Update<C>
  core: Core<I>
}) => void | Promise<void>

/**
 Чистое действие объявленное в transitions

 Не имеет доступа к core
 Является чистой функцией

 @template C - Тип данных контекста
 @property context - Данные контекста
 @property update - Функция обновления контекста
 */
export type ActionClean<C extends ContextDefinition> = ({
  context,
  update,
}: {
  context: ContextData<C>
  update: Update<C>
}) => void | Promise<void>
