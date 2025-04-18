import {type ChildPart, noChange} from '../html.js'
import {AsyncDirective, directive} from '../async-directive.js'
import {forAwaitOf, Pauser, PseudoWeakRef} from './private-async-helpers.js'
import type {DirectiveParameters} from "../types/directives.js"

type Mapper<T> = (v: T, index?: number) => unknown;

export class AsyncReplaceDirective extends AsyncDirective {
  private __value?: AsyncIterable<unknown>
  private __weakThis = new PseudoWeakRef(this)
  private __pauser = new Pauser()

  // value not used, but we want a nice parameter for docs
  render<T>(value: AsyncIterable<T>, _mapper?: Mapper<T>) {
    return noChange
  }

  override update(
    _part: ChildPart,
    [value, mapper]: DirectiveParameters<this>
  ) {
    // If our initial render occurs while disconnected, ensure that the pauser
    // and weakThis are in the disconnected state
    if (!this.isConnected) {
      this.disconnected()
    }
    // If we've already set up this particular iterable, we don't need
    // to do anything.
    if (value === this.__value) {
      return noChange
    }
    this.__value = value
    let i = 0
    const {__weakThis: weakThis, __pauser: pauser} = this
    // Note, the callback avoids closing over `this` so that the directive
    // can be gc'ed before the promise resolves; instead `this` is retrieved
    // from `weakThis`, which can break the hard reference in the closure when
    // the directive disconnects
    forAwaitOf(value, async (v: unknown) => {
      // The while loop here handles the case that the connection state
      // thrashes, causing the pauser to resume and then get re-paused
      while (pauser.get()) {
        await pauser.get()
      }
      // If the callback gets here and there is no `this`, it means that the
      // directive has been disconnected and garbage collected and we don't
      // need to do anything else
      const _this = weakThis.deref()
      if (_this !== undefined) {
        // Check to make sure that value is the still the current value of
        // the part, and if not bail because a new value owns this part
        if (_this.__value !== value) {
          return false
        }

        // As a convenience, because functional-programming-style
        // transforms of iterables and async iterables requires a library,
        // we accept a mapper function. This is especially convenient for
        // rendering a template for each item.
        if (mapper !== undefined) {
          v = mapper(v, i)
        }

        _this.commitValue(v, i)
        i++
      }
      return true
    })
    return noChange
  }

  // Override point for AsyncAppend to append rather than replace
  protected commitValue(value: unknown, _index: number) {
    this.setValue(value)
  }

  override disconnected() {
    this.__weakThis.disconnect()
    this.__pauser.pause()
  }

  override reconnected() {
    this.__weakThis.reconnect(this)
    this.__pauser.resume()
  }
}

/**
 * A directive that renders the items of an async iterable[1], replacing
 * previous values with new values, so that only one value is ever rendered
 * at a time. This directive may be used in any expression type.
 *
 * Async iterables are objects with a `[Symbol.asyncIterator]` method, which
 * returns an iterator who's `next()` method returns a Promise. When a new
 * value is available, the Promise resolves and the value is rendered to the
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
export const asyncReplace = directive(AsyncReplaceDirective)
