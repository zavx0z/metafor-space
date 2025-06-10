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
