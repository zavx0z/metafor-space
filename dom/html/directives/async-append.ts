import {directive, PartType} from "../directive.js"
import {AsyncReplaceDirective} from "./async-replace.js"
import {clearPart, insertPart, setChildPartValue} from "../directive-helpers.js"
import type {DirectiveParameters, PartInfo} from "../types/directives.js"
import type {ChildPart} from "../html.js"

class AsyncAppendDirective extends AsyncReplaceDirective {
  private __childPart!: ChildPart

  // Override AsyncReplace to narrow the allowed part type to ChildPart only
  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.CHILD) {
      throw new Error("asyncAppend can only be used in child expressions")
    }
  }

  // Override AsyncReplace to save the part since we need to append into it
  override update(part: ChildPart, params: DirectiveParameters<this>) {
    this.__childPart = part
    return super.update(part, params)
  }

  // Override AsyncReplace to append rather than replace
  protected override commitValue(value: unknown, index: number) {
    // When we get the first value, clear the part. This lets the
    // previous value display until we can replace it.
    if (index === 0) {
      clearPart(this.__childPart)
    }
    // Create and insert a new part and set its value to the next value
    const newPart = insertPart(this.__childPart)
    setChildPartValue(newPart, value)
  }
}

/**
 * A directive that renders the items of an async iterable[1], appending new
 * values after previous values, similar to the built-in support for iterables.
 * This directive is usable only in child expressions.
 *
 * Async iterables are objects with a [Symbol.asyncIterator] method, which
 * returns an iterator who's `next()` method returns a Promise. When a new
 * value is available, the Promise resolves and the value is appended to the
 * Part controlled by the directive. If another value other than this
 * directive has been set on the Part, the iterable will no longer be listened
 * to and new values won't be written to the Part.
 *
 * [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
 *
 * @param value An async iterable
 * @param mapper An optional function that maps from (value, index) to another
 *     value. Useful for generating templates for each item in the iterable.
 */
export const asyncAppend = directive(AsyncAppendDirective)

/**
 * The type of the class that powers this directive. Necessary for naming the
 * directive's return type.
 */
export type {AsyncAppendDirective}
