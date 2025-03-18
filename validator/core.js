/**
 * Проверяет корректность ядра частицы
 * @template {Record<string, any>} I
 * @template {import('../types/index.d.ts').ContextDefinition} C
 * @param {import('../types/index.d.ts').CoreDefinition<I, C>} core
 */
export const validateCore = (core) => {
  if (typeof core !== "function") console.error("Ядро должно быть функцией")
}
