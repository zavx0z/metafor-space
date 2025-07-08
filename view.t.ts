import type { ExtractValues, ContextSchema } from "./context.t"
import type { TemplateResult } from "./html/html.t"

/**
 * Конфигурация ов для view
 */
export interface ViewConfig<T extends ContextSchema = ContextSchema> {
  /** Шаблонизатор */
  render?: (params: { context: ExtractValues<T>; html: typeof import("./html/html").html }) => TemplateResult | void
  /**  монтирования */
  onMount?: (...args: unknown[]) => unknown
  /**  уничтожения */
  onDestroy?: (...args: unknown[]) => unknown
  /** Стили */
  style?: ({ css }: { css: (strings: TemplateStringsArray, ...values: any[]) => CSSStyleSheet }) => void
}
