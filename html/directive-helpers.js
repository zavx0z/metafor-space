import {ChildPart} from "./html.js"

/** @type{import("./directive-helpers").wrap} */
const wrap = (node) => node

/** @type{import("./directive-helpers").isTemplateResult} */
export const isTemplateResult = (value, type) => {
  const htmlType = /** @type {import("./html").UncompiledTemplateResult} */  (value)?.['_$htmlType$']
  if (type === undefined) return htmlType !== undefined
  else return htmlType === type
}

/** @type{import("./directive-helpers").isCompiledTemplateResult} */
export const isCompiledTemplateResult = (value) => {
  /** @type{import("./html").CompiledTemplate} */
  const htmlType = /** @type{import("./html").CompiledTemplateResult} */ (value)?.['_$htmlType$']
  return htmlType?.h != null
}

/** @type{import("./directive-helpers").isDirectiveResult} */
export const isDirectiveResult = (value) => {
  const htmlDirective =   /** @type{import('./directive').DirectiveResult} */(value)?.['_$htmlDirective$']
  return htmlDirective !== undefined
}

/** @type{import("./directive-helpers").getDirectiveClass} */
export const getDirectiveClass = (value) => /** @type{import("./directive").DirectiveClass | undefined} */
  (/** @type{import("./directive").DirectiveResult} */ (value)?.['_$htmlDirective$'])


const createMarker = () => document.createComment('')

/** @type{import("./directive-helpers").insertPart} */
export const insertPart = (containerPart, refPart, part) => {
  const container = /** @type{ParentNode} */ (wrap(containerPart._$startNode).parentNode)

  const refNode = refPart === undefined ? containerPart._$endNode : refPart._$startNode

  if (part === undefined) {
    const startNode = wrap(container).insertBefore(createMarker(), refNode)
    const endNode = wrap(container).insertBefore(createMarker(), refNode)
    part = new ChildPart(
      startNode,
      endNode,
      containerPart,
      containerPart.options
    )
  } else {
    const endNode = wrap(/** @type{ChildNode} */(part._$endNode)).nextSibling
    const oldParent = part._$parent
    const parentChanged = oldParent !== containerPart
    if (parentChanged) {
      part._$reparentDisconnectables?.(containerPart)
      // Хотя `_$reparentDisconnectables` обновляет ссылку части
      // `_$parent` после отключения от текущего родителя, этот метод существует
      // только если присутствуют Disconnectables, поэтому нам нужно безусловно
      // установить его здесь
      part._$parent = containerPart
      // Поскольку геттер _$isConnected довольно затратный, читаем его только
      // когда мы знаем, что в поддереве есть директивы, которые нужно уведомить
      let newConnectionState
      if (
        part._$notifyConnectionChanged !== undefined &&
        (newConnectionState = containerPart._$isConnected) !==
        /**@type {import("./html").Disconnectable} */ (oldParent)._$isConnected
      ) {
        part._$notifyConnectionChanged(newConnectionState)
      }
    }
    if (endNode !== refNode || parentChanged) {

      let start =  /** @type{ChildNode | null} */ (part._$startNode)
      while (start !== endNode) {
        const n = wrap(/** @type{ChildNode} */(start)).nextSibling
        wrap(container).insertBefore(/** @type{ChildNode} */(start), refNode)
        start = n
      }
    }
  }

  return part
}

/** @type{import("./directive-helpers").setChildPartValue} */
export const setChildPartValue = (part, value, directiveParent = part) => {
  part._$setValue(value, directiveParent)
  return part
}

const RESET_VALUE = {}

/** @type{import("./directive-helpers").setCommittedValue} */
export const setCommittedValue = (part, value = RESET_VALUE) => (part._$committedValue = value)

/** @type{import("./directive-helpers").getCommittedValue} */
export const getCommittedValue = (part) => part._$committedValue

/** @type{import("./directive-helpers").removePart} */
export const removePart = (part) => {
  part._$notifyConnectionChanged?.(false, true)
  let start = /** @type{ChildNode | null} */(part._$startNode)
  const end = wrap(/** @type{ChildNode} */(part._$endNode)).nextSibling
  while (start !== end) {
    const n = wrap(/** @type{ChildNode} */(start)).nextSibling;
    (wrap(/** @type{ChildNode} */(start))).remove()
    start = n
  }
}

/** @type{import("./directive-helpers").clearPart} */
export const clearPart = (part) => part._$clear()

/** @type{import("./directive-helpers").isPrimitive} */
export const isPrimitive = (value) => value === null || (typeof value != 'object' && typeof value != 'function')