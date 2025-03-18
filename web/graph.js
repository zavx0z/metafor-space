// @ts-nocheck
/**
 * Создает и настраивает граф для частицы
 * @template {import("../types/index.d.ts").ContextDefinition} C - контекст частицы
 * @template {string} S - состояние частицы
 * @template {Record<string, any>} I - ядро частицы
 *
 * @param {import('../index.js').MetaForParticle<S, C, I>} particle - Экземпляр частицы
 * @returns {Promise<MetaForGraph & HTMLElement>} Компонент графа
 */
export default async function (particle) {
  const quantumGraph = /** @type {MetaForGraph} */ (document.querySelector("metafor-graph"))

  return quantumGraph.addParticle(particle.snapshot()).then((component) => {
    // Добавляем обработчики обновлений
    particle.onTransition((_, newState) => component.updateState(newState))
    const originalUpdate = particle.update.bind(particle)
    particle.update = (context) => {
      const updCtx = originalUpdate(context)
      component.updateContext(context)
    }
    return component
  })
}
