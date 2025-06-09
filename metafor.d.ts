import type {ContextData, ContextDefinition, ContextTypes, UpdateParameters} from "./types/context.ts"
import type {Transitions} from "./types/transitions.ts"
import type {Core, CoreDefinition, CoreObj} from "./types/core.ts"
import type {Reactions} from "./types/reaction.ts"
import type {ViewDefinition} from "./types/view.ts"
import type {CreateParams} from "./types/create.ts"
import type {MetaConstructor, Snapshot, OnUpdate, OnTransition} from "./types/meta.ts"

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
        transitions: (transitions: Transitions<S, C, I>) => {
          reactions: (reactions: Reactions<C, I>) => {
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

/**
 Meta - класс частицы

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
 @property transitions - Переходы meta
 @property core - Ядро meta
 @property reactions - Реакции meta
 @property channel - Канал meta
 @property process - Флаг процесса meta
 @property component - Компонент meta
 @property update - Обновление meta
 @property _updateExternal - Обновление meta из вне
 @property onUpdate - Обработчик обновления meta
 @property onTransition - Обработчик перехода meta
 @property snapshot - Снимок meta
 @property graph - Граф meta
 @property destroy - Уничтожение meta
 */
export declare class Meta<S extends string, C extends ContextDefinition, I extends Record<string, any>> extends HTMLElement{
  id: string
  title: string
  description: string
  state: S
  context: ContextData<C>
  states: readonly (S | undefined)[]
  types: Record<string, any>
  transitions: Transitions<S, C, I>
  reactions: Reactions<C, I>
  channel: BroadcastChannel
  process: boolean
  component: HTMLElement | Element

  constructor(params: MetaConstructor<S, C, I>)

  update: (context: UpdateParameters<C>) => void
  _updateExternal: (params: { context: UpdateParameters<C>; srcName?: string; funcName?: string }) => void
  onUpdate: OnUpdate<C>
  onTransition: OnTransition<S>
  snapshot: () => Snapshot<S, C, I>
  graph: () => Promise<any>
  destroy: () => void
}
