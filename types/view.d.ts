import type { Meta } from "./index"
import type { ContextData, ContextDefinition, Update } from "./context"
import type { Core, CoreObj } from "./core"
import type { html, Reference } from "../dom/html/html"

/**
 Структура условного блока для компонента
 
 @property raw - HTML-шаблон для истинного условия
 @property template - HTML-шаблон для ложного условия
 */
export type Block = {
  raw: string
  template?: HTMLTemplateElement | Node
  xpath?: string
}

/**
 Структура условного блока для компонента
 
 @property condition - Функция для проверки условия
 @property context - Массив ключей контекста, используемых в условии
 @property states - Массив состояний, используемых в условии
 @property true - HTML-шаблон для истинного условия
 @property false - HTML-шаблон для ложного условия
 */
export type Condition = {
  condition: Function
  context: string[]
  states: string[]
  true?: Block
  false?: Block
}

/**
 Интерфейс для хранения условий отображения компонентов
 */
export type ConditionsMap = Map<string | number, Condition>

/**
 Параметры инициализации компонента
 
 @property view - Коллбек инициализации представления
 @property particle - Экземпляр частицы
 */
export type ComponentParams<I extends CoreObj, C extends ContextDefinition, S extends string> = {
  view: ViewDefinition<I, C, S>
  particle: Meta<S, C, I>
}

/**
 Интерфейс для хранения представления компонента
 
 @property render - Коллбек для рендеринга компонента
 @property onMount - Коллбек для монтирования компонента
 @property onDestroy - Коллбек для размонтирования компонента
 @property [isolated=true] - Флаг изолированного рендеринга
 */
export type ViewDefinition<I extends Record<string, any>, C extends ContextDefinition, S extends string> = {
  render: (params: ViewDefinitionParams<I, C, S>) => string
  onMount?: MountParams<I>
  onDestroy?: MountParams<I>
  style?: ({ css }: { css: (strings: TemplateStringsArray, ...values: any[]) => CSSStyleSheet }) => void
  isolated?: boolean
}

/**
 Параметры монтирования компонента
 
 @property component - HTML-элемент компонента
 @property core - Экземпляр частицы
 */
type MountParams<I extends Record<string, any>> = ({
  component,
  core,
}: {
  component: HTMLElement
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
  html: html
  ref: Reference
}
