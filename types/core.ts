import type {ContextData, ContextDefinition, Update} from "./context.ts"

/**
 Базовый тип объекта ядра

 Ядро может содержать любые методы и свойства для работы актора.
 */
export type CoreObj = Record<string, any>

/**
 Частичные данные ядра

 Используется для инициализации ядра с частичными данными.
 @template I - Тип ядра
 */
export type CoreData<I extends CoreObj> = Partial<I>

/**
 Определение ядра актора

 Функция-фабрика для создания ядра актора с доступом к контексту и функции обновления.

 @template I - Тип внутренних данных и методов ядра
 @template C - Тип контекста актора

 @param params - Параметры инициализации ядра
 @param params.update - Функция обновления контекста актора
 @param params.context - Текущие данные контекста актора
 @param params.self - Ссылка на создаваемое ядро для взаимодействия между методами
 @returns Объект с методами и данными ядра
 */
export type CoreDefinition<I extends CoreObj, C extends ContextDefinition> = (params: {
  update: Update<C>
  context: ContextData<C>
  self: Core<I>
}) => I

/**
 Интерфейс ядра актора

 Предоставляет типизированный доступ к методам и данным ядра.
 Автоматически сохраняет сигнатуры методов и типы свойств.

 @template I - Тип внутренних данных и методов ядра
 */
export type Core<I extends CoreObj> = {
  [K in keyof I]: I[K] extends (...args: infer Args) => infer R ? (...args: Args) => R : I[K]
}
