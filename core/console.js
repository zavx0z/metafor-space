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
    .padEnd(width, ' ');
};

/** @param {Object} obj*/
const formatAndLogObject = (obj) => {
  const jsonString = JSON.stringify(obj, null, 2);
  const lines = jsonString.split('\n');

  lines.forEach((line, i) => {
    // Определяем стили в зависимости от содержания строки
    let style = "color: #999;"; // Стандартный цвет

    if (line.includes('{') || line.includes('}') || line.includes('[') || line.includes(']')) {
      style = "color: #ff9900; font-weight: bold;"; // Скобки
    } else if (line.match(/"[^"]+":/)) {
      style = "color: #6699cc;"; // Ключи
    } else if (line.match(/: ".+"/) || line.match(/: \[/)) {
      style = "color: #33cc33;"; // Строковые значения и массивы
    } else if (line.match(/: \d+/)) {
      style = "color: #cc99ff;"; // Числовые значения
    } else if (line.match(/: true|false/)) {
      style = "color: #ff6666;"; // Булевы значения
    }

    // Для первой и последней строки не добавляем отступ
    const indent = (i > 0 && i < lines.length - 1) ? '  ' : '';

    console.log(`%c${indent}${line}`, style);
  });
};

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
      return line;
    }
    return `${line}`; // Добавляем отступ для вложенных строк
  })
  .join('\n');

/**
 * @param {import("../metafor").BroadcastMessage} message
 * @param {import("../types/core").CoreObj} core
 */
export function log(message, core) {
  const {meta, patch} = message
  // Ширины колонок
  const TAG_WIDTH = 10;
  const OP_WIDTH = 8;
  const PATH_WIDTH = 15;

  // tag выравниваем по левому краю, остальные по центру
  const tag = String(meta.tag).padEnd(TAG_WIDTH, ' ');
  const op = centerText(String(patch.op), OP_WIDTH);
  const path = centerText(String(patch.path), PATH_WIDTH);

  // Специальная обработка для /state
  if (patch.path === "/state") {
    const stateValue = Array.isArray(patch.value)
      ? JSON.stringify(patch.value, null, 2)
      : typeof patch.value === 'object' && patch.value !== null
        ? JSON.stringify(patch.value, null, 2)
        : patch.value;
    console.groupCollapsed(
      `%c${tag}%c | %c${op}%c | %c${path}%c - %c${stateValue}`,
      "color: #3498db; font-weight: bold",
      "",
      "color: #e74c3c",
      "",
      "color: #2ecc71",
      "",
      "color: lightskyblue; font-weight: bold"
    );
    console.log("core snap: ", {...core})
    console.log("core live: ", core)
    console.groupEnd()
    return;
  } else if (patch.path === "/") {
    console.groupCollapsed(
      `%c${tag}%c | %c${op}%c | %c${path}`,
      "color: #3498db; font-weight: bold",
      "",
      "color: #e74c3c",
      "",
      "color: #2ecc71"
    );
  } else
    // Стандартный вывод в группе
    console.group(
      `%c${tag}%c | %c${op}%c | %c${path}`,
      "color: #3498db; font-weight: bold",
      "",
      "color: #e74c3c",
      "",
      "color: #2ecc71"
    );

  if (typeof patch.value === 'object' && patch.value !== null) {
    console.log(formattedObj(patch.value))
    console.log("core snap: ", {...core})
    console.log("core live: ", core)
  } else {
    console.log(patch.value);
  }
  console.groupEnd();
}

// const ch = new BroadcastChannel("channel")
// /** @param {{data: import("../metafor").BroadcastMessage}} message */
// ch.onmessage = ({data: {meta, patch}}) => {
//   log({meta, patch})
// }