const config = {
  collapseAll: true,
  tag: ["node-meta-state"],
  patch: [
    "add",
    "remove",
    "replace",
    "move",
    "copy",
    "test"
  ],
  /**@type{Array< "/" | "/context" | "/state" >}*/
  path: [
    // "/",
    // "/context",
    "/state",
  ]
}

/**
 * @param {import("../metafor").BroadcastMessage} message
 * @param {import("../types/core").CoreObj} core
 */
export function log(message, core) {
  const {meta, patch} = message
  // Ширины колонок
  const TAG_WIDTH = 22
  const OP_WIDTH = 8
  const PATH_WIDTH = 15

  // tag выравниваем по левому краю, остальные по центру
  const tag = String(meta.tag).padEnd(TAG_WIDTH, ' ')
  const index = String(meta.index).padEnd(4, ' ')
  const op = centerText(String(patch.op), OP_WIDTH)
  // const path = centerText(String(patch.path), PATH_WIDTH)
  const path = String(patch.path).padEnd(PATH_WIDTH, ' ')

  // Специальная обработка для /state
  if (patch.path === "/state"
    && config.path.includes("/state")
    && (config.tag.length && config.tag.includes(meta.tag))
  ) {
    const stateValue = Array.isArray(patch.value)
      ? JSON.stringify(patch.value, null, 2)
      : typeof patch.value === 'object' && patch.value !== null
        ? JSON.stringify(patch.value, null, 2)
        : patch.value
    const msg = [`%c${tag}${index}%c | %c${op}%c | %c${path}%c %c${stateValue}`, "color: #3498db; font-weight: bold", "", "color: #e74c3c", "", "color: #2ecc71", "", "color: lightskyblue; font-weight: bold"]
    config.collapseAll ? console.groupCollapsed(...msg) : console.group(...msg)
    logCore(core)
    console.groupEnd()

  } else if (patch.path === "/"
    && config.path.includes("/")
    && (config.tag.length && config.tag.includes(meta.tag))
  ) {
    const msg = [`%c${tag}${index}%c | %c${op}%c | %c${path}`, "color: #3498db; font-weight: bold", "", "color: #e74c3c", "", "color: #2ecc71"]
    config.collapseAll ? console.groupCollapsed(...msg) : console.group(...msg)

    if (typeof patch.value === 'object' && patch.value !== null) {
      console.log(formattedObj(patch.value))
      logCore(core)
    } else console.log(patch.value)
    console.groupEnd()

  } else if (patch.path === "/context"
    && config.path.includes("/context")
    && (config.tag.length && config.tag.includes(meta.tag))
  ) {
    // Стандартный вывод в группе
    const isError = Object.hasOwn(patch.value, 'error')
    const msg = [`%c${tag}${index}%c | %c${op}%c | %c${path}`,
      `color: #3498db; font-weight: bold; ${isError ? "background: #7d4545" : ""}`,
      "", "color: #e74c3c", "", "color: #2ecc71"]
    if (isError) console.group(...msg)
    else if (config.collapseAll) console.groupCollapsed(...msg)
    else console.group(...msg)

    if (typeof patch.value === 'object' && patch.value !== null) {
      console.log(formattedObj(patch.value))
      logCore(core)
    } else console.log(patch.value)
    console.groupEnd()

  }
}

/**
 * Функция для центрирования текста
 *
 * @param {string} text
 * @param {number} width
 * @return {string}
 */
const centerText = (text, width) => {
  const padLeft = Math.floor((width - text.length) / 2);
  return text
    .padStart(padLeft + text.length, ' ')
    .padEnd(width, ' ')
}

/**
 * Используем JSON.stringify для красивого вывода объекта
 *
 * @param {*} value
 * @return {string}
 */
const formattedObj = (value) => JSON.stringify(value, null, 2)
  .split('\n')
  .map((line, i, lines) => {
    // Не добавляем отступ для первой и последней строки
    if (i === 0 || i === lines.length - 1) {
      return line
    }
    return `${line}` // Добавляем отступ для вложенных строк
  })
  .join('\n')

/** @param {import("../types/core").CoreObj} core */
const logCore = (core) => {
  console.log("snapshot core: ", {...core})
  console.log("current  core: ", core)
}