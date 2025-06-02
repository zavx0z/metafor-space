/**
 Сигнал состояния

 @template S - Тип состояния

 @property value - Получить текущее значение
 @property setValue - Установить новое значение
 @property onChange - Добавить слушатель изменения
 @property clear - Очистить слушателей
 */
export type Signal<S> = {
  value: () => S
  setValue: (state: S) => void
  onChange: (listener: SignalListener<S>) => () => void
  clear: () => void
}

/**
 Слушатель сигналов

 @template S - Тип состояния

 @property preview - Предыдущее состояние
 @property current - Текущее состояние
 */
type SignalListener<S> = (preview: S, current: S) => void