import type {ContextData, ContextDefinition, ContextTypes, UpdateParameters} from "./types/context.ts"
import type {Transitions} from "./types/transitions.ts"
import type {CoreDefinition, CoreObj} from "./types/core.ts"
import type {Reactions} from "./types/reaction.ts"
import type {ViewDefinition} from "./types/view.ts"
import type {CreateParams} from "./types/create.ts"
import type {Snapshot, OnUpdate, OnTransition} from "./types/meta.ts"

export {BroadcastMessage} from "./types/meta.ts"

/**

 # MetaFor - мета для ...

 Создает класс/коллекцию Мета - которые порождают сущности - называемые meta.

 > Декларативное описание сущности и её поведения


 ## Основные составляющие:
 - Состояния
 - Контекст
 - Переходы между состояниями
 - Ядро
 - Действия
 - Функция создания частицы

 ## Дополнительные составляющие:
 - Представление отображения частицы
 - Реакции на изменения других частиц

 > Meta (класс/коллекция) порождает meta (актор/сущность) при вызове метода create

 @param tag - Имя частицы
 @param [conf] - Конфигурация частицы
 @param conf.description - Описание частицы
 @param conf.development - Режим разработки (подключена валидация)

 @includeExample tests/metafor.spec.ts
 */ // prettier-ignore
export declare function MetaFor(
  tag: string,
  conf?: {
    description?: string
    development?: boolean
  }
): {
  states: <S extends string>(...states: S[]) => {
    context: <C extends ContextDefinition>(context: (types: ContextTypes) => C) => {
      core: <I extends CoreObj>(core?: CoreDefinition<I, C>) => {
        view: (view: ViewDefinition<I, C, S>) => {
          /**
           * Переходы состояний
           * @param initialState - начальное состояние
           * @param transitions - правила переходов
           */
          transitions: (initialState: S, transitions: Transitions<S, C, I>) => {
            reactions: (reactions: Reactions<C, I>) => {
              create: (options?: CreateParams<C, S, I>) => Meta<S, C>
            }
            create: (options?: CreateParams<C, S, I>) => Meta<S, C>
          }
        }
        transitions: (initialState: S, transitions: Transitions<S, C, I>) => {
          reactions: (reactions: Reactions<C, I>) => {
            create: (options?: CreateParams<C, S, I>) => Meta<S, C>
          }
          create: (options?: CreateParams<C, S, I>) => Meta<S, C>
        }
      }
    }
  }
}

declare global {
  /**
   Meta

   @template S - Состояния
   @template C - Контекст
   @template I - Ядро

   @property id - Идентификатор meta
   @property title - Заголовок meta
   @property description - Описание meta
   @property state - Состояние meta
   @property context - Контекст meta
   @property states - Состояния meta
   @property types - Типы meta
   @property core - Ядро meta
   @property reactions - Реакции meta
   @property channel - Канал meta
   @property process - Флаг процесса meta
   @property component - Компонент meta
   @property update - Обновление meta
   @property onUpdate - Обработчик обновления meta
   @property onTransition - Обработчик перехода meta
   @property snapshot - Снимок meta
   @property graph - Граф meta
   @property destroy - Уничтожение meta
   */
  export interface Meta<S extends string, C extends ContextDefinition> extends HTMLElement {
    id: string
    title: string
    description: string
    state: S
    context: ContextData<C>
    states: readonly S[]
    types: ContextDefinition
    process: boolean
    parent: HTMLElement

    update: (context: UpdateParameters<C>) => void
    onUpdate: OnUpdate<C>
    onTransition: OnTransition<S>
    snapshot: () => Snapshot<S, C, any>
    destroy: () => void
  }

  export type MetaAny = Meta<any, any>


  /**
   Снимок meta

   @template C - Тип контекста
   @template S - Тип состояния

   @property id - Идентификатор снимка
   @property title - Заголовок снимка
   @property description - Описание снимка
   @property state - Текущее состояние
   @property states - Доступные состояния
   @property context - Данные контекста
   @property types - Определение типов контекста
   @property transitions - Переходы
   @property core - Ядро
   */
  export type SnapshotMetaFor<S extends string, C extends ContextDefinition, I extends CoreObj> = {
    id: string
    // title: string
    description: string
    state: S
    states: readonly S[]
    context: ContextData<C>
    types: ContextDefinition
    transitions: Transitions<S, C, I>
    core: Record<string, { read: string[]; write: string[] }>
  }
  export type SnapshotMetaForAny = SnapshotMetaFor<any, any, any>

  /**
   Патч для применения к частице

   @property path - Путь к частице
   @property op - Операция
   @property value - Значение
   */
  export type PatchMetaFor = {
    path: string
    op: "add" | "remove" | "replace" | "move" | "copy" | "test"
    value: any
  }
}

