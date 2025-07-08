/**
 * Конфигурация колбэков для view
 */
export interface ViewCallbacks {
  /** Колбэк рендеринга */
  render?: (...args: any[]) => any
  /** Колбэк после рендеринга */
  rendered?: (...args: any[]) => any
  /** Колбэк монтирования */
  onMount?: (...args: any[]) => any
  /** Колбэк уничтожения */
  onDestroy?: (...args: any[]) => any
  /** Стили */
  styles?: any
}
