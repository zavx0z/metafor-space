import type { ExtractValues, ContextSchema } from "./context.t.ts"
import type { TemplateResult } from "../html/html.t.ts"

/**
 * Конфигурация ов для view
 */
export interface ViewConfig<C extends ContextSchema = ContextSchema> {
  /** Шаблонизатор */
  render?: (params: { context: ExtractValues<C>; html: typeof import("../html/html.ts").html }) => TemplateResult
  /**  монтирования */
  onMount?: (...args: unknown[]) => unknown
  /**  уничтожения */
  onDestroy?: (...args: unknown[]) => unknown
  /** Стили */
  style?: ({ css }: { css: (strings: TemplateStringsArray, ...values: any[]) => CSSStyleSheet }) => void
}
