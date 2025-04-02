import type {
  ContextData,
  ContextDefinition,
  ContextTypes,
  OnUpdateContextData,
  UpdateParameters,
} from "./types/context"
import type { Transitions } from "./types/transitions"
import type { Core, CoreDefinition, CoreObj } from "./types/core"
import type { Actions } from "./types/actions"
import type { ReactionType } from "./types/reaction"
import type { ViewDefinition } from "./types/view"

import type { CreateParams } from "./types/create"
import type { MetaConstructor, Snapshot } from "./types/meta"

/**
 # Фабрика частиц (Акторов)

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

 ## Схемы создания частиц:
 - Базовая
 - С представлением
 - С реакциями
 - С представлением и реакциями

 ## Состоит из этапов:
 1. Определение имени и опций частицы
 2. Определение состояний частицы
 3. Определение контекста частицы
 4. Определение переходов между состояниями
 5. Определение ядра частицы
 6. Определение действий частицы
 7. Определение реакций частицы
 @param tag - Имя частицы
 @param [conf] - Конфигурация частицы
 @param conf.description - Описание частицы
 @param conf.development - Режим разработки (подключена валидация)
 */
export declare function MetaFor(
  tag: string,
  conf?: {
    description?: string
    development?: boolean
  }
): {
  states: <S extends string>(
    ...states: S[]
  ) => {
    context: <C extends ContextDefinition>(
      context: (types: ContextTypes) => C
    ) => {
      transitions: (transitions: Transitions<C, S>) => {
        core: <I extends CoreObj>(
          core: CoreDefinition<I, C> = () => Object.create({})
        ) => {
          actions: (actions: Actions<C, I>) => {
            reactions: (reactions: ReactionType<C, I>) => {
              view: (view: ViewDefinition<I, C, S>) => {
                create: (data: CreateParams<C, S, I>) => Meta<S, C, I>
              }
              create: (data: CreateParams<C, S, I>) => Meta<S, C, I>
            }
            view: (view: ViewDefinition<I, C, S>) => {
              create: (data: CreateParams<C, S, I>) => Meta<S, C, I>
            }
            create: (data: CreateParams<C, S, I>) => Meta<S, C, I>
          }
        }
      }
    }
  }
}

/**
 Meta -

 @template S - Состояния
 @template C - Контекст
 @template I - Ядро

 @property id - Идентификатор частицы
 @property title - Заголовок частицы
 @property description - Описание частицы
 @property state - Состояние частицы
 @property context - Контекст частицы
 @property states - Состояния частицы
 @property types - Типы частицы
 @property transitions - Переходы частицы
 @property actions - Действия частицы
 @property core - Ядро частицы
 @property reactions - Реакции частицы
 @property channel - Канал частицы
 @property process - Флаг процесса частицы
 @property component - Компонент частицы
 @property update - Обновление частицы
 @property _updateExternal - Обновление частицы из вне
 @property onUpdate - Обработчик обновления частицы
 @property onTransition - Обработчик перехода частицы
 @property snapshot - Снимок частицы
 @property graph - Граф частицы
 @property destroy - Уничтожение частицы
 */
export declare class Meta<S extends string, C extends Record<string, any>, I extends Record<string, any>> {
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

  constructor(params: MetaConstructor<S, C, I>)

  update: (context: UpdateParameters<C>) => void
  _updateExternal: (params: { context: UpdateParameters<C>; srcName?: string; funcName?: string }) => void
  onUpdate: (listener: (context: OnUpdateContextData<C>) => void) => () => void
  onTransition: (listener: (oldState: S, newState: S) => void) => () => void
  snapshot: () => Snapshot<C, S>
  graph: () => Promise<any>
  destroy: () => void
}
