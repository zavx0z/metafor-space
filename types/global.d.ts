declare global {
  /**
   * Сообщение для обмена данными между частицами
   * @interface BroadcastMessage
   * @property meta - Метаданные сообщения
   * @property meta.particle - Имя частицы
   * @property meta.func - Имя функции
   * @property meta.target - Цель функции
   * @property meta.timestamp - Время отправки сообщения
   * @property patch - Патч для применения к частице
   * @property patch.path - Путь к частице
   * @property patch.op - Операция
   * @property patch.value - Значение
   */
  type BroadcastMessage = {
    meta: {
      particle: string
      func: string
      target: string
      timestamp: number
    }
    patch: Patch
  }
  /**
   * Снимок состояния частицы
   * @interface MetaForSnapshot
   * @property id - Идентификатор снимка
   * @property title - Заголовок снимка
   * @property description - Описание снимка
   * @property state - Текущее состояние
   * @property states - Список доступных состояний
   * @property context - Данные контекста
   * @property types - Определения типов контекста
   * @property transitions - Правила переходов между состояниями
   * @property transitions[].from - Исходное состояние перехода
   * @property transitions[].action - Действие при переходе
   * @property transitions[].to - Массив целевых состояний
   * @property transitions[].to[].state - Целевое состояние
   * @property transitions[].to[].trigger - Условия для перехода в целевое состояние
   */
  type MetaForSnapshot = {
    id: string
    title?: string
    description?: string
    state: string
    states: string[]
    context: Record<string, any>
    types: Record<string, any>
    transitions: MetaForTransition[]
  }
}
export {}
