/** Обработчик сообщений для Worker */
class PromisedWorker {
  /** @param {Worker} worker */
  constructor(worker) {
    if (worker === undefined) throw new Error("Missing mandatory parameter 'worker'.")
    this.resolvers = /** @type {Record<number, (err: any, res: any) => void>} */ ({})
    this.worker = worker
    this.worker.onmessage = answer => this.receive(this, answer)
  }

  /** @param {any} msg */
  postMessage(msg) {
    const id = this.id || 0
    this.id = id + 1
    msg.id = id

    return new Promise((resolve, reject) => {
      this.resolvers[id] = (err, res) => {
        if (err) {
          this.convertGwtStyleError(err)
          reject(err)
        } else resolve(res)
      }
      this.worker.postMessage(msg)
    })
  }

  /**
   * @param {PromisedWorker} self
   * @param {MessageEvent<{id: number, error: any, data: any}>} answer
   */
  receive(self, answer) {
    const json = answer.data
    const resolver = self.resolvers[json.id]
    if (resolver) {
      delete self.resolvers[json.id]
      if (json.error) resolver(json.error, null)
      else resolver(null, json.data)
    }
  }

  terminate = () => void (this.worker && this.worker.terminate())

  /** @param {any} err */
  convertGwtStyleError(err) {
    if (!err) return

    const javaException = err["__java$exception"]
    if (javaException) {
      if (javaException.cause?.backingJsObject) {
        err.cause = javaException.cause.backingJsObject
        this.convertGwtStyleError(err.cause)
      }
      delete err["__java$exception"]
    }
  }
}

/** Основной класс ELK */
export default class ELK {
  /** Конструктор ELK
   * @param {Object} options - Параметры для инициализации
   * @param {Object} [options.defaultLayoutOptions] - Параметры по умолчанию для алгоритма
   * @param {Array<string>} [options.algorithms] - Алгоритмы для использования
   * @param {((url: string) => Worker) | undefined} [options.workerFactory] - Фабрика для создания worker
   * @param {string} [options.workerUrl="/nodes/layout/lib/elk-worker.js"] - URL для создания worker
   */
  constructor({
    defaultLayoutOptions = {},
    algorithms = ["layered", "stress", "mrtree", "radial", "force", "disco", "sporeOverlap", "sporeCompaction", "rectpacking"],
    workerFactory,
    workerUrl = "/nodes/layout/lib/elk-worker.js"
  } = {}) {
    this.defaultLayoutOptions = defaultLayoutOptions
    this.initialized = false
    if (!workerUrl) throw new Error("Missing mandatory parameter 'workerUrl'.")
    /** @type {(url: string) => Worker} */
    const factory = workerFactory || (url => new Worker(url))
    const worker = factory(workerUrl)

    if (typeof worker.postMessage !== "function") throw new TypeError("Created worker does not provide the required 'postMessage' function.")
    this.worker = new PromisedWorker(worker)
    this.worker
      .postMessage({
        cmd: "register",
        algorithms: algorithms
      })
      .then(() => (this.initialized = true))
      .catch(console.error)
  }

  /**
   * @param {any} graph
   * @param {{layoutOptions?: Record<string, any>, logging?: boolean, measureExecutionTime?: boolean}} [options]
   */
  async layout(graph, {layoutOptions = this.defaultLayoutOptions, logging = false, measureExecutionTime = false} = {}) {
    if (!graph) throw new Error("Missing mandatory parameter 'graph'.")
    return this.worker.postMessage({cmd: "layout", graph, layoutOptions, options: {logging, measureExecutionTime}})
  }
  knownLayoutAlgorithms = () => this.worker.postMessage({cmd: "algorithms"})
  knownLayoutOptions = () => this.worker.postMessage({cmd: "options"})
  knownLayoutCategories = () => this.worker.postMessage({cmd: "categories"})
  terminateWorker = () => void (this.worker && this.worker.terminate())
}
