import type {ContextData, ContextDefinition, Update} from "./context.ts"
import type {Core} from "./core.ts"
import type {HtmlType, TemplateResult} from "../html/html"
import {ref} from "../html/directives/ref"
import type {repeat} from "../html/directives/repeat"

/**
 Определение представления актора

 Описывает визуальное представление актора с поддержкой Shadow DOM, 
 стилей и жизненного цикла монтирования/размонтирования.

 @template I - Тип ядра актора
 @template C - Тип контекста актора  
 @template S - Тип состояний актора

 @property render - Функция рендеринга HTML-представления актора
 @property onMount - Коллбек, вызываемый при монтировании актора в DOM
 @property onDestroy - Коллбек, вызываемый при удалении актора из DOM
 @property style - Функция для определения стилей актора
 */
export type ViewDefinition<I extends Record<string, any>, C extends ContextDefinition, S extends string> = {
  render?: (params: ViewDefinitionParams<I, C, S>) => (TemplateResult<1> | unknown) // FIXME: repeat directive
  onMount?: MountParams<C, I>
  onDestroy?: DestroyParams<I>
  /**
   * Стили
   * @param css
   */
  style?: ({css}: { css: (strings: TemplateStringsArray, ...values: any[]) => CSSStyleSheet }) => void
}

/**
 Параметры функции монтирования актора

 @template C - Тип контекста актора
 @template I - Тип ядра актора
 @property component - HTML-элемент актора в DOM
 @property core - Ядро актора с методами и данными
 @property update - Функция обновления контекста актора
 */
type MountParams<C extends ContextDefinition, I extends Record<string, any>> = ({component, core,}: {
  component: Element
  core: Core<I>
  update: Update<C>
  context: ContextData<C>
}) => void

/**
 Параметры функции размонтирования актора

 @template I - Тип ядра актора
 @property component - HTML-элемент актора в DOM
 @property core - Ядро актора с методами и данными
 */
type DestroyParams<I extends Record<string, any>> = ({component, core,}: {
  component: Element
  core: Core<I>
}) => void
/**
 Параметры функции рендеринга представления актора

 @template I - Тип ядра актора
 @template C - Тип контекста актора
 @template S - Тип состояний актора

 @property update - Функция обновления контекста актора
 @property context - Текущие данные контекста актора
 @property state - Текущее состояние актора
 @property core - Ядро актора с методами и данными
 @property html - Функция шаблонизации HTML с поддержкой lit-html
 @property ref - Директива для создания ссылок на DOM элементы
 @property repeat - Директива для рендеринга списков
 */
type ViewDefinitionParams<I extends Record<string, any>, C extends ContextDefinition, S extends string> = {
  update: Update<C>
  context: ContextData<C>
  state: S
  core: Core<I>
  html: HtmlType
  ref: typeof ref
  repeat: typeof repeat
}

/**
 Внутренний метод обновления представления актора

 Оптимизированный метод рендеринга актора в Shadow DOM с предотвращением 
 множественных обновлений при одновременных изменениях контекста и состояния.

 @internal
 @method
 @returns void

 ## Когда происходит обновление:
 1. **При инициализации актора** - если нет начального действия
 2. **При изменении контекста** - только если есть реальные изменения
 3. **При переходах состояний** - синхронно с изменением состояния

 ## Оптимизации:
 - Предотвращение двойного рендеринга при наличии начального действия
 - Обновление только при фактических изменениях данных
 - Синхронизация с жизненным циклом переходов состояний

 @see {@link render} - Функция рендеринга lit-html
 @see {@link html} - HTML-шаблонизатор
 @see {@link ref} - Директива для ссылок на DOM элементы
 */
export declare function UpdateView(): void