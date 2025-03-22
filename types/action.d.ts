import type {ContextDefinition} from "./context.d.ts"
import type {CoreObj} from "./core.d.ts"

/**
 * Действие (Action)
 * 
 * Действие в MetaFor - это функция, которая выполняется при входе в состояние.
 * Не у каждого состояния должно быть действие.
 * Действие состояния описывается в переходах.
 * 
 * ## Особенности действий:
 * 
 * - Получают доступ к текущему контексту частицы
 * - Могут обновлять контекст через функцию update
 * - Имеют доступ к ядру (core) для взаимодействия с внешними ресурсами
 * - Могут выполнять асинхронные операции
 * - Блокируют триггеры на время выполнения действия
 * 
 * ## Жизненный цикл действия:
 * 
 * 1. Определение действия в разделе `.actions({...})`
 * 2. Привязка действия к переходу в разделе `.transitions([{...}])`
 * 3. Автоматический вызов при входе в соответствующее состояние
 * 4. Блокировка триггеров на время выполнения
 * 5. Разблокировка триггеров после завершения
 * 
 * @interface Action
 * @template C - Тип контекста
 * @template I - Тип внутренних данных ядра
 * @param context - Текущий контекст частицы
 * @param update - Функция обновления контекста
 * @param core - Ядро для доступа к внешним ресурсам
 * 
 * @example
 * ```js
 * // Определение действия для загрузки элементов
 * loadItems: ({ update, core }) => {
 *   // Обновляем контекст: устанавливаем состояние загрузки
 *   update({ 
 *     isLoading: true,
 *     error: null,
 *   });
 *   
 *   // Выполняем асинхронную операцию через API из ядра
 *   core.api.fetchItems()
 *     .then(items => {
 *       // При успешной загрузке обновляем контекст
 *       update({ 
 *         items, 
 *         isLoading: false,
 *       });
 *     })
 *     .catch(error => {
 *       // При ошибке обновляем контекст
 *       update({ 
 *         error: error.message, 
 *         isLoading: false,
 *       });
 *     });
 * }
 * ```
 * 
 * @example
 * ```js
 * // Пример использования контекста в действии
 * addItem: ({ context, update, core }) => {
 *   // Используем данные из текущего контекста
 *   const newItem = {
 *     id: core.utils.generateId(),
 *     title: context.newItemTitle,
 *     completed: false
 *   };
 *   
 *   // Обновляем контекст с использованием существующих данных
 *   update({ 
 *     items: [...context.items, newItem],
 *     newItemTitle: '' // Очищаем поле ввода
 *   });
 *   
 *   // Сохраняем в локальное хранилище через ядро
 *   core.storage.saveItems([...context.items, newItem]);
 * }
 * ```
 */
export interface Action<C extends ContextDefinition, I extends CoreObj> {
  (params: {
    update: (contextPartial: Partial<C>) => void
    context: C
    core: I
  }): void
}

/**
 * Действия частицы
 * 
 * Содержит набор действий, которые выполняются при входе в состояние.
 * Каждое действие представляет собой именованную функцию, которая будет
 * вызываться автоматически при переходе в соответствующее состояние.
 * 
 * ## Работа с действиями
 * 
 * 1. Действия определяются как объект, где ключи - это имена действий,
 *    а значения - функции, реализующие логику действий
 * 2. В переходах указывается имя действия, которое должно быть выполнено
 * 3. Система автоматически вызывает нужное действие при переходе
 * 
 * ## Рекомендации
 * 
 * - Действия должны быть независимыми и вызываться только системой
 * - Выделяйте отдельные действия для разных задач (загрузка, фильтрация, управление и т.д.)
 * - Асинхронная логика должна быть заключена в действия
 * 
 * @interface Actions
 * @template C - Тип контекста
 * @template I - Тип внутренних данных ядра
 * 
 * @example
 * ```js
 * // Пример набора действий для частицы списка задач
 * .actions({
 *   // Действия для управления элементами списка
 *   fetchItems: ({ update, core }) => {
 *     update({ isLoading: true });
 *     
 *     core.api.getItems()
 *       .then(items => update({ items, isLoading: false }))
 *       .catch(err => update({ error: err.message, isLoading: false }));
 *   },
 *   
 *   addItem: ({ context, update, core }) => {
 *     const newItem = {
 *       id: core.utils.generateId(),
 *       title: context.newItemTitle,
 *       completed: false
 *     };
 *     
 *     update({ 
 *       items: [...context.items, newItem],
 *       newItemTitle: ''
 *     });
 *     
 *     core.storage.saveItems([...context.items, newItem]);
 *   },
 *   
 *   removeItem: ({ context, update, core }, id) => {
 *     const updatedItems = context.items.filter(item => item.id !== id);
 *     
 *     update({ items: updatedItems });
 *     core.storage.saveItems(updatedItems);
 *   },
 *   
 *   toggleItem: ({ context, update }, id) => {
 *     const updatedItems = context.items.map(item => 
 *       item.id === id ? { ...item, completed: !item.completed } : item
 *     );
 *     
 *     update({ items: updatedItems });
 *   },
 *   
 *   // Действия для фильтрации
 *   setFilter: ({ update }, filter) => {
 *     update({ filter });
 *   },
 *   
 *   // Действия для управления ошибками
 *   clearError: ({ update }) => {
 *     update({ error: null });
 *   }
 * })
 * ```
 * 
 * @example
 * ```js
 * // Пример использования действий в переходах
 * .transitions([
 *   {
 *     from: "IDLE",
 *     action: "fetchItems",  // Это действие будет вызвано при переходе из IDLE в LOADING
 *     to: [
 *       { state: "LOADING", trigger: { isLoading: true } },
 *     ],
 *   },
 *   {
 *     from: "ERROR",
 *     action: ["clearError", "fetchItems"],  // Можно вызвать несколько действий последовательно
 *     to: [
 *       { state: "LOADING", trigger: "retryRequested" },
 *     ],
 *   }
 * ])
 * ```
 */
export type Actions<C extends ContextDefinition, I extends CoreObj> = Record<string, Action<C, I>>