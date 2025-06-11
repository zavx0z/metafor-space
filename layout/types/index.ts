/**
 * Оператор сравнения для триггера
 * @interface Operator
 * @property symbol - Символ оператора (например, "=", ">", "<")
 * @property title - Название оператора
 * @property value - Значение для сравнения
 */
type Operator = {
  symbol: string,
  title: string,
  value: any
}

/**
 * Порт триггера для соединения с другими состояниями
 * @interface TriggerPort
 * @property id - Уникальный идентификатор порта
 * @property operators - Словарь операторов сравнения
 */
export type TriggerPort = {
  id: string,
  operators: {
    [key: string]: Operator
  }
}

/**
 * Триггер для перехода между состояниями
 * @interface GraphTrigger
 * @property id - Уникальный идентификатор триггера
 * @property ports - Массив портов для соединений
 */
export type GraphTrigger = {
  id: string,
  ports: Array<TriggerPort>
}