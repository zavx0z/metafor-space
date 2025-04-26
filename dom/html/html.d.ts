import type { ResultType, TemplateResult } from "./types/html"
// import type { Directive } from "./directive"
// import type { PartInfo } from "./types/directives"
// import type { Disconnectable } from "./types/html"
// import type { ChildPart, AttributePart, ElementPart, RootPart } from "./types/part"

/**
 * Сигнальное значение, которое указывает ChildPart полностью очистить свое содержимое.
 *
 * ```ts
 * const button = html`${
 *  user.isAdmin
 *    ? html`<button>DELETE</button>`
 *    : nothing
 * }`;
 * ```
 *
 * Рекомендуется использовать `nothing` вместо других ложных значений, так как это обеспечивает
 * согласованное поведение между различными контекстами привязки выражений.
 *
 * В дочерних выражениях `undefined`, `null`, `''` и `nothing` ведут себя одинаково
 * и не отрисовывают узлы. В выражениях атрибутов `nothing` _удаляет_ атрибут,
 * в то время как `undefined` и `null` отрисуют пустую строку. В выражениях свойств
 * `nothing` становится `undefined`.
 */
export declare const nothing = typeof Symbol.for("nothing")
/** Символ, который сигнализирует, что значение было обработано директивой и не должно быть записано в DOM. */
export declare const noChange = typeof Symbol.for("noChange")

// export declare const DEV_MODE: boolean
// export declare const policy: TrustedTypePolicy | undefined
// export declare const noopSanitizer: (node: Node, name: string, type: "property" | "attribute") => (value: unknown) => unknown
// export declare const isPrimitive: (value: unknown) => boolean
// export declare const isArray: (value: unknown) => boolean
// export declare const isIterable: (value: unknown) => boolean
// export declare const boundAttributeSuffix: string
// export declare const marker: string
// export declare const markerMatch: string
// export declare const nodeMarker: string
// export declare const createMarker: () => Comment
// export declare const HTML_RESULT: 1
// export declare const SVG_RESULT: 2
// export declare const MATHML_RESULT: 3
// export declare const ATTRIBUTE_PART: 1
// export declare const CHILD_PART: 2
// export declare const PROPERTY_PART: 3
// export declare const BOOLEAN_ATTRIBUTE_PART: 4
// export declare const EVENT_PART: 5
// export declare const ELEMENT_PART: 6
// export declare const COMMENT_PART: 7
// export declare const SPACE_CHAR: string
// export declare const ATTR_VALUE_CHAR: string
// export declare const NAME_CHAR: string
// export declare const textEndRegex: RegExp
// export declare const COMMENT_START: 1
// export declare const TAG_NAME: 2
// export declare const DYNAMIC_TAG_NAME: 3
// export declare const commentEndRegex: RegExp
// export declare const comment2EndRegex: RegExp
// export declare const tagEndRegex: RegExp
// export declare const ENTIRE_MATCH: 0
// export declare const ATTRIBUTE_NAME: 1
// export declare const SPACES_AND_EQUALS: 2
// export declare const QUOTE_CHAR: 3
// export declare const singleQuoteAttrEndRegex: RegExp
// export declare const doubleQuoteAttrEndRegex: RegExp
// export declare const rawTextElement: RegExp
// export declare const templateCache: WeakMap<TemplateStringsArray, Template>
// export declare const walker: TreeWalker

/**
 * Генерирует функцию тега шаблона, которая возвращает TemplateResult с заданным типом результата.
 */
export type TagFunction = <T extends ResultType>(
  type: T
) => (strings: TemplateStringsArray, ...values: unknown[]) => TemplateResult<T>

export declare function render(
  result: TemplateResult<1> | TemplateResult<2> | TemplateResult<3>,
  container: HTMLElement,
  options?: RenderOptions
): void

/**
 * Интерпретирует литерал шаблона как HTML-шаблон, который может эффективно отрисовываться и обновлять контейнер.
 *
 * ```ts
 * const header = (title: string) => html`<h1>${title}</h1>`;
 * ```
 *
 * Тег `html` возвращает описание DOM для отрисовки в виде значения. Он является
 * ленивым, то есть никакая работа не выполняется до момента рендеринга шаблона. При рендеринге,
 * если шаблон происходит из того же выражения, что и ранее отрисованный результат,
 * он эффективно обновляется вместо полной замены.
 *
 * @returns {(strings: TemplateStringsArray, ...values: unknown[]) => TemplateResult<1>}
 */
export declare function html(strings: TemplateStringsArray, ...values: unknown[]): TemplateResult<1>

/**
 * Интерпретирует литерал шаблона как SVG-фрагмент, который может эффективно отрисовываться и обновлять контейнер.
 *
 * ```ts
 * const rect = svg`<rect width="10" height="10"></rect>`;
 *
 * const myImage = html`
 *   <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
 *     ${rect}
 *   </svg>`;
 * ```
 *
 * Тег-функция `svg` должна использоваться только для SVG-фрагментов или элементов,
 * которые должны находиться **внутри** HTML-элемента `<svg>`. Распространенная ошибка -
 * размещение *элемента* `<svg>` в шаблоне с тегом-функцией `svg`. Элемент `<svg>`
 * является HTML-элементом и должен использоваться в шаблоне с тегом-функцией {@linkcode html}.
 *
 * При использовании недопустимо возвращать SVG-фрагмент из метода
 * `render()`, так как SVG-фрагмент будет содержаться в теневом DOM элемента
 * и, следовательно, не будет правильно размещен внутри HTML-элемента `<svg>`.
 *
 * @returns {(strings: TemplateStringsArray, ...values: unknown[]) => TemplateResult<2>}
 */
export declare function svg(strings: TemplateStringsArray, ...values: unknown[]): TemplateResult<2>

/**
 * Интерпретирует литерал шаблона как MathML-фрагмент, который может эффективно отрисовываться и обновлять контейнер.
 * @example
 *
 * ```ts
 * const num = mathml`<mn>1</mn>`;
 *
 * const eq = html`
 *   <math>
 *     ${num}
 *   </math>`;
 * ```
 *
 * Тег-функция `mathml` должна использоваться только для MathML-фрагментов или элементов,
 * которые должны находиться **внутри** HTML-элемента `<math>`. Распространенная ошибка -
 * размещение *элемента* `<math>` в шаблоне с тегом-функцией `mathml`. Элемент `<math>`
 * является HTML-элементом и должен использоваться в шаблоне с тегом-функцией {@linkcode html}.
 *
 * При использовании недопустимо возвращать MathML-фрагмент из метода
 * `render()`, так как MathML-фрагмент будет содержаться в теневом DOM элемента
 * и, следовательно, не будет правильно размещен внутри HTML-элемента `<math>`.
 *
 * @template T
 * @param {T} type
 * @returns {(strings: TemplateStringsArray, ...values: unknown[]) => TemplateResult<3>}
 */
export declare function mathml(strings: TemplateStringsArray, ...values: any[]): TemplateResult<3>

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
export type Reference = <T extends Element>(ref: (el: Element | undefined) => void) => RefDirective

// /**
//  * Создает безопасный HTML из строки шаблона.
//  * @param tsa - Массив строк шаблона
//  * @param stringFromTSA - Строка из массива строк шаблона
//  * @returns TrustedHTML
//  */
// export declare function trustFromTemplateString(tsa: TemplateStringsArray, stringFromTSA: string): TrustedHTML

// /**
//  * Разрешает директиву для части.
//  * @param part - Часть
//  * @param value - Значение
//  * @param parent - Родитель
//  * @param attributeIndex - Индекс атрибута
//  * @returns Разрешенное значение
//  */
// export declare function resolveDirective(
//   part: ChildPart | AttributePart | ElementPart,
//   value: unknown,
//   parent?: DirectiveParent,
//   attributeIndex?: number
// ): unknown

// /**
//  * Получает HTML шаблона.
//  * @param strings - Массив строк шаблона
//  * @param type - Тип результата
//  * @returns Массив, содержащий [html, attrNames]
//  */
// export declare function getTemplateHtml(
//   strings: TemplateStringsArray,
//   type: ResultType
// ): [TrustedHTML, string[]]

// /**
//  * Устанавливает глобально фабрику санитизации.
//  * @param newSanitizer - Новая фабрика санитизации
//  */
// export declare function setSanitizer(
//   newSanitizer: (node: Node, name: string, type: "property" | "attribute") => (value: unknown) => unknown
// ): void

// /**
//  * Создает санитизатор для узла.
//  * @param node - Узел
//  * @param name - Имя
//  * @param type - Тип
//  * @returns Функция санитизации
//  */
// export declare function createSanitizer(
//   node: Node,
//   name: string,
//   type: "property" | "attribute"
// ): (value: unknown) => unknown

// /**
//  * Класс шаблона.
//  */
// export declare class Template {
//   el: HTMLTemplateElement
//   parts: TemplatePart[]

//   constructor(params: UncompiledTemplateResult, options?: RenderOptions)

//   static createElement(html: TrustedHTML, _options?: RenderOptions): HTMLTemplateElement
// }

// /**
//  * Экземпляр шаблона.
//  */
// export declare class TemplateInstance {
//   _$parts: (ChildPart | AttributePart | ElementPart)[]
//   _$disconnectableChildren?: Set<Disconnectable>

//   constructor(template: Template, parent: ChildPart)

//   get parentNode(): Node

//   get _$isConnected(): boolean

//   _clone(options?: RenderOptions): DocumentFragment

//   _update(values: unknown[]): void
// }

// /**
//  * Часть для дочерних элементов.
//  */
// export declare class ChildPart {
//   type: typeof CHILD_PART
//   _$committedValue: unknown
//   _textSanitizer?: (value: unknown) => unknown
//   _$parent?: Disconnectable
//   _$disconnectableChildren?: Set<Disconnectable>
//   _$notifyConnectionChanged?: (isConnected: boolean, removeFromParent?: boolean, from?: number) => void
//   _$reparentDisconnectables?: (parent: Disconnectable) => void

//   constructor(startNode: ChildNode, endNode: ChildNode | null, parent?: TemplateInstance | ChildPart, options?: RenderOptions)

//   get _$isConnected(): boolean

//   get parentNode(): Node

//   get startNode(): Node

//   get endNode(): Node | null

//   _$setValue(value: unknown, directiveParent?: DirectiveParent): void

//   _insert<T extends Node>(node: T): T

//   _commitNode(value: Node): void

//   _commitText(value: unknown): void

//   _commitTemplateResult(result: TemplateResult<any> | CompiledTemplateResult): void

//   _$getTemplate(result: UncompiledTemplateResult): Template

//   _commitIterable(value: Iterable<unknown>): void

//   _$clear(start?: ChildNode | null, from?: number): void

//   setConnected(isConnected: boolean): void
// }

/**
 * Часть для атрибутов.
 */
export declare class AttributePart {
  type: typeof ATTRIBUTE_PART
  element: HTMLElement
  name: string
  options?: RenderOptions
  /**
   * Если этот атрибут часть представляет собой интерполяцию, это содержит статические строки интерполяции.
   * Для однозначных, полных привязок это undefined.
   */
  strings?: ReadonlyArray<string>
  // _$committedValue: unknown | unknown[]
  // _$disconnectableChildren?: Set<Disconnectable>
  // _sanitizer?: (value: unknown) => unknown
  // _$parent: Disconnectable

  constructor(
    element: HTMLElement,
    name: string,
    strings: ReadonlyArray<string>,
    parent: Disconnectable,
    options?: RenderOptions
  )

  get tagName(): string

  // get _$isConnected(): boolean

  // _$setValue(value: unknown | unknown[], directiveParent?: DirectiveParent, valueIndex?: number, noCommit?: boolean): void

  // _commitValue(value: unknown): void
}

// /**
//  * Часть для свойств.
//  */
// export declare class PropertyPart extends AttributePart {
//   type: typeof PROPERTY_PART

//   _commitValue(value: unknown): void
// }

// /**
//  * Часть для булевых атрибутов.
//  */
// export declare class BooleanAttributePart extends AttributePart {
//   type: typeof BOOLEAN_ATTRIBUTE_PART

//   _commitValue(value: unknown): void
// }

// /**
//  * Часть для событий.
//  */
// export declare class EventPart extends AttributePart {
//   type: typeof EVENT_PART

//   constructor(element: HTMLElement, name: string, strings: ReadonlyArray<string>, parent: Disconnectable, options?: RenderOptions)

//   _$setValue(newListener: unknown, directiveParent?: DirectiveParent): void

//   handleEvent(event: Event): void
// }

// /**
//  * Часть для элементов.
//  */
// export declare class ElementPart {
//   type: typeof ELEMENT_PART
//   _$committedValue: undefined
//   _$disconnectableChildren?: Set<Disconnectable>

//   constructor(element: Element, parent: Disconnectable, options?: RenderOptions)

//   get _$isConnected(): boolean

//   _$setValue(value: unknown): void
// }

// /**
//  * Очищает фабрику санитизации. Используется только во внутренних тестах, не является частью публичного API.
//  */
// export declare function _testOnlyClearSanitizerFactoryDoNotCallOrElse(): void

// // Добавляем типы для RenderOptions, которые используются в render
// export interface RenderOptions {
//   /** Объект для использования в качестве `this` для обработчиков событий. Часто
//    * полезно установить это значение равным хосту компонента, который рендерит шаблон. */
//   host?: object
//   /** DOM узел перед которым будет отрисован контент в контейнере. */
//   renderBefore?: ChildNode | null
//   /** Узел, используемый для клонирования шаблона (`importNode` будет вызван на этом узле).
//    * Это контролирует `ownerDocument` отрисованного DOM, а также любой наследуемый контекст.
//    * По умолчанию используется глобальный `document`. */
//   creationScope?: { importNode(node: Node, deep?: boolean): Node }
//   /**
//    * Начальное состояние подключения для верхнего уровня части, которая отрисовывается.
//    * Если не установлен параметр `isConnected`, `AsyncDirective`s будут подключены по умолчанию.
//    * Установите значение `false`, если начальный рендеринг происходит в отключенном дереве
//    * и `AsyncDirective`s должны увидеть `isConnected === false` для их начального рендеринга.
//    * Метод `part.setConnected()` должен быть использован после начального рендеринга, чтобы изменить состояние подключения части.
//    */
//   isConnected?: boolean
// }

// // Добавляем типы для UncompiledTemplateResult и CompiledTemplateResult
// export interface UncompiledTemplateResult<T extends ResultType = ResultType> {
//   ["_$htmlType$"]: T
//   strings: TemplateStringsArray
//   values: unknown[]
// }

// export interface CompiledTemplateResult {
//   ["_$htmlType$"]: CompiledTemplate
//   values: unknown[]
// }

// export interface CompiledTemplate extends Omit<Template, "el"> {
//   el?: HTMLTemplateElement
//   h: TemplateStringsArray
// }

// // Добавляем тип для DirectiveParent
// export interface DirectiveParent {
//   _$parent?: DirectiveParent
//   _$isConnected: boolean
//   __directive?: Directive
//   __directives?: (Directive | undefined)[]
// }

// // Добавляем тип для TemplatePart
// export type TemplatePart = {
//   readonly type: typeof ATTRIBUTE_PART | typeof CHILD_PART | typeof ELEMENT_PART | typeof COMMENT_PART
//   readonly index: number
//   readonly name?: string
//   readonly ctor?: typeof AttributePart
//   readonly strings?: ReadonlyArray<string>
// }

// // Добавляем тип для RefDirective
// export interface RefDirective {
//   (ref: (el: Element | undefined) => void): unknown
// }
