import type {ContextData, ContextDefinition, Update} from "./context.d.ts"
import type {Core, CoreObj} from "./core.d.ts"

/**
 * Метаданные реакции
 * 
 * Содержит информацию о контексте выполнения реакции.
 * 
 * @interface MetaDataType
 * @property user - Идентификатор пользователя
 * @property device - Идентификатор устройства
 * @property tab - Идентификатор вкладки
 * @property particle - Идентификатор частицы-источника
 * @property index - Индекс реакции
 * @property timestamp - Временная метка возникновения реакции
 */
export interface MetaDataType {
  user?: string
  device?: string
  tab?: string
  particle?: string
  index?: number
  timestamp?: number
}

/**
 * Тип реакции
 * 
 * Определяет массив объектов реакции, каждый из которых содержит
 * действие, которое может манипулировать данными ядра в зависимости
 * от контекста и операций.
 * 
 * Реакции в MetaFor позволяют:
 * - Отслеживать изменения в других частицах
 * - Реагировать на внешние события
 * - Автоматически обновлять собственный контекст
 * - Создавать связи между частицами без прямых зависимостей
 * 
 * @interface ReactionType
 * @template C - Тип контекста
 * @template I - Тип внутренних данных ядра
 * @property metadata - Метаданные реакции
 * @property from - Контекст частицы-источника
 * @property action - Функция, выполняющая реакцию
 * 
 * @example
 * ```js
 * // Определение реакций в частице "todoList"
 * .reactions([
 *   {
 *     // Реакция на изменения в частице "filter"
 *     from: "filter", // имя частицы, на которую реагируем
 *     action: ({ update, context, from }) => {
 *       // filter.context содержит контекст частицы "filter"
 *       const { status } = from.context;
 *       
 *       // Обновляем собственный контекст на основе изменений в filter
 *       update({ 
 *         visibleItems: context.items.filter(item => {
 *           if (status === 'all') return true;
 *           if (status === 'active') return !item.completed;
 *           if (status === 'completed') return item.completed;
 *           return true;
 *         })
 *       });
 *     }
 *   },
 *   {
 *     // Реакция на изменения в частице "search"
 *     from: "search",
 *     action: ({ update, context, from }) => {
 *       const { query } = from.context;
 *       
 *       // Фильтрация элементов на основе поискового запроса
 *       if (query) {
 *         update({
 *           filteredItems: context.items.filter(item => 
 *             item.title.toLowerCase().includes(query.toLowerCase())
 *           )
 *         });
 *       } else {
 *         update({ filteredItems: context.items });
 *       }
 *     }
 *   }
 * ])
 * ```
 */
export type ReactionType<C extends ContextDefinition, I extends CoreObj> = Array<{
  metadata?: MetaDataType
  from: string
  action: (params: {
    from: {
      context: ContextData<ContextDefinition>
    }
    update: Update<C>
    context: ContextData<C>
    core: Core<I>
  }) => void
}>
