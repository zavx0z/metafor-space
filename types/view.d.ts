import type { Particle } from "../index"
import type { ContextData, ContextDefinition, Update } from "./context.d.ts"
import type { Core, CoreObj } from "./core.d.ts"

/**
 * Интерфейс для определения блока HTML
 * 
 * @interface Block
 * @property template - HTML-шаблон для блока
 */
export interface Block {
  template: string
}

/**
 * Интерфейс для определения условия в компоненте
 * 
 * @interface Condition
 * @property when - Условие, при котором блок должен быть отрендерен
 * @property then - Блок, который рендерится при выполнении условия
 */
export interface Condition {
  when: boolean
  then: Block
}

/**
 * Тип для функции рендеринга компонента
 * 
 * @interface RenderFn
 * @template E - Тип HTML-элемента, в который рендерится компонент
 * @template C - Тип контекста
 * @template I - Тип внутренних данных ядра
 * @property element - HTML-элемент, в который рендерится компонент
 * @property context - Данные контекста
 * @property update - Функция для обновления контекста
 * @property core - Функционал ядра
 * @property done - Функция, вызываемая при завершении рендеринга
 */
export interface RenderFn<E extends HTMLElement, C extends ContextDefinition, I extends CoreObj> {
  (params: {
    element: E
    context: ContextData<C>
    update: Update<C>
    core: Core<I>
    done: () => void
  }): void
}

/**
 * Определение представления (View) для частицы
 * 
 * View в MetaFor - это уровень представления, который отвечает за 
 * отображение состояния частицы в пользовательском интерфейсе.
 * 
 * Представление:
 * - Декларативное: описывает, что должно быть отображено, а не как
 * - Автоматически обновляется при изменении контекста
 * - Поддерживает условный рендеринг и шаблоны
 * - Может взаимодействовать с пользователем через события
 * 
 * @interface ViewDefinition
 * @template E - Тип HTML-элемента, в который рендерится компонент
 * @template C - Тип контекста
 * @template I - Тип внутренних данных ядра
 * @property render - Функция рендеринга компонента
 * @property when - Условия для условного рендеринга
 * @property template - HTML-шаблон для компонента
 * @property style - CSS-стили для компонента
 * @property onMount - Функция, вызываемая при монтировании компонента
 * @property onDestroy - Функция, вызываемая при размонтировании компонента
 * 
 * @example
 * ```js
 * .view({
 *   // Декларативный шаблон с использованием строковых литералов
 *   template: ({ items, filter }) => `
 *     <div class="todo-list">
 *       <h2>ToDo List (${items.length} items)</h2>
 *       
 *       <div class="filters">
 *         <button class="${filter === 'all' ? 'active' : ''}" data-filter="all">All</button>
 *         <button class="${filter === 'active' ? 'active' : ''}" data-filter="active">Active</button>
 *         <button class="${filter === 'completed' ? 'active' : ''}" data-filter="completed">Completed</button>
 *       </div>
 *       
 *       <ul>
 *         ${items
 *           .filter(item => {
 *             if (filter === 'active') return !item.completed;
 *             if (filter === 'completed') return item.completed;
 *             return true;
 *           })
 *           .map(item => `
 *             <li class="${item.completed ? 'completed' : ''}">
 *               <input type="checkbox" data-id="${item.id}" 
 *                      ${item.completed ? 'checked' : ''}>
 *               <span>${item.title}</span>
 *               <button class="delete" data-id="${item.id}">×</button>
 *             </li>
 *           `).join('')}
 *       </ul>
 *       
 *       <div class="new-item">
 *         <input type="text" placeholder="Add new item" id="new-item-input">
 *         <button id="add-item">Add</button>
 *       </div>
 *     </div>
 *   `,
 *   
 *   // CSS-стили компонента
 *   style: `
 *     .todo-list { font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; }
 *     .filters { margin: 15px 0; }
 *     .filters button { margin-right: 5px; padding: 3px 10px; }
 *     .filters button.active { background: #4285f4; color: white; }
 *     ul { list-style: none; padding: 0; }
 *     li { padding: 8px 0; border-bottom: 1px solid #eee; display: flex; align-items: center; }
 *     li.completed span { text-decoration: line-through; color: #888; }
 *     input[type="checkbox"] { margin-right: 10px; }
 *     span { flex-grow: 1; }
 *     .delete { background: none; border: none; color: #f44336; font-size: 18px; cursor: pointer; }
 *     .new-item { margin-top: 15px; display: flex; }
 *     #new-item-input { flex-grow: 1; padding: 8px; margin-right: 5px; }
 *   `,
 *   
 *   // Функция, выполняемая при монтировании компонента
 *    onMount: ({ element, core }) => {
 *     // Загрузка сохраненных задач из локального хранилища
 *     const savedItems = core.storage.loadItems();
 *     if (savedItems && savedItems.length > 0) {
 *       update({ items: savedItems });
 *     }
 *     
 *     // Фокус на поле ввода
 *     setTimeout(() => {
 *       element.querySelector('#new-item-input').focus();
 *     }, 0);
 *   },
 *   
 *   // Функция, выполняемая при размонтировании компонента
 *   onDestroy: ({ context, core }) => {
 *     // Сохранение задач в локальное хранилище при размонтировании
 *     core.storage.saveItems(context.items);
 *   }
 * })
 * ```
 */
export type ViewDefinition<
  E extends HTMLElement,
  C extends ContextDefinition,
  I extends CoreObj
> = {
  render?: RenderFn<E, C, I>
  when?: Condition[]
  template?: string | ((context: ContextData<C>) => string)
  style?: string
  onMount?: (params: {
    element: E
    context: ContextData<C>
    update: Update<C>
    core: Core<I>
  }) => void
  onDestroy?: (params: {
    element: E
    context: ContextData<C>
    update: Update<C>
    core: Core<I>
  }) => void
}

/**
 * Параметры инициализации компонента
 * @interface ComponentParams
 * @property view - Коллбек инициализации представления
 * @property particle - Экземпляр частицы
 */
export interface ComponentParams<I extends CoreObj, C extends ContextDefinition, S extends string> {
  view: ViewDefinition<I, C, S>
  particle: Particle<S, C, I>
}
