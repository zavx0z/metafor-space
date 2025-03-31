import type { ContextData, ContextDefinition, Update } from "./context.d.ts"
import type { Core } from "./core.d.ts"

/**
 Действие

 @template C - Тип данных контекста
 @template I - Тип внутренних данных
 @property context - Данные контекста
 @property update - Функция обновления контекста
 @property core - Внутренние данные
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
 Действия

 @template C - Тип данных контекста
 @template I - Тип внутренних данных

 @property [key: string]: Action<C, I> - Действие
 */
export type Actions<C extends ContextDefinition, I extends Record<string, unknown>> = { [key: string]: Action<C, I> }
