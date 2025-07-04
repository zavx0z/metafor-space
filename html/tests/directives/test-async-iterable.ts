const nextFrame = () => new Promise(r => requestAnimationFrame(r))

/**
 * Асинхронный итератор для тестирования, в который можно добавлять значения
 * для проверки кода, использующего асинхронные итераторы. Этот итератор может
 * безопасно использоваться только одним слушателем.
 */
export class TestAsyncIterable<T> implements AsyncIterable<T> {
  // these will be initialized in the constructor
  private _nextValue!: Promise<T>
  private _resolveNextValue!: (value: T) => void

  constructor() {
    this._resetPromise()
  }

  private _resetPromise() {
    this._nextValue = new Promise<T>(resolve => {
      this._resolveNextValue = resolve
    })
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    while (true) {
      // wait for the next pushed value
      const value = await this._nextValue
      // immediately prepare the next promise
      this._resetPromise()
      // hand it off to the consumer
      yield value
    }
  }

  /**
   * Добавляет новое значение и возвращает Promise, который
   * резолвится в конце следующего rAF – так вы можете
   * делать `await iterable.push(x)` и быть уверены,
   * что весь асинхронный рендеринг уже прошёл.
   */
  async push(value: T): Promise<void> {
    // resolve the pending promise (wakes up the iterator)
    this._resolveNextValue(value)
    // give one rAF tick for whatever consumer-side logic
    await nextFrame()
  }
}
