import type {ContextData, ContextDefinition, ContextTypes, Update} from "./types/context.ts"
import type {Transitions} from "./types/transitions.ts"
import type {CoreDefinition, CoreObj} from "./types/core.ts"
import type {Reactions} from "./types/reaction.ts"
import type {ViewDefinition} from "./types/view.ts"
import type {Snapshot, OnUpdate, OnTransition} from "./types/meta.ts"

export {BroadcastMessage, PatchMetaFor} from "./types/meta.ts"
export type {Snapshot}

/**
 @param tag - Имя
 @param [conf] - Конфигурация
 @param conf.description - Описание
 @param conf.development - Режим разработки (подключена валидация)
 @includeExample tests/metafor.spec.ts
 */
export declare function MetaFor(
  tag: string,
  conf?: {
    description?: string
    development?: boolean
  }
): {
  context: <C extends ContextDefinition>(context: (types: ContextTypes) => C) => {
    core: <I extends CoreObj>(core?: CoreDefinition<I, C>) => {
      reactions: <R extends Reactions<C, I>>(reactions: R) => {
        states: <S extends string>(...states: S[]) => {
          /**
           * Переходы состояний
           * @param initialState - начальное состояние
           * @param transitions - правила переходов
           */
          transitions: (initialState: S, transitions: Transitions<S, C, I, R>) => {
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

   @property id - Идентификатор
   @property title - Заголовок
   @property description - Описание
   @property state - Состояние
   @property context - Контекст
   @property states - Состояния
   @property types - Типы
   @property process - Флаг процесса
   @property update - Обновление
   @property onUpdate - Обработчик обновления
   @property onTransition - Обработчик перехода
   @property snapshot - Снимок
   @property destroy - Уничтожение
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
    update: Update<C>
    onUpdate: OnUpdate<C>
    onTransition: OnTransition<S>
    snapshot: () => Snapshot<S, C, I>
    destroy: () => void
  }

  export type MetaAny = Meta<any, any, any> & HTMLElement
  export type SnapshotAny = Snapshot<any, any, any>
}

