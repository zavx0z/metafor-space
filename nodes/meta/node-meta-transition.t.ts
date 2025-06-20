import meta from "./node-meta-transition.js"
import type {Operators} from "./node-meta-operator.t.ts"

const snapshot = meta.snapshot()

declare global {
  export interface HTMLElementTagNameMap {
    'metafor-node-meta-transition': Meta<typeof snapshot.state, typeof snapshot.context>
  }
}

export type MetaForNodeMetaTransition = typeof snapshot

export interface Core {
  conditions: Port[]
}

/**
 * Извлекает все условия в переходах из снимка meta.
 * Формирует входные порты для каждого условия.
 * Генерирует идентификаторы.
 * Добавляет информацию операторов условий переходов.
 *
 * @param snapshot - Снимок meta.
 * @returns {ConditionsTransitionsPortsData} - Данные условий всех переходов для входных портов.
 *
 * @includeExample ./node-meta-transition.spec.ts
 */
export declare function statesConditions(snapshot: SnapshotMetaForAny): Map<string, ConditionsTransitionPortsData>

/** Данные условий перехода для входных портов. */
export type ConditionsTransitionPortsData = {
  id: string,
  ports: Array<Port>
}

export type Port = {
  id: string,
  operators: Operators
}

/**
 * Извлекает все условия в переходах из снимка meta.
 * Формирует входные порты для каждого условия.
 * Генерирует идентификаторы.
 * Добавляет информацию операторов условий переходов.
 *
 * @param snapshot - Снимок meta.
 * @returns {ConditionsTransitionsPortsData} - Данные условий всех переходов для входных портов.
 *
 * @includeExample ./node-meta-transition.spec.ts
 */
export declare function extractTransitions(snapshot: SnapshotMetaForAny): ConditionsTransitionsPortsData

/**
 * Добавляет информацию операторов условий переходов.
 *
 * @param transitionsConditionsPorts - Входные порты условий всех переходов состояний meta.
 * @param snapshot - Снимок meta.
 * @returns {ConditionsTransitionsPortsData} - Данные условий всех переходов для входных портов.
 *
 * @includeExample ./node-meta-transition.spec.ts
 */
export declare function assignContent(transitionsConditionsPorts: ConditionsTransitionsPorts, snapshot: SnapshotMetaForAny): ConditionsTransitionsPortsData

/** Данные условий всех переходов для входных портов. */
export type ConditionsTransitionsPortsData = ConditionsTransitionPortsData[]


/**
 * Извлекает все условия в переходах из снимка meta.
 * Формирует входные порты для каждого условия.
 * Генерирует идентификаторы.
 *
 * @param snapshot - Снимок meta.
 * @return {ConditionsTransitionsPorts}
 *
 * @includeExample ./node-meta-transition.spec.ts
 */
export declare function extractBaseConditions(snapshot: SnapshotMetaForAny): ConditionsTransitionsPorts

/** Входные порты условий всех переходов состояний meta */
export type ConditionsTransitionsPorts = TransitionConditionsPorts[]

/**
 * Входные порты для условия перехода в состояние из других состояний.
 *
 * @prop id - Путь условия состояния /01975c8b/start/process/condition.
 * 01975c8b - Идентификатор meta.
 * start - Целевое состояние.
 * process - Условие перехода контекстного параметра.
 */
export type TransitionConditionsPorts = {
  id: string
  ports: Array<{
    /**
     * @type id - Путь условия /01975c8b/idle/start/process/west
     * 01975c8b - Идентификатор meta.
     * idle - Исходное состояние.
     * start - Целевое состояние.
     * process - Условие перехода контекстного параметра.
     */
    id: string
  }>
}