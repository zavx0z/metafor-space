import type {ContextDefinition} from "./types/context";
import type {Actions} from "./types/actions";
import type {CoreDefinition} from "./types/core";
import type {ReactionType} from "./types/reaction";
import type {FabricCallbackCreateProps} from "./types/create";
import type {Transitions} from "./types/transitions";

/**
 Параметры для функции используемой в коллбеке create

 @template C - контекст
 @template S - состояние
 @template I - core

 @property development - режим разработки
 @property description - описание
 @property tag - тег
 @property options - опции
 @property states - состояния
 @property contextDefinition - определение контекста
 @property transitions - переходы
 @property actions - действия
 @property coreDefinition - определение ядра
 @property reactions - реакции
 */
export type FabricCallbackCreateFuncHelper<
    S extends string,
    C extends ContextDefinition,
    I extends Record<string, any>
> = {
    development?: boolean
    description?: string
    tag: string
    options: FabricCallbackCreateProps<C, S, I>
    states: S[]
    contextDefinition: ContextDefinition
    transitions: Transitions<C, S>
    actions: Actions<C, I>
    coreDefinition: CoreDefinition<I, C>
    reactions: ReactionType<C, I>
}