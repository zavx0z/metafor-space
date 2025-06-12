import type {ContextData, ContextDefinition, Update} from "./context.ts"
import type {Core} from "./core.ts"
import type {HtmlType, TemplateResult} from "../html/html"
import {ref} from "../html/directives/ref"

/**
 Интерфейс для хранения представления компонента

 @property render - Коллбек для рендеринга компонента
 @property onMount - Коллбек для монтирования компонента
 @property onDestroy - Коллбек для размонтирования компонента
 */
export type ViewDefinition<I extends Record<string, any>, C extends ContextDefinition, S extends string> = {
  render: (params: ViewDefinitionParams<I, C, S>) => TemplateResult<1>
  onMount?: MountParams<C, I>
  onDestroy?: DestroyParams<I>
  style?: ({css}: { css: (strings: TemplateStringsArray, ...values: any[]) => CSSStyleSheet }) => void
}

/**
 Параметры монтирования компонента

 @property component - HTML-элемент компонента
 @property core - Экземпляр частицы
 */
type MountParams<C extends ContextDefinition, I extends Record<string, any>> = ({component, core,}: {
  component: Element
  core: Core<I>
  update: Update<C>
}) => void
/**
 Параметры монтирования компонента

 @property component - HTML-элемент компонента
 @property core - Экземпляр частицы
 */
type DestroyParams<I extends Record<string, any>> = ({component, core,}: {
  component: Element
  core: Core<I>
}) => void
/**
 Параметры представления компонента

 @property update - Функция для обновления состояния
 @property context - Контекст компонента
 @property state - Состояние компонента
 @property core - Экземпляр частицы
 @property html - Функция для рендеринга HTML
 @property ref - Функция для создания ссылок на DOM элементы
 */
type ViewDefinitionParams<I extends Record<string, any>, C extends ContextDefinition, S extends string> = {
  update: Update<C>
  context: ContextData<C>
  state: S
  core: Core<I>
  html: HtmlType
  ref: typeof ref
}

/**
 * Обновляет представление компонента, рендеря его в Shadow DOM.
 * Метод оптимизирован для предотвращения множественных обновлений при одновременном
 * изменении контекста и состояния.
 * 
 * @private
 * @method
 * @returns {void}
 * 
 * @description
 * Метод отвечает за обновление визуального представления компонента. Он:
 * 1. Проверяет наличие view-функции
 * 2. Рендерит компонент в Shadow DOM используя предоставленные данные:
 *    - Функцию обновления контекста
 *    - Текущий контекст
 *    - Текущее состояние
 *    - Ядро компонента
 *    - HTML-шаблонизатор
 *    - Директиву ref
 * 
 * @lifecycle
 * Обновление представления происходит в следующих случаях:
 * 
 * 1. При инициализации компонента (connectedCallback):
 *    - Если нет начального действия (transition?.action)
 *    - Это предотвращает двойное обновление при наличии начального действия
 * 
 * 2. При обновлении контекста (update/_update):
 *    - Если this.process = true:
 *      - Обновление происходит только при изменении контекста
 *    - Если this.process = false:
 *      - Сохраняется текущее состояние
 *      - Проверяются переходы состояний
 *      - Обновление происходит только если:
 *        - Есть view
 *        - Есть изменения в контексте
 *        - Состояние не изменилось
 * 
 * 3. При переходе состояний (#transition):
 *    - Если есть переходы и выполняются условия:
 *      - При наличии действия:
 *        - Устанавливается this.process = true
 *        - Обновляется состояние
 *        - Обновляется представление
 *        - Выполняется действие
 *      - Без действия:
 *        - Обновляется состояние
 *        - Обновляется представление
 * 
 * @optimization
 * Метод оптимизирован для предотвращения множественных обновлений:
 * 1. При инициализации:
 *    - Обновление происходит только если нет начального действия
 * 2. При обновлении контекста:
 *    - При this.process = true обновление только при изменении контекста
 *    - При this.process = false обновление только если состояние не изменилось
 * 3. При изменении состояния:
 *    - Обновление происходит в #transition
 *    - Предотвращается повторное обновление в update/_update
 * 
 * @example
 * ```typescript
 * // Инициализация
 * if (view) {
 *   if (!transition?.action) {
 *     this.#updateView()
 *   }
 *   view.onMount?.({...})
 * }
 * 
 * // Обновление контекста
 * update(ctx) {
 *   const upd = this.#updateContext({ctx})
 *   if (this.process) {
 *     if (view && Object.keys(upd).length) this.#updateView()
 *     return
 *   }
 *   const state = this.state
 *   this.#transition()
 *   if (view && Object.keys(upd).length && state === this.state) {
 *     this.#updateView()
 *   }
 * }
 * 
 * // Переход состояний
 * #transition() {
 *   if (actionDefinition?.action) {
 *     this.#process = true
 *     this.#state.setValue(transition.state)
 *     if (view) this.#updateView()
 *     this.#runAction(actionDefinition.action)
 *   } else {
 *     this.#state.setValue(transition.state)
 *     if (view) this.#updateView()
 *   }
 * }
 * ```
 * 
 * @throws {Error} Если view не определен
 * 
 * @see {@link render} - Функция рендеринга
 * @see {@link html} - HTML-шаблонизатор
 * @see {@link ref} - Директива ref
 */
export declare function UpdateView():void