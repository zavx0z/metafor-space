/**
 Тип сигнала

 @template T - Тип состояния

 @property value - Получить текущее значение
 @property setValue - Установить новое значение
 @property onChange - Добавить слушатель изменения
 @property clear - Очистить слушателей
 */
export type SignalType<T extends string> = {
  value: () => T
  setValue: (state: T) => void
  onChange: (listener: SignalListener<T>) => () => void
  clear: () => void
}

/**
 Слушатель сигналов

 @template T - Тип состояния

 @property preview - Предыдущее состояние
 @property current - Текущее состояние
 */
type SignalListener<T extends string> = (preview: T, current: T) => void

/**
 * Создать сигнал
 * @hidden
 * 
 * @template T - Тип состояния
 * @param value - Значение
 * @returns Сигнал
 */
export type CreateSignal<T extends string> = (value: T) => SignalType<T>