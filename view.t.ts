import type { ExtractValues, ContextSchema } from "./context.t"
import type { TemplateResult } from "./html/html.t"

/**
 * Конфигурация колбэков для view
 */
export interface ViewCallbacks<T extends ContextSchema = ContextSchema> {
  /** Колбэк рендеринга */
  render?: (params: { context: ExtractValues<T>; html: typeof import("./html/html").html }) => TemplateResult | void
  /** Колбэк после рендеринга */
  rendered?: (...args: unknown[]) => unknown
  /** Колбэк монтирования */
  onMount?: (...args: unknown[]) => unknown
  /** Колбэк уничтожения */
  onDestroy?: (...args: unknown[]) => unknown
  /** Колбэк стилей */
  styles?: (...args: unknown[]) => unknown
}
