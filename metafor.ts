/**
 * MetaFor — фасад для создания динамических типизированных контекстов
 * @packageDocumentation
 */

import { createContext } from "./core/context.ts"
import type { ContextSchema, ContextTypes, ContextInstance, ExtractValues, UpdateValues, JsonPatch } from "./core/context.t.ts"
import { html, render } from "./html/html"
import type { StateConfig } from "./core/state.t.ts"
import type { ViewConfig as ViewConfig } from "./core/view.t.ts"

/**
 * Основная функция MetaFor
 *
 * @param tag - Имя актора
 * @returns Объект с методом context для создания типизированного контекста
 *
 * @example
 */
export function MetaFor(tag: string) {
  return {
    /**
     * Создает типизированный контекст на основе схемы.
     * @template C - Схема контекста
     * @param schema - Функция, принимающая types и возвращающая схему, либо сама схема
     * @returns Конструктор состояний
     *
     * @example
     */
    context<const C extends ContextSchema>(schema: ((types: ContextTypes) => C) | C) {
      return {
        /**
         * Создает состояние контекста с возможностью управления переходами
         * @param states - Конфигурация состояний и переходов
         * @returns Объект с иммутабельным контекстом и методами update и onUpdate
         */
        states<S extends string>(states: StateConfig<S, C>) {
          return {
            /**
             * @param view
             * @returns
             */
            view(view?: ViewConfig<C>) {
              customElements.define(
                `metafor-${tag}`,
                class extends HTMLElement {
                  #shadow = this.attachShadow({ mode: "closed" })
                  context!: ContextInstance<C>["context"]
                  update!: ContextInstance<C>["update"]
                  onUpdate!: ContextInstance<C>["onUpdate"]
                  states!: StateConfig<S, C>

                  constructor() {
                    super()
                    const { context, update, onUpdate } = createContext(schema) as ContextInstance<C>
                    this.context = context
                    this.update = update
                    this.onUpdate = onUpdate
                    this.states = states
                    view?.style?.({
                      css: (strings, ...values) => {
                        const sheet = new CSSStyleSheet()
                        const result = strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "")
                        sheet.replaceSync(result)
                        this.#shadow.adoptedStyleSheets.push(sheet)
                        return sheet
                      },
                    })
                  }
                  connectedCallback() {
                    this.#updateView()
                  }
                  disconnectedCallback() {}
                  #updateView = () => {
                    if (!view?.render) return
                    const template = view.render({ context: this.context, html })
                    if (template) render(template, this.#shadow)
                  }
                }
              )
              return {
                context: undefined as unknown as ExtractValues<C>,
                update: undefined as unknown as (values: UpdateValues<ExtractValues<C>>) => ExtractValues<C>,
                onUpdate: undefined as unknown as (cb: (patches: JsonPatch[]) => void) => () => void,
                states: undefined as unknown as StateConfig<S, C>,
              }
            },
          }
        },
      }
    },
  }
}
