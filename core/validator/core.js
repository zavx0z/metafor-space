/**
 Проверяет корректность ядра частицы

 @template {Record<string, any>} I
 @template {import('../../types/context').ContextDefinition} C
 @param {import('../../types/core').CoreDefinition<I, C>} core
 */
export const validateCore = (core) => {
  if (typeof core !== "function") console.error("Ядро должно быть функцией")
}
