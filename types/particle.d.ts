import type { ContextData, ContextDefinition } from "./context"
import type { Transitions } from "./transitions"

/**
 * Снимок состояния частицы
 * @interface Snapshot
 * @template C
 * @template S
 * @property id - Идентификатор снимка
 * @property title - Заголовок снимка
 * @property description - Описание снимка
 * @property state - Текущее состояние
 * @property states - Доступные состояния
 * @property context - Данные контекста
 * @property types - Определение типов контекста
 * @property transitions - Переходы
 */
export type Snapshot<C extends Record<string, any>, S> = {
  id: string
  title?: string
  description?: string
  state: S
  states: readonly S[]
  context: ContextData<C>
  types: ContextDefinition
  transitions: Transitions<C, S>
  actions: Record<string, { read: string[]; write: string[] }>
  core: Record<string, { read: string[]; write: string[] }>
}

/**
 Сообщение для обмена данными между частицами


 @property meta - Метаданные сообщения
 @property meta.particle - Имя частицы
 @property meta.func - Имя функции
 @property meta.target - Цель функции
 @property meta.timestamp - Время отправки сообщения
 @property patch - Патч для применения к частице
 @property patch.path - Путь к частице
 @property patch.op - Операция
 @property patch.value - Значение
 */
export type BroadcastMessage = {
  meta: {
    particle: string
    func: string
    target: string
    timestamp: number
  }
  patch: Patch
}

/**
 Патч для применения к частице

 @property path - Путь к частице
 @property op - Операция
 @property value - Значение
 */
export type Patch = {
  path: string
  op: "add" | "remove" | "replace" | "move" | "copy" | "test"
  value: any
}