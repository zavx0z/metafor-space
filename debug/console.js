var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// debug/console.js
var config = {
  active: true,
  collapseAll: true,
  tag: [],
  index: null,
  patch: [
    "add",
    "remove",
    "replace",
    "move",
    "copy",
    "test"
  ],
  path: [
    "/",
    "/context",
    "/state"
  ],
  width: {
    tag: 22,
    op: 8,
    path: 15
  },
  detail: {
    core: false
  }
};
var isLog = ({ meta, patch }, path) => Boolean(config.active && patch.path === path && config.path.includes(path) && (!config.tag.length || config.tag.includes(meta.tag)) && (config.index === null || meta.index === config.index));
function log(message, core) {
  const { meta, patch } = message;
  const tag = String(meta.tag).padEnd(config.width.tag, " ");
  const index = String(meta.index).padEnd(4, " ");
  const op = centerText(String(patch.op), config.width.op);
  const path = String(patch.path).padEnd(config.width.path, " ");
  const value = formattedObj(patch.value);
  const isError = Object.hasOwn(patch.value, "error");
  switch (true) {
    case isLog(message, "/"):
      (() => {
        const msg = [
          `%c${tag}${index}%c | %c${op}%c | %c${path}`,
          "color: #3498db; font-weight: bold",
          "",
          "color: #e74c3c",
          "",
          "color: #2ecc71"
        ];
        config.collapseAll ? console.groupCollapsed(...msg) : console.group(...msg);
        if (typeof patch.value === "object" && patch.value !== null) {
          console.log(value);
          config.detail.core && logCore(core);
        } else
          console.log(patch.value);
        console.groupEnd();
      })();
      break;
    case isLog(message, "/context"):
      (() => {
        const msg = [
          `%c${tag}${index}%c | %c${op}%c | %c${path}`,
          `color: #3498db; font-weight: bold; ${isError ? "background: #7d4545" : ""}`,
          "",
          "color: #e74c3c",
          "",
          "color: #2ecc71"
        ];
        if (isError)
          console.group(...msg);
        else if (config.collapseAll)
          console.groupCollapsed(...msg);
        else
          console.group(...msg);
        try {
          if (typeof patch.value === "object" && patch.value !== null) {
            console.log(value);
            config.detail.core && logCore(core);
          } else
            console.log(patch.value);
        } finally {
          console.groupEnd();
        }
      })();
      break;
    case isLog(message, "/state"):
      (() => {
        const stateValue = Array.isArray(patch.value) ? JSON.stringify(patch.value, null, 2) : typeof patch.value === "object" && patch.value !== null ? JSON.stringify(patch.value, null, 2) : patch.value;
        const msg = [
          `%c${tag}${index}%c | %c${op}%c | %c${path}%c %c${stateValue}`,
          "color: #3498db; font-weight: bold",
          "",
          "color: #e74c3c",
          "",
          "color: #2ecc71",
          "",
          "color: lightskyblue; font-weight: bold"
        ];
        config.collapseAll ? console.groupCollapsed(...msg) : console.group(...msg);
        try {
          config.detail.core && logCore(core);
        } finally {
          console.groupEnd();
        }
      })();
      break;
  }
}
var centerText = (text, width) => {
  const padLeft = Math.floor((width - text.length) / 2);
  return text.padStart(padLeft + text.length, " ").padEnd(width, " ");
};
var formattedObj = (value) => JSON.stringify(value, null, 2).split(`
`).map((line, i, lines) => {
  if (i === 0 || i === lines.length - 1) {
    return line;
  }
  return `${line}`;
}).join(`
`);
var logCore = (core) => {
  console.log("snapshot debug: ", { ...core });
  console.log("current  debug: ", core);
};
export {
  log
};

//# debugId=6D858DFFFEA3391764756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZGVidWcvY29uc29sZS5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsKICAgICJjb25zdCBjb25maWcgPSB7XG4gIGFjdGl2ZTogdHJ1ZSxcbiAgLy8gYWN0aXZlOiB0cnVlLFxuICBjb2xsYXBzZUFsbDogdHJ1ZSxcbiAgLyoqQHR5cGV7QXJyYXk8c3RyaW5nPn0qL1xuICB0YWc6IFtcbiAgICAvLyBcImdyYXBoLW1ldGFcIixcbiAgICAvLyBcImdyYXBoLXBhcmFtXCJcbiAgICAvLyBcImdyYXBoLXN0YXRlXCIsXG4gICAgLy8gXCJncmFwaC1jb250ZXh0XCIsXG4gICAgLy8gXCJncmFwaC1sYXlvdXRcIlxuICAgIC8vIFwidGVzdFwiLFxuICAgIC8vIFwiaW5wdXQtZW51bVwiLFxuICAgIC8vIFwiZ3JhcGgtbm9kZXNcIixcbiAgICAvLyBcImdyYXBoLWxpc3RlbmVyXCIsXG4gICAgLy8gXCJyb2FkbWFwXCJcbiAgXSxcbiAgaW5kZXg6IG51bGwsXG4gIHBhdGNoOiBbXG4gICAgXCJhZGRcIixcbiAgICBcInJlbW92ZVwiLFxuICAgIFwicmVwbGFjZVwiLFxuICAgIFwibW92ZVwiLFxuICAgIFwiY29weVwiLFxuICAgIFwidGVzdFwiXG4gIF0sXG4gIC8qKkB0eXBle0FycmF5PCBcIi9cIiB8IFwiL2NvbnRleHRcIiB8IFwiL3N0YXRlXCIgPn0qL1xuICBwYXRoOiBbXG4gICAgXCIvXCIsXG4gICAgXCIvY29udGV4dFwiLFxuICAgIFwiL3N0YXRlXCIsXG4gIF0sXG4gIC8vINCo0LjRgNC40L3RiyDQutC+0LvQvtC90L7QulxuICB3aWR0aDoge1xuICAgIHRhZzogMjIsXG4gICAgb3A6IDgsXG4gICAgcGF0aDogMTVcbiAgfSxcbiAgZGV0YWlsOiB7XG4gICAgY29yZTogZmFsc2VcbiAgfVxufVxuLyoqXG4gKlxuICogQHBhcmFtIHtpbXBvcnQoXCIuLi9tZXNzYWdlL2luZGV4LnRcIikuTWVzc2FnZX0gbWVzc2FnZVxuICogQHBhcmFtIHtcIi9cIiB8IFwiL2NvbnRleHRcIiB8IFwiL3N0YXRlXCJ9IHBhdGhcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5jb25zdCBpc0xvZyA9ICh7bWV0YSwgcGF0Y2h9LCBwYXRoKSA9PiBCb29sZWFuKFxuICBjb25maWcuYWN0aXZlXG4gICYmIHBhdGNoLnBhdGggPT09IHBhdGhcbiAgJiYgY29uZmlnLnBhdGguaW5jbHVkZXMocGF0aClcbiAgJiYgKCFjb25maWcudGFnLmxlbmd0aCB8fCBjb25maWcudGFnLmluY2x1ZGVzKG1ldGEudGFnKSlcbiAgJiYgKGNvbmZpZy5pbmRleCA9PT0gbnVsbCB8fCBtZXRhLmluZGV4ID09PSBjb25maWcuaW5kZXgpXG4pXG5cbi8qKlxuICogQHBhcmFtIHtpbXBvcnQoXCIuLi9tZXNzYWdlL2luZGV4LnRcIikuTWVzc2FnZX0gbWVzc2FnZVxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBhbnk+fSBjb3JlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2cobWVzc2FnZSwgY29yZSkge1xuICBjb25zdCB7bWV0YSwgcGF0Y2h9ID0gbWVzc2FnZVxuXG4gIGNvbnN0IHRhZyA9IFN0cmluZyhtZXRhLnRhZykucGFkRW5kKGNvbmZpZy53aWR0aC50YWcsICcgJylcbiAgY29uc3QgaW5kZXggPSBTdHJpbmcobWV0YS5pbmRleCkucGFkRW5kKDQsICcgJylcbiAgY29uc3Qgb3AgPSBjZW50ZXJUZXh0KFN0cmluZyhwYXRjaC5vcCksIGNvbmZpZy53aWR0aC5vcClcbiAgY29uc3QgcGF0aCA9IFN0cmluZyhwYXRjaC5wYXRoKS5wYWRFbmQoY29uZmlnLndpZHRoLnBhdGgsICcgJylcblxuICBjb25zdCB2YWx1ZSA9IGZvcm1hdHRlZE9iaihwYXRjaC52YWx1ZSlcbiAgY29uc3QgaXNFcnJvciA9IE9iamVjdC5oYXNPd24ocGF0Y2gudmFsdWUsICdlcnJvcicpXG5cbiAgc3dpdGNoICh0cnVlKSB7XG4gICAgY2FzZSBpc0xvZyhtZXNzYWdlLCBcIi9cIik6XG4gICAgICAoKCkgPT4ge1xuICAgICAgICBjb25zdCBtc2cgPSBbYCVjJHt0YWd9JHtpbmRleH0lYyB8ICVjJHtvcH0lYyB8ICVjJHtwYXRofWAsXG4gICAgICAgICAgXCJjb2xvcjogIzM0OThkYjsgZm9udC13ZWlnaHQ6IGJvbGRcIixcbiAgICAgICAgICBcIlwiLFxuICAgICAgICAgIFwiY29sb3I6ICNlNzRjM2NcIixcbiAgICAgICAgICBcIlwiLFxuICAgICAgICAgIFwiY29sb3I6ICMyZWNjNzFcIlxuICAgICAgICBdXG4gICAgICAgIGNvbmZpZy5jb2xsYXBzZUFsbCA/IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoLi4ubXNnKSA6IGNvbnNvbGUuZ3JvdXAoLi4ubXNnKVxuXG4gICAgICAgIGlmICh0eXBlb2YgcGF0Y2gudmFsdWUgPT09ICdvYmplY3QnICYmIHBhdGNoLnZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc29sZS5sb2codmFsdWUpXG4gICAgICAgICAgY29uZmlnLmRldGFpbC5jb3JlICYmIGxvZ0NvcmUoY29yZSlcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgY29uc29sZS5sb2cocGF0Y2gudmFsdWUpXG5cbiAgICAgICAgY29uc29sZS5ncm91cEVuZCgpXG4gICAgICB9KSgpXG4gICAgICBicmVha1xuICAgIGNhc2UgaXNMb2cobWVzc2FnZSwgXCIvY29udGV4dFwiKTpcbiAgICAgICgoKSA9PiB7XG5cbiAgICAgICAgY29uc3QgbXNnID0gW2AlYyR7dGFnfSR7aW5kZXh9JWMgfCAlYyR7b3B9JWMgfCAlYyR7cGF0aH1gLFxuICAgICAgICAgIGBjb2xvcjogIzM0OThkYjsgZm9udC13ZWlnaHQ6IGJvbGQ7ICR7aXNFcnJvciA/IFwiYmFja2dyb3VuZDogIzdkNDU0NVwiIDogXCJcIn1gLFxuICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgXCJjb2xvcjogI2U3NGMzY1wiLFxuICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgXCJjb2xvcjogIzJlY2M3MVwiXG4gICAgICAgIF1cblxuICAgICAgICBpZiAoaXNFcnJvcilcbiAgICAgICAgICBjb25zb2xlLmdyb3VwKC4uLm1zZylcbiAgICAgICAgZWxzZSBpZiAoY29uZmlnLmNvbGxhcHNlQWxsKVxuICAgICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoLi4ubXNnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS5ncm91cCguLi5tc2cpXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAodHlwZW9mIHBhdGNoLnZhbHVlID09PSAnb2JqZWN0JyAmJiBwYXRjaC52YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codmFsdWUpXG4gICAgICAgICAgICBjb25maWcuZGV0YWlsLmNvcmUgJiYgbG9nQ29yZShjb3JlKVxuICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgY29uc29sZS5sb2cocGF0Y2gudmFsdWUpXG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpXG4gICAgICAgIH1cbiAgICAgIH0pKClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSBpc0xvZyhtZXNzYWdlLCBcIi9zdGF0ZVwiKTpcbiAgICAgICgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXRlVmFsdWUgPSBBcnJheS5pc0FycmF5KHBhdGNoLnZhbHVlKVxuICAgICAgICAgID8gSlNPTi5zdHJpbmdpZnkocGF0Y2gudmFsdWUsIG51bGwsIDIpXG4gICAgICAgICAgOiB0eXBlb2YgcGF0Y2gudmFsdWUgPT09ICdvYmplY3QnICYmIHBhdGNoLnZhbHVlICE9PSBudWxsXG4gICAgICAgICAgICA/IEpTT04uc3RyaW5naWZ5KHBhdGNoLnZhbHVlLCBudWxsLCAyKVxuICAgICAgICAgICAgOiBwYXRjaC52YWx1ZVxuXG4gICAgICAgIGNvbnN0IG1zZyA9IFtgJWMke3RhZ30ke2luZGV4fSVjIHwgJWMke29wfSVjIHwgJWMke3BhdGh9JWMgJWMke3N0YXRlVmFsdWV9YCxcbiAgICAgICAgICBcImNvbG9yOiAjMzQ5OGRiOyBmb250LXdlaWdodDogYm9sZFwiLFxuICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgXCJjb2xvcjogI2U3NGMzY1wiLFxuICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgXCJjb2xvcjogIzJlY2M3MVwiLFxuICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgXCJjb2xvcjogbGlnaHRza3libHVlOyBmb250LXdlaWdodDogYm9sZFwiXG4gICAgICAgIF1cbiAgICAgICAgY29uZmlnLmNvbGxhcHNlQWxsID8gY29uc29sZS5ncm91cENvbGxhcHNlZCguLi5tc2cpIDogY29uc29sZS5ncm91cCguLi5tc2cpXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uZmlnLmRldGFpbC5jb3JlICYmIGxvZ0NvcmUoY29yZSlcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICAgICAgfVxuICAgICAgfSkoKVxuICAgICAgYnJlYWtcbiAgfVxufVxuXG4vKipcbiAqINCk0YPQvdC60YbQuNGPINC00LvRjyDRhtC10L3RgtGA0LjRgNC+0LLQsNC90LjRjyDRgtC10LrRgdGC0LBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmNvbnN0IGNlbnRlclRleHQgPSAodGV4dCwgd2lkdGgpID0+IHtcbiAgY29uc3QgcGFkTGVmdCA9IE1hdGguZmxvb3IoKHdpZHRoIC0gdGV4dC5sZW5ndGgpIC8gMik7XG4gIHJldHVybiB0ZXh0XG4gICAgLnBhZFN0YXJ0KHBhZExlZnQgKyB0ZXh0Lmxlbmd0aCwgJyAnKVxuICAgIC5wYWRFbmQod2lkdGgsICcgJylcbn1cblxuLyoqXG4gKiDQmNGB0L/QvtC70YzQt9GD0LXQvCBKU09OLnN0cmluZ2lmeSDQtNC70Y8g0LrRgNCw0YHQuNCy0L7Qs9C+INCy0YvQstC+0LTQsCDQvtCx0YrQtdC60YLQsFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuY29uc3QgZm9ybWF0dGVkT2JqID0gKHZhbHVlKSA9PlxuICBKU09OLnN0cmluZ2lmeSh2YWx1ZSwgbnVsbCwgMilcbiAgICAuc3BsaXQoJ1xcbicpXG4gICAgLm1hcCgobGluZSwgaSwgbGluZXMpID0+IHtcbiAgICAgIC8vINCd0LUg0LTQvtCx0LDQstC70Y/QtdC8INC+0YLRgdGC0YPQvyDQtNC70Y8g0L/QtdGA0LLQvtC5INC4INC/0L7RgdC70LXQtNC90LXQuSDRgdGC0YDQvtC60LhcbiAgICAgIGlmIChpID09PSAwIHx8IGkgPT09IGxpbmVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcmV0dXJuIGxpbmVcbiAgICAgIH1cbiAgICAgIHJldHVybiBgJHtsaW5lfWAgLy8g0JTQvtCx0LDQstC70Y/QtdC8INC+0YLRgdGC0YPQvyDQtNC70Y8g0LLQu9C+0LbQtdC90L3Ri9GFINGB0YLRgNC+0LpcbiAgICB9KVxuICAgIC5qb2luKCdcXG4nKVxuXG4vKiogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBhbnk+fSBjb3JlICovXG5jb25zdCBsb2dDb3JlID0gKGNvcmUpID0+IHtcbiAgY29uc29sZS5sb2coXCJzbmFwc2hvdCBkZWJ1ZzogXCIsIHsuLi5jb3JlfSlcbiAgY29uc29sZS5sb2coXCJjdXJyZW50ICBkZWJ1ZzogXCIsIGNvcmUpXG59IgogIF0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUztBQUFBLEVBQ2IsUUFBUTtBQUFBLEVBRVIsYUFBYTtBQUFBLEVBRWIsS0FBSyxDQVdMO0FBQUEsRUFDQSxPQUFPO0FBQUEsRUFDUCxPQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUFBLEVBRUEsTUFBTTtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsSUFD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
