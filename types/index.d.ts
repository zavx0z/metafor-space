import type {ContextData, ContextDefinition} from "./context.d.ts"

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
 * Опции графа
 * @interface GraphOptions
 */
export type GraphOptions = boolean

/**
 * Опции отладки
 * @interface DebugOptions
 * @property host - Хост для отладки
 * @property port - Порт для отладки
 */
export type DebugOptions = boolean | { host?: string; port?: number }

export type Meta = {
    name?: string
}
