import type {ContextData, ContextDefinition, ContextTypes, Update} from "./types/context.ts"
import type {Transitions} from "./types/transitions.ts"
import type {CoreDefinition, CoreObj} from "./types/core.ts"
import type {Reactions} from "./types/reaction.ts"
import type {ViewDefinition} from "./types/view.ts"
import type {Snapshot, OnUpdate, OnTransition} from "./types/meta.ts"

export {BroadcastMessage, PatchMetaFor} from "./types/meta.ts"
export type {Snapshot}

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
  context: <C extends ContextDefinition>(context: (types: ContextTypes) => C) => {
    core: <I extends CoreObj>(core?: CoreDefinition<I, C>) => {
      states: <S extends string>(...states: S[]) => {
        /**
         * Переходы состояний
         * @param initialState - начальное состояние
         * @param transitions - правила переходов
         */
        transitions: (initialState: S, transitions: Transitions<S, C, I>) => {
          reactions: (reactions: Reactions<C, I>) => {
            view: (view: ViewDefinition<I, C, S>) => Meta<S, C, I>
          }
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
  export interface Meta<S extends string, C extends ContextDefinition, I extends CoreObj = CoreObj> extends HTMLElement {
    id: string
    title: string
    description: string
    state: S
    context: ContextData<C>
    states: readonly S[]
    types: ContextDefinition
    process: boolean
    parent: HTMLElement

    update: Update<C>
    onUpdate: OnUpdate<C>
    onTransition: OnTransition<S>
    snapshot: () => Snapshot<S, C, I>
    destroy: () => void
  }

  export type MetaAny = Meta<any, any, any>
  export type SnapshotAny = Snapshot<any, any, any>
}

