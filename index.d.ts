import type { Snapshot } from "./types"
import type { ParticleConstructorParams } from "./types/metafor"
import type {
  ContextDefinition,
  ContextTypes,
  UpdateParameters,
  OnUpdateContextData,
  ContextData,
} from "./types/context"
import type { Transitions } from "./types/transition"
import type { CoreObj, CoreDefinition, Core } from "./types/core"
import type { Actions } from "./types/action"
import type { ReactionType } from "./types/reaction"
import type { ViewDefinition } from "./types/view"
import type { CreateOptions } from "./types/create"

/**
 * Опции частицы
 * @property description - Описание частицы
 * @property development - Режим разработки (подключена валидация)
 */
export type ParticleOptions = {
  description?: string
  development?: boolean
}

/**
 * Фабрика частиц пространства MetaFor
 * @param tag - Имя частицы
 * @param description - Описание частицы
 * @returns {MetaFor}
 */ // prettier-ignore
export declare function MetaFor(tag: string, options?: ParticleOptions): {
    /**
     * Все возможные состояния частицы
     */
    states: <S extends string>( ...states: S[]) => {
        /**
         * Контекст частицы
         */
        context: <C extends ContextDefinition>(context: (types: ContextTypes) => C) => {
            /**
             * Переходы между состояниями
             */
            transitions: (transitions: Transitions<C, S>) => {
                /**
                 * Ядро частицы
                 */
                core: <I extends CoreObj>(core: CoreDefinition<I, C> = () => Object.create({})) => {
                    /**
                     * Действия частицы
                     */
                    actions: (actions: Actions<C, I>) => {
                        /**
                         * Реакции на изменения других частиц
                         */
                        reactions: (reactions: ReactionType<C, I>) => {
                            /**
                             * Представление отображения частицы
                             */
                            view: (view: ViewDefinition<I, C, S>) => {
                                /**
                                 * Создание базовой частицы с:
                                 * - реакциями
                                 * - представлением отображения
                                 */
                                create: (data: CreateOptions<C, S, I>) => Particle<S, C, I>
                            }
                            /**
                             * Создание частицы с:
                             * - реакциями
                             */
                            create: (data: CreateOptions<C, S, I>) => Particle<S, C, I>
                        },
                        /**
                         * Представление отображения частицы
                         */
                        view: (view: ViewDefinition<I, C, S>) => {
                            /**
                             * Создание базовой частицы с:
                             * - представлением отображения
                             */
                            create: (data: CreateOptions<C, S, I>) => Particle<S, C, I>
                        },
                        /**
                         * Создание базовой частицы.
                         */
                        create: (data: CreateOptions<C, S, I>) => Particle<S, C, I>
                    }
                }
            }
        }
    }
}

/**
 * Интерфейс частицы
 * @template S - Состояния
 * @template C - Контекст
 * @template I - Ядро
 */
export declare class Particle<S extends string, C extends Record<string, any>, I extends Record<string, any>> {
  id: string
  title?: string
  description?: string
  state: S
  context: ContextData<C>
  states: readonly S[]
  types: Record<string, any>
  transitions: Transitions<C, S>
  actions: Actions<C, I>
  core: Core<I>
  reactions: ReactionType<C, I>
  channel: BroadcastChannel
  process: boolean
  component: Element

  constructor(params: ParticleConstructorParams<S, C, I>)

  update: (context: UpdateParameters<C>) => void
  _updateExternal: (params: { context: UpdateParameters<C>; srcName?: string; funcName?: string }) => void
  onUpdate: (listener: (context: OnUpdateContextData<C>) => void) => () => void
  onTransition: (listener: (oldState: S, newState: S) => void) => () => void
  snapshot: () => Snapshot<C, S>
  graph: () => Promise<any>
  destroy: () => void
}
