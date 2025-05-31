/** Объект, который хранит значение ссылки. */
export interface Ref<T = Element> {
  /** Текущее значение элемента ссылки или `undefined`, если ссылка больше не отрендерена. */
  value?: T;
}

export type RefOrCallback<T = Element> = Ref<T> | ((el: T | undefined) => void)

/**
 * Когда для ссылок используются колбэки, эта карта отслеживает последнее значение,
 * с которым был вызван колбэк, чтобы директива не очищала ссылку, если она уже
 * была отрендерена в новом месте.
 * Карта имеет двойной ключ - контекст (`options.host`) и колбэк,
 * поскольку мы автоматически привязываем методы класса к `options.host`.
 */
export type lastElementForContextAndCallback = WeakMap<object, WeakMap<Function, Element | undefined>>
