/**
 * ### choose
 *
 * Отображает один из нескольких шаблонов на основе ключевого значения.
 *
 * **Импорт**
 *
 * ```js
 * import { choose } from "@metafor/html/directives/choose.js"
 * ```
 *
 * **Синтаксис функции**
 *
 * ```
 * choose(key: unknown, cases: Array<[key: unknown, value: () => unknown]>, fallback?: () => unknown)
 * ```
 *
 * **Местоположение**
 * Любое выражение.
 *
 * **Описание**
 * Директива `choose` позволяет отображать различные шаблоны в зависимости от значения ключа.
 *
 * **Пример использования**
 *
 * ```js
 * html`
 *   ${choose(
 *     this.status,
 *     [
 *       ["loading", () => html`<p>Loading...</p>`],
 *       ["success", () => html`<p>Data loaded successfully!</p>`],
 *       ["error", () => html`<p>Error loading data.</p>`],
 *     ],
 *     () => html`<p>Unknown status.</p>`
 *   )}
 * `
 * ```
 *
 * **Особенности**
 *
 * - Удобно для реализации сложных сценариев выбора
 * - Поддерживает fallback-шаблон для обработки случаев, когда ключ не найден
 */
export declare function choose(
  value: T,
  cases: [K, function(): V][],
  defaultCase?: function(): V,
): V