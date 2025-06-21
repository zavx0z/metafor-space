export interface RepeatDirectiveFn {
  // <T>(items: Iterable<T>, keyFnOrTemplate: KeyFn<T> | ItemTemplate<T>, template?: ItemTemplate<T>): unknown
  <T>(items: Iterable<T> | Array<number> | Array<string>, template: ItemTemplate<T>): unknown

  // <T>(items: Iterable<T>, keyFn: KeyFn<T> | ItemTemplate<T>, template: ItemTemplate<T>): unknown
}

export type KeyFn<T> = (item: T, index: number) => unknown
export type ItemTemplate<T> = (item: T, index: number) => unknown
export type keyFnOrTemplate<T> = KeyFn<T> | ItemTemplate<T>

/**
 * Вспомогательная функция для создания отображения элемента массива в его индекс
 * для подмножества массива (используется для ленивой генерации `newKeyToIndexMap`
 * и `oldKeyToIndexMap`)
 * @param list - Массив, который будет использоваться для создания отображения.
 * @param start - Начальный индекс для подмножества.
 * @param end - Конечный индекс для подмножества.
 * @returns - Отображение, сопоставляющее элементы массива с их индексами.
 */
export declare function generateMap(list: unknown[], start: number, end: number): Map<unknown, number>

/**
 * Метод
 * @param items
 * @param keyFnOrTemplate
 * @param template
 */
export type _getValuesAndKeys<T> = (items: Iterable<T>, keyFnOrTemplate: keyFnOrTemplate<T>, template: ItemTemplate<T>) => {
  values: unknown[],
  keys: unknown[]
}

/**
 * Директива, которая повторяет последовательность значений (обычно `TemplateResults`),
 * сгенерированных из итерируемого объекта, и эффективно обновляет эти элементы
 * при изменении итератора на основе предоставленных пользователем `keys`,
 * ассоциированных с каждым элементом.
 *
 * Заметьте, что если предоставлена функция `keyFn`, сохраняется строгая привязка ключей к DOM,
 * что означает, что предыдущий DOM для данного ключа перемещается в новую позицию при необходимости,
 * и DOM никогда не будет повторно использован с другими значениями ключей (для новых ключей всегда
 * создаётся новый DOM). Это, как правило, наиболее эффективный способ использования `repeat`,
 * поскольку он минимизирует лишние операции вставки и удаления.
 *
 * Функция `keyFn` принимает два параметра: элемент и его индекс, и возвращает уникальное значение ключа.
 *
 * ```js
 * html`
 *   <ol>
 *     ${repeat(this.items, (item) => item.id, (item, index) => {
 *       return html`<li>${index}: ${item.name}</li>`;
 *     })}
 *   </ol>
 * `
 * ```
 *
 * **Важно**: Если предоставляется функция `keyFn`, ключи *обязаны* быть уникальными для всех элементов
 * в данном вызове `repeat`. Поведение в случае, если два или более элемента имеют одинаковый ключ,
 * не определено.
 *
 * Если `keyFn` не предоставлена, эта директива будет работать аналогично маппингу элементов на значения,
 * и DOM будет переиспользоваться для потенциально разных элементов.
 */
export declare const repeat: RepeatDirectiveFn