import type {ContextData, ContextDefinition, Update} from "./context.ts"

export type CoreObj = Record<string, unknown>

export type CoreData<I extends CoreObj> = Partial<I>

/**
 Данные ядра

 @template I - Внутренние данные
 @template C - Контекст

 @param params - Параметры
 @param params.update - Функция обновления контекста
 @param params.context - Данные контекста
 @param params.self - Ядро
 */
export type CoreDefinition<I extends CoreObj, C extends ContextDefinition> = (params: {
  update: Update<C>
  context: ContextData<C>
  self: Core<I>
}) => I

/**
 Функционал ядра

 @template I - Внутренние данные
 */
export type Core<I extends CoreObj> = {
  [K in keyof I]: I[K] extends (...args: infer Args) => infer R ? (...args: Args) => R : I[K]
}
