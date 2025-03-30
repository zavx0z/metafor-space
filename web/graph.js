// @ts-nocheck
/**
 * Создает и настраивает граф для частицы
 * @template {import("../types/context").ContextDefinition} C - контекст частицы
 * @template {string} S - состояние частицы
 * @template {Record<string, any>} I - ядро частицы
 *
 * @param {import('../index.js').MetaForParticle<S, C, I>} particle - Экземпляр частицы
 * @returns {Promise<HTMLElement>} Компонент графа
 */
export default async function (particle) {
  // const metaforGraph = /** @type {MetaForGraph} */ (document.querySelector("metafor-graph"))
  //
  // return metaforGraph.addParticle(particle.snapshot()).then((component) => {
  //   // Добавляем обработчики обновлений
  //   particle.onTransition((_, newState) => component.updateState(newState))
  //   const originalUpdate = particle.update.bind(particle)
  //   particle.update = (context) => {
  //     const updCtx = originalUpdate(context)
  //     component.updateContext(context)
  //   }
  //   return component
  // })
}
