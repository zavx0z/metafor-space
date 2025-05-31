import {AsyncDirective, directive} from "../async-directive.js"
import {nothing} from "../html.js"

/** @type {import("./ref").createRef} */
export const createRef = () => new Ref()

/** @typedef {import("./ref.t.ts").Ref} RefClass
 * @implements {RefClass} */
export class Ref {
  value = undefined
}

/** @type {import("./ref.t").lastElementForContextAndCallback} **/
const lastElementForContextAndCallback = new WeakMap()

/** @template {Element} T */
export class RefDirective extends AsyncDirective {
  /** @type {Element | undefined} */ #elementDirectiveResult
  /** @type {import("./ref.t.ts").RefOrCallback<T> | undefined} */ #ref
  /** @type {object | undefined} */ #context

  /**
   * @param {import("./ref.t.ts").RefOrCallback<T>} [_ref]
   * @returns {typeof nothing}
   */
  render(_ref) {
    return nothing
  }

  /**
   * @param {import("../html").ElementPart} part
   * @param {[import("./ref.t.ts").RefOrCallback<T>]} args
   * @returns {typeof nothing}
   */
  update(part, [ref]) {
    const refChanged = ref !== this.#ref
    // Если переданная в директиву ref изменилась, сбрасываем значение предыдущей ref
    if (refChanged && this.#ref !== undefined) this.#updateRefValue(undefined)
    // Мы получили новую ref или это первый рендер - сохраняем ref/элемент и обновляем значение ref
    if (refChanged || this.#lastElementForRef !== this._element) {
      this.#ref = ref
      this.#context = part.options?.host
      this.#updateRefValue((this._element = part.element))
    }
    return nothing
  }

  /** @param {Element | undefined} element */
  #updateRefValue(element) {
    if (!this.isConnected) element = undefined
    if (typeof this.#ref === "function") {
      // Если текущая ref была вызвана с предыдущим значением, вызываем с
      // `undefined`; Мы делаем это, чтобы обеспечить согласованный вызов
      // колбэков независимо от того, перемещается ли ref вверх по дереву
      // (в этом случае он был бы вызван с новым значением до того, как
      // предыдущее значение будет сброшено) или вниз по дереву (где он был бы
      // сброшен перед установкой). Обратите внимание, что поиск элемента
      // привязан как к контексту, так и к колбэку, поскольку мы позволяем
      // передавать несвязанные функции, которые вызываются на options.host,
      // и мы хотим рассматривать их как уникальные "экземпляры" функции.
      const context = this.#context ?? globalThis
      let lastElementForCallback = lastElementForContextAndCallback.get(context)
      if (!lastElementForCallback) {
        lastElementForCallback = new WeakMap()
        lastElementForContextAndCallback.set(context, lastElementForCallback)
      }
      if (lastElementForCallback.get(this.#ref) !== undefined) this.#ref.call(this.#context, undefined)
      lastElementForCallback.set(this.#ref, element)
      if (element !== undefined) this.#ref.call(this.#context, /** @type {T} */ (element))
    } else if (this.#ref) this.#ref.value = /** @type {T} */ (element)

  }

  /** @returns {Element | undefined} */
  get #lastElementForRef() {
    return typeof this.#ref === "function"
      ? lastElementForContextAndCallback.get(this.#context ?? globalThis)?.get(this.#ref)
      : this.#ref?.value
  }

  /**
   * Очищаем контейнер только если наш элемент все еще находится в нем (т.е. другой
   * экземпляр директивы не отрендерил свой элемент в него перед нами); это
   * происходит только в случае очистки директивы (не через ручное отключение)
   */
  disconnected() {
    if (this.#lastElementForRef === this._element) {
      this.#updateRefValue(undefined)
    }
  }

  /**
   Если мы были вручную отключены, мы можем безопасно вернуть наш элемент
   обратно в контейнер, так как никакого рендеринга не могло произойти,
   чтобы изменить его состояние
   **/
  reconnected() {
    this.#updateRefValue(this._element)
  }
}

export const ref = directive(RefDirective)
