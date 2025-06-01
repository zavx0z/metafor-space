import type {Ref, RefOrCallback} from "./ref.t.ts"
import type {DirectiveResult} from "../directive.d.ts"

/** Создает новый объект Ref, который является контейнером для ссылки на элемент. **/
export declare function createRef<T = Element>(): Ref<T>

/**
 * Устанавливает значение объекта Ref или вызывает callback-функцию ref с привязанным
 * к ней элементом.
 *
 * Объект Ref действует как контейнер для ссылки на элемент. Callback-функция ref -
 * это функция, которая принимает элемент в качестве единственного аргумента.
 *
 * Директива ref устанавливает значение объекта Ref или вызывает callback-функцию ref
 * во время рендеринга, если связанный элемент изменился.
 *
 * Примечание: Если callback-функция ref рендерится в другую позицию элемента или
 * удаляется при последующем рендеринге, она сначала будет вызвана с `undefined`,
 * а затем с новым элементом, к которому она была привязана (если таковой имеется).
 *
 * @example
 * // Использование объекта Ref
 * const inputRef = createRef();
 * render(html`<input ${ref(inputRef)}>`, container);
 * inputRef.value.focus();
 *
 * // Использование callback-функции
 * const callback = (inputElement) => inputElement.focus();
 * render(html`<input ${ref(callback)}>`, container);
 */
export declare const ref: (_ref?: (RefOrCallback | undefined)) => DirectiveResult