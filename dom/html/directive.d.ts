//@ts-nocheck
import type {Part} from "./html"

/**
 * Сгенерированная функция директивы не вычисляет директиву, а просто
 * возвращает объект DirectiveResult, который захватывает аргументы.
 */
export interface DirectiveResult<C extends DirectiveClass = DirectiveClass> {
    ["_$htmlDirective$"]: C
    /** @internal */
    values: DirectiveParameters<InstanceType<C>>
}

export interface DirectiveClass {
    new(part: PartInfo): Directive
}

/**
 * Этот служебный тип извлекает сигнатуру метода render() класса директивы,
 * чтобы мы могли использовать её для типа сгенерированной функции директивы.
 */
export type DirectiveParameters<C extends Directive> = Parameters<C["render"]>

/**
 * Информация о части, к которой привязана директива.
 *
 * Это полезно для проверки того, что директива прикреплена к допустимой части,
 * например, с директивой, которая может использоваться только для привязок атрибутов.
 */
export type PartInfo = ChildPartInfo | AttributePartInfo | ElementPartInfo

export enum PartType {
    ATTRIBUTE = 1,
    CHILD = 2,
    PROPERTY = 3,
    BOOLEAN_ATTRIBUTE = 4,
    EVENT = 5,
    ELEMENT = 6
}

export interface ChildPartInfo {
    readonly type: typeof PartType.CHILD
}

export interface AttributePartInfo {
    readonly type:
        | typeof PartType.ATTRIBUTE
        | typeof PartType.PROPERTY
        | typeof PartType.BOOLEAN_ATTRIBUTE
        | typeof PartType.EVENT
    readonly strings?: ReadonlyArray<string>
    readonly name: string
    readonly tagName: string
}

export interface ElementPartInfo {
    readonly type: typeof PartType.ELEMENT
}

/**
 * Базовый класс для создания пользовательских директив. Пользователи должны расширять этот класс,
 * реализовывать `render` и/или `update`, а затем передавать свой подкласс в
 * `directive`.
 */
export abstract class Directive implements Disconnectable {
    //@internal
    __part: Part
    //@internal
    __attributeIndex: number | undefined
    //@internal
    __directive?: Directive

    //@internal
    _$parent: Disconnectable

    // Эти свойства будут только на подклассе AsyncDirective
    //@internal
    _$disconnectableChildren?: Set<Disconnectable>
    // Это свойство должно оставаться не минифицированным.
    //@internal
    _$notifyDirectiveConnectionChanged?(isConnected: boolean): void

    protected constructor(_partInfo: PartInfo) {
    }

    // См комментарий в интерфейсе Disconnectable для почему это геттер
    get _$isConnected() {
        return this._$parent._$isConnected
    }

    /** @internal */
    _$initialize(part: Part, parent: Disconnectable, attributeIndex: number | undefined) {
        this.__part = part
        this._$parent = parent
        this.__attributeIndex = attributeIndex
    }

    /** @internal */
    _$resolve(part: Part, props: Array<unknown>): unknown {
        return this.update(part, props)
    }

    abstract render(...props: Array<unknown>): unknown

    update(_part: Part, props: Array<unknown>): unknown {
        return this.render(...props)
    }
}

export interface Disconnectable {
    _$parent?: Disconnectable
    _$disconnectableChildren?: Set<Disconnectable>
    // Вместо хранения состояния подключения в экземплярах, Disconnectables рекурсивно
    // получают состояние подключения из RootPart, к которому они подключены, через
    // геттеры вверх по дереву Disconnectable через ссылки _$parent. Это перекладывает
    // стоимость отслеживания состояния isConnected на `AsyncDirectives` и позволяет избежать
    // необходимости передавать всем Disconnectables (частям, экземплярам шаблонов и
    // директивам) их состояние подключения при каждом его изменении, что было бы
    // затратно для деревьев без AsyncDirectives.
    _$isConnected: boolean
}

/**
 * Проверяет, имеет ли часть только одно выражение без строк для интерполяции между ними.
 *
 * Только AttributePart и PropertyPart могут иметь несколько выражений.
 * Части с несколькими выражениями имеют свойство `strings`, а части с одним выражением - нет.
 */
export type IsSingleExpression = (part: PartInfo) => boolean

/**
 * Набор пар ключ-значение CSS свойств и их значений.
 *
 * Ключ должен быть либо валидным именем CSS свойства в виде строки, как
 * `'background-color'`, либо валидным JavaScript именем в camelCase для
 * CSSStyleDeclaration, как `backgroundColor`.
 */
export interface StyleInfo {
    [name: string]: string | number | undefined | null;
}

/**
 * Набор ключ-значение для имен классов и их значений (истинных или ложных).
 */
export interface ClassInfo {
    readonly [name: string]: string | boolean | number;
}

/**
 * Создает пользовательскую функцию директивы из класса Directive. Эта
 * функция имеет те же параметры, что и метод render() директивы.
 *
 * @param c
 */
export declare function directive<C extends DirectiveClass>(c: C): (...values: DirectiveParameters<InstanceType<C>>) => DirectiveResult<C>