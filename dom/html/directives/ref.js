import {AsyncDirective, directive} from "../async-directive.js"
import {nothing} from "../html.js"

/**
 * Создает новый объект Ref, который является контейнером для ссылки на элемент.
 * @template {Element} T
 * @returns {Ref<T>}
 */
export const createRef = () => new Ref()

/**
 * @template {Element} T
 * @typedef {Ref<T> | ((el: T | undefined) => void)} RefOrCallback
 */

/**
 * Объект, который содержит значение ссылки.
 * @template {Element} T
 */
class Ref {
  /**
   * @type {T | undefined}
   */
  value
}

export {Ref}

/**
 * Когда для ссылок используются колбэки, эта карта отслеживает последнее значение,
 * с которым был вызван колбэк, чтобы директива не очищала ссылку, если она уже
 * была отрендерена в новом месте.
 * Карта имеет двойной ключ - контекст (`options.host`) и колбэк, 
 * поскольку мы автоматически привязываем методы класса к `options.host`.
 *
 * @typedef {object} RefInternal
 * @property {Element | undefined} value
 */
const lastElementForContextAndCallback = new WeakMap()

/**
 * @template {Element} T
 */
export class RefDirective extends AsyncDirective {
  /**
   * @private
   * @type {Element | undefined}
   */
  _element

  /**
   * @private
   * @type {RefOrCallback<T> | undefined}
   */
  _ref

  /**
   * @private
   * @type {object | undefined}
   */
  _context

  /**
   * @param {RefOrCallback<T>} [_ref]
   * @returns {typeof nothing}
   */
  render(_ref) {
    return nothing
  }

  /**
   * @param {import("../types/html").ElementPart} part
   * @param {[RefOrCallback<T>]} args
   * @returns {typeof nothing}
   */
  update(part, [ref]) {
    const refChanged = ref !== this._ref
    if (refChanged && this._ref !== undefined) {
      this._updateRefValue(undefined)
    }
    if (refChanged || this._lastElementForRef !== this._element) {
      this._ref = ref
      this._context = part.options?.host
      this._updateRefValue((this._element = part.element))
    }
    return nothing
  }

  /**
   * @private
   * @param {Element | undefined} element
   */
  _updateRefValue(element) {
    if (!this.isConnected) {
      element = undefined
    }
    if (typeof this._ref === "function") {
      const context = this._context ?? globalThis
      let lastElementForCallback = lastElementForContextAndCallback.get(context)
      if (!lastElementForCallback) {
        lastElementForCallback = new WeakMap()
        lastElementForContextAndCallback.set(context, lastElementForCallback)
      }
      if (lastElementForCallback.get(this._ref) !== undefined) {
        this._ref.call(this._context, undefined)
      }
      lastElementForCallback.set(this._ref, element)
      if (element !== undefined) {
        this._ref.call(this._context, /** @type {T} */ (element))
      }
    } else if (this._ref) {
      /** @type {RefInternal} */
      this._ref.value = /** @type {T | undefined} */ (element)
    }
  }

  /**
   * @private
   * @returns {Element | undefined}
   */
  get _lastElementForRef() {
    return typeof this._ref === "function"
      ? lastElementForContextAndCallback.get(this._context ?? globalThis)?.get(this._ref)
      : this._ref?.value
  }

  disconnected() {
    if (this._lastElementForRef === this._element) {
      this._updateRefValue(undefined)
    }
  }

  reconnected() {
    this._updateRefValue(this._element)
  }
}

export const ref = directive(RefDirective)
