import type {
  AttributePart,
  BooleanAttributePart,
  ChildPart, CompiledTemplateResult,
  DirectiveParent,
  ElementPart,
  EventPart,
  PropertyPart, UncompiledTemplateResult
} from "./html"
import type {Primitive, TemplateResultType} from "./directive-helpers.t.ts"
import type {DirectiveClass, DirectiveResult} from "./directive"

export declare function wrap<T extends Node>(node: T): T

/**
 * Проверяет, является ли значение TemplateResult или CompiledTemplateResult.
 */
export declare function isTemplateResult(
  value: unknown,
  type?: TemplateResultType
): value is UncompiledTemplateResult

/**
 * Проверяет, является ли значение CompiledTemplateResult.
 */
export declare function isCompiledTemplateResult(value: unknown): value is CompiledTemplateResult

/**
 * Проверяет, является ли значение DirectiveResult.
 */
export declare function isDirectiveResult(value: unknown): value is DirectiveResult

/**
 * Получает класс Directive для DirectiveResult
 */
export declare function getDirectiveClass(value: unknown): DirectiveClass | undefined

/**
 * Вставляет ChildPart в DOM указанного контейнера ChildPart, либо в конец контейнера ChildPart,
 * либо перед опциональным `refPart`.
 *
 * Это не добавляет часть к зафиксированному значению containerPart. Это должно быть сделано вызывающей стороной.
 *
 * @param containerPart Часть, в которую нужно добавить новый ChildPart
 * @param refPart Часть, перед которой нужно добавить новый ChildPart; если опущено, часть добавляется в конец `containerPart`
 * @param part Часть для вставки, или undefined для создания новой части
 */
export declare function insertPart(
  containerPart: ChildPart,
  refPart?: ChildPart,
  part?: ChildPart
): ChildPart

/**
 * Устанавливает значение части.
 *
 * Обратите внимание, что это должно использоваться только для установки/обновления значения
 * частей, созданных пользователем (т.е. тех, что созданы с помощью `insertPart`);
 * это не должно использоваться директивами для установки значения части контейнера директивы.
 * Директивы должны возвращать значение из `update`/`render` для обновления состояния своей части.
 *
 * Для директив, которым требуется установка значения их части асинхронно,
 * они должны расширять `AsyncDirective` и вызывать `this.setValue()`.
 *
 * @param part Часть для установки
 * @param value Значение для установки
 * @param index Для `AttributePart`, индекс для установки
 * @param directiveParent Используется внутренне; не должно устанавливаться пользователем
 */
export declare function setChildPartValue<T extends ChildPart>(
  part: T,
  value: unknown,
  directiveParent?: DirectiveParent
): T

/**
 * Устанавливает зафиксированное значение ChildPart напрямую без запуска
 * этапа фиксации части.
 *
 * Это полезно в случаях, когда директиве нужно обновить часть таким образом,
 * чтобы следующее обновление обнаружило изменение значения или нет.
 * Когда значение опущено, следующее обновление гарантированно будет
 * обнаружено как изменение.
 *
 * @param part
 * @param [value=RESET_VALUE] - RESET_VALUE - Сторожевое значение, которое никогда не может появиться как значение части, кроме случаев, когда оно установлено через live(). Используется для принудительного провала проверки на изменения и вызова повторного рендеринга.
 */
export declare function setCommittedValue(
  part: ChildPart | AttributePart | PropertyPart | BooleanAttributePart | ElementPart | EventPart,
  value?: unknown
): unknown

/**
 * Возвращает зафиксированное значение ChildPart.
 *
 * Зафиксированное значение используется для обнаружения изменений и эффективных
 * обновлений части. Оно может отличаться от значения, установленного шаблоном
 * или директивой в случаях, когда значение шаблона преобразуется перед фиксацией.
 *
 * - `TemplateResult` фиксируются как `TemplateInstance`
 * - Итерируемые объекты фиксируются как `Array<ChildPart>`
 * - Все остальные типы фиксируются как значение шаблона или значение,
 *   возвращенное или установленное директивой.
 *
 * @param part
 */
export declare function getCommittedValue(part: ChildPart): unknown

/**
 * Удаляет ChildPart из DOM, включая все его содержимое.
 *
 * @param part Часть для удаления
 */
export declare function removePart(part: ChildPart): void

export declare function clearPart(part: ChildPart): void

/**
 * Проверяет, является ли значение примитивным типом.
 *
 * См. https://tc39.github.io/ecma262/#sec-typeof-operator
 */
export declare function isPrimitive(value: unknown): value is Primitive