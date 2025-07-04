import type {Part} from "./html";
import type {Disconnectable, PartInfo} from "./directive";

/**
 * Базовый класс для создания пользовательских директив. Пользователи должны расширять этот класс,
 * реализовывать `render` и/или `update`, а затем передавать свой подкласс в
 * `directive`.
 */
export abstract class Directive implements Disconnectable {
    //@internal
    __part!: Part
    //@internal
    __attributeIndex: number | undefined
    //@internal
    __directive?: Directive

    //@internal
    _$parent!: Disconnectable

    // Эти свойства будут только на подклассе AsyncDirective
    //@internal
    _$disconnectableChildren?: Set<Disconnectable>
    // Это свойство должно оставаться не минифицированным.
    //@internal
    _$notifyDirectiveConnectionChanged?(isConnected: boolean): void

    constructor(_partInfo: PartInfo) {
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