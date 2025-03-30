import type {ParticleConstructorParams} from "./types/metafor"
import type {
    ContextData,
    ContextDefinition,
    ContextTypes,
    OnUpdateContextData,
    UpdateParameters,
} from "./types/context"
import type {Transitions} from "./types/transition"
import type {Core, CoreDefinition, CoreObj} from "./types/core"
import type {Actions} from "./types/action"
import type {ReactionType} from "./types/reaction"
import type {ViewDefinition} from "./types/view"

import type {FabricCallbackCreateProps} from "./types/fabric";

/**
 * Конфигурация частицы
 * @property description - Описание частицы
 * @property development - Режим разработки (подключена валидация)
 */
export type ParticleConf = {
  description?: string
  development?: boolean
}

/**
 * Фабрика частиц пространства MetaFor
 * @param tag - Имя частицы
 * @param conf - Конфигурация частицы
 * @returns {MetaFor}
 */ // prettier-ignore
export declare function MetaFor(tag: string, conf?: ParticleConf): {
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
                                create: (data: FabricCallbackCreateProps<C, S, I>) => Particle<S, C, I>
                            }
                            /**
                             * Создание частицы с:
                             * - реакциями
                             */
                            create: (data: FabricCallbackCreateProps<C, S, I>) => Particle<S, C, I>
                        },
                        /**
                         * Представление отображения частицы
                         */
                        view: (view: ViewDefinition<I, C, S>) => {
                            /**
                             * Создание базовой частицы с:
                             * - представлением отображения
                             */
                            create: (data: FabricCallbackCreateProps<C, S, I>) => Particle<S, C, I>
                        },
                        /**
                         * Создание базовой частицы.
                         */
                        create: (data: FabricCallbackCreateProps<C, S, I>) => Particle<S, C, I>
                    }
                }
            }
        }
    }
}

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
 * Интерфейс частицы
 * @template S - Состояния
 * @template C - Контекст
 * @template I - Ядро
 * @property id - Идентификатор частицы
 * @property title - Заголовок частицы
 * @property description - Описание частицы
 * @property state - Состояние частицы
 * @property context - Контекст частицы
 * @property states - Состояния частицы
 * @property types - Типы частицы
 * @property transitions - Переходы частицы
 * @property actions - Действия частицы
 * @property core - Ядро частицы
 * @property reactions - Реакции частицы
 * @property channel - Канал частицы
 * @property process - Флаг процесса частицы
 * @property component - Компонент частицы
 * @property update - Обновление частицы    
 * @property _updateExternal - Обновление частицы из вне
 * @property onUpdate - Обработчик обновления частицы
 * @property onTransition - Обработчик перехода частицы
 * @property snapshot - Снимок частицы
 * @property graph - Граф частицы
 * @property destroy - Уничтожение частицы
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