/**
 Сигнал состояния актора

 Реактивная система управления состоянием с поддержкой подписок на изменения.

 @template S - Тип состояния

 @property value - Получить текущее значение состояния
 @property setValue - Установить новое значение состояния
 @property onChange - Добавить слушатель изменений состояния
 @property clear - Очистить всех слушателей
 */
export type Signal<S extends string> = {
  value: () => S
  setValue: (state: S) => void
  onChange: (listener: SignalListener<S>) => () => void
  clear: () => void
}

/**
 Слушатель изменений состояния

 Функция обратного вызова, которая вызывается при изменении состояния актора.

 @template S - Тип состояния
 @param preview - Предыдущее состояние актора
 @param current - Новое текущее состояние актора
 */
type SignalListener<S extends string> = (preview: S, current: S) => void