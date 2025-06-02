import type { ContextData, ContextDefinition, Update } from "./context.ts"
import type { Core } from "./core.ts"

/**
 Действие объявленное в transitions

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
