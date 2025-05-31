/**
 * @typedef {import("./directive").DirectiveClass} DirectiveClass
 * @typedef {import("./directive").PartInfo} PartInfo
 * @typedef {import("./directive").ChildPartInfo} ChildPartInfo
 * @typedef {import("./directive").AttributePartInfo} AttributePartInfo
 * @typedef {import("./directive").ElementPartInfo} ElementPartInfo
 * @typedef {import("./html").Disconnectable} Disconnectable
 * @typedef {import("./html").ChildPart} ChildPart
 * @typedef {import("./html").AttributePart} AttributePart
 * @typedef {import("./html").ElementPart} ElementPart
 * @typedef {import("./html").PropertyPart} PropertyPart
 * @typedef {import("./html").BooleanAttributePart} BooleanAttributePart
 * @typedef {import("./html").EventPart} EventPart
 */

/** @template {DirectiveClass} C
 * @typedef {import("./directive").DirectiveResult<C>} DirectiveResult */

/** @template {Directive} C
 * @typedef {import("./directive").DirectiveParameters<C>} DirectiveParameters */

/**
 * Создает пользовательскую функцию директивы из класса Directive. Эта
 * функция имеет те же параметры, что и метод render() директивы.
 *
 * @template {DirectiveClass} C
 * @param {C} c
 * @returns {(...values: DirectiveParameters<InstanceType<C>>) => DirectiveResult<C>}
 */
export const directive = c => (...values) => ({
  ["_$htmlDirective$"]: c,
  values: /** @type{DirectiveParameters<InstanceType<C>>} **/values
})

export const PartType = {
  ATTRIBUTE: 1,
  CHILD: 2,
  PROPERTY: 3,
  BOOLEAN_ATTRIBUTE: 4,
  EVENT: 5,
  ELEMENT: 6
}

/**
 * @template {DirectiveClass} C
 * @callback DirectiveCallback
 * @param {...DirectiveParameters<InstanceType<C>>} values
 */

/**
 * Базовый класс для создания пользовательских директив. Пользователи должны расширять этот класс,
 * реализовывать `render` и/или `update`, а затем передавать свой подкласс в
 * `directive`.
 */
export class Directive {
  __part = /** @type {import("./html").Part} */ (/** @type {unknown} */ (null))
  /** @type {number | undefined} */ __attributeIndex
  /** @type {Directive | undefined} */ __directive
  /** @type {Disconnectable} */ _$parent = /** @type {Disconnectable} */ (/** @type {unknown} */ (null))
  /** @type {Set<Disconnectable> | undefined} */ _$disconnectableChildren

  /** @param {PartInfo} _partInfo */
  constructor(_partInfo) {
  }

  get _$isConnected() {
    return this._$parent._$isConnected
  }

  /**
   * @param {import("./html").Part} part
   * @param {Disconnectable} parent
   * @param {number | undefined} attributeIndex
   */
  _$initialize(part, parent, attributeIndex) {
    this.__part = part
    this._$parent = parent
    this.__attributeIndex = attributeIndex
  }

  /**
   * @param { ChildPart | AttributePart | PropertyPart | BooleanAttributePart | ElementPart | EventPart} part
   * @param {unknown[]} props
   */
  _$resolve(part, props) {
    return this.update(part, props)
  }

  /** @param {...unknown} props */
  render(...props) {
  }

  /**
   * @param { ChildPart | AttributePart | PropertyPart | BooleanAttributePart | ElementPart | EventPart} part
   * @param {unknown[]} props
   */
  update(part, props) {
    return this.render(...props)
  }
}
