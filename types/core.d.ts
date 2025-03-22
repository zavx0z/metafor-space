import type {ContextData, ContextDefinition, Update} from "./context.d.ts"

/**
 * Базовый тип для объекта ядра
 * 
 * Представляет собой объект с произвольными полями и методами.
 * Используется как основа для определения типа ядра частицы.
 * 
 * @interface CoreObj
 */
export type CoreObj = Record<string, any>

/**
 * Тип для данных ядра
 * 
 * Используется для частичного обновления или создания ядра.
 * Позволяет определить подмножество полей ядра.
 * 
 * @interface CoreData
 * @template I - Тип внутренних данных ядра
 */
export type CoreData<I extends CoreObj> = Partial<I>

/**
 * Определение ядра частицы
 * 
 * Ядро частицы предоставляет доступ к внешним ресурсам и сервисам:
 * - API-запросы
 * - Таймеры
 * - Локальное хранилище
 * - Работа с DOM-элементами
 * - И другие внешние сервисы
 * 
 * Ядро определяет, какие внешние ресурсы и сервисы будут доступны в частице.
 * В отличие от контекста, ядро:
 * - Не отслеживается на изменения
 * - Не влияет на переходы между состояниями
 * - Не сериализуется при сохранении снимка частицы
 * 
 * Это позволяет хранить в ядре:
 * - Функции для работы с внешними сервисами
 * - Объекты, которые не нужно отслеживать на изменения
 * - Ссылки на внешние ресурсы, которые не нужно сериализовать
 * 
 * @interface CoreDefinition
 * @template I - Тип внутренних данных ядра
 * @template C - Тип контекста
 * @property update - Функция обновления контекста
 * @property context - Данные контекста
 * @property self - Ссылка на ядро (для рекурсивных вызовов)
 * 
 * @example
 * ```js
 * .core(() => ({
 *   api: {
 *     fetchItems: async () => {
 *       const response = await fetch('/api/items');
 *       return response.json();
 *     },
 *     saveItem: async (item) => {
 *       const response = await fetch('/api/items', {
 *         method: 'POST',
 *         body: JSON.stringify(item)
 *       });
 *       return response.json();
 *     }
 *   },
 *   storage: {
 *     saveToLocalStorage: (key, data) => {
 *       localStorage.setItem(key, JSON.stringify(data));
 *     },
 *     getFromLocalStorage: (key) => {
 *       return JSON.parse(localStorage.getItem(key));
 *     }
 *   }
 * }))
 * ```
 */
export type CoreDefinition<I extends CoreObj, C extends ContextDefinition> = (params: {
  update: Update<C>
  context: ContextData<C>
  self: Core<I>
}) => I

/**
 * Тип ядра частицы
 * 
 * Представляет собой объект с методами и свойствами, определенными в CoreDefinition.
 * 
 * Core используется для:
 * - Работы с внешними ресурсами (API, таймеры, хранилище)
 * - Взаимодействия с DOM-элементами
 * - Выполнения бизнес-логики, не связанной с контекстом
 * 
 * Методы Core доступны внутри Action через параметр `core`.
 * Core не сериализуется и не передаётся между частицами.
 * 
 * @interface Core
 * @template I - Тип внутренних данных ядра
 * 
 * @example
 * // Использование ядра внутри действия:
 * .actions({
 *   fetchItems: ({ update, core }) => {
 *     // Вызов метода API из ядра
 *     core.api.fetchItems()
 *       .then(items => {
 *         update({ items });
 *       });
 *   },
 *   saveToStorage: ({ context, core }) => {
 *     // Использование методов хранилища из ядра
 *     core.storage.saveToLocalStorage('items', context.items);
 *   }
 * })
 */
export type Core<I extends CoreObj> = {
  [K in keyof I]: I[K] extends (...args: infer Args) => infer R ? (...args: Args) => R : I[K]
}
