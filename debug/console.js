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
  patch: ["add", "remove", "replace", "move", "copy", "test"],
  path: ["/", "/context", "/state"],
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
      ;
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
      ;
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
      ;
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

//# debugId=8E12FC3DB8470E9664756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZGVidWcvY29uc29sZS5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsKICAgICJjb25zdCBjb25maWcgPSB7XG4gIGFjdGl2ZTogdHJ1ZSxcbiAgLy8gYWN0aXZlOiB0cnVlLFxuICBjb2xsYXBzZUFsbDogdHJ1ZSxcbiAgLyoqQHR5cGV7QXJyYXk8c3RyaW5nPn0qL1xuICB0YWc6IFtcbiAgICAvLyBcImdyYXBoLW1ldGFcIixcbiAgICAvLyBcImdyYXBoLXBhcmFtXCJcbiAgICAvLyBcImdyYXBoLXN0YXRlXCIsXG4gICAgLy8gXCJncmFwaC1jb250ZXh0XCIsXG4gICAgLy8gXCJncmFwaC1sYXlvdXRcIlxuICAgIC8vIFwidGVzdFwiLFxuICAgIC8vIFwiaW5wdXQtZW51bVwiLFxuICAgIC8vIFwiZ3JhcGgtbm9kZXNcIixcbiAgICAvLyBcImdyYXBoLWxpc3RlbmVyXCIsXG4gICAgLy8gXCJyb2FkbWFwXCJcbiAgXSxcbiAgaW5kZXg6IG51bGwsXG4gIHBhdGNoOiBbXCJhZGRcIiwgXCJyZW1vdmVcIiwgXCJyZXBsYWNlXCIsIFwibW92ZVwiLCBcImNvcHlcIiwgXCJ0ZXN0XCJdLFxuICAvKipAdHlwZXtBcnJheTwgXCIvXCIgfCBcIi9jb250ZXh0XCIgfCBcIi9zdGF0ZVwiID59Ki9cbiAgcGF0aDogW1wiL1wiLCBcIi9jb250ZXh0XCIsIFwiL3N0YXRlXCJdLFxuICAvLyDQqNC40YDQuNC90Ysg0LrQvtC70L7QvdC+0LpcbiAgd2lkdGg6IHtcbiAgICB0YWc6IDIyLFxuICAgIG9wOiA4LFxuICAgIHBhdGg6IDE1LFxuICB9LFxuICBkZXRhaWw6IHtcbiAgICBjb3JlOiBmYWxzZSxcbiAgfSxcbn1cbi8qKlxuICpcbiAqIEBwYXJhbSB7aW1wb3J0KFwiLi4vbWVzc2FnZS9pbmRleC50XCIpLk1lc3NhZ2V9IG1lc3NhZ2VcbiAqIEBwYXJhbSB7XCIvXCIgfCBcIi9jb250ZXh0XCIgfCBcIi9zdGF0ZVwifSBwYXRoXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNMb2cgPSAoeyBtZXRhLCBwYXRjaCB9LCBwYXRoKSA9PlxuICBCb29sZWFuKFxuICAgIGNvbmZpZy5hY3RpdmUgJiZcbiAgICAgIHBhdGNoLnBhdGggPT09IHBhdGggJiZcbiAgICAgIGNvbmZpZy5wYXRoLmluY2x1ZGVzKHBhdGgpICYmXG4gICAgICAoIWNvbmZpZy50YWcubGVuZ3RoIHx8IGNvbmZpZy50YWcuaW5jbHVkZXMobWV0YS50YWcpKSAmJlxuICAgICAgKGNvbmZpZy5pbmRleCA9PT0gbnVsbCB8fCBtZXRhLmluZGV4ID09PSBjb25maWcuaW5kZXgpXG4gIClcblxuLyoqXG4gKiBAcGFyYW0ge2ltcG9ydChcIi4uL21lc3NhZ2UvaW5kZXgudFwiKS5NZXNzYWdlfSBtZXNzYWdlXG4gKiBAcGFyYW0ge1JlY29yZDxzdHJpbmcsIGFueT59IGNvcmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvZyhtZXNzYWdlLCBjb3JlKSB7XG4gIGNvbnN0IHsgbWV0YSwgcGF0Y2ggfSA9IG1lc3NhZ2VcblxuICBjb25zdCB0YWcgPSBTdHJpbmcobWV0YS50YWcpLnBhZEVuZChjb25maWcud2lkdGgudGFnLCBcIiBcIilcbiAgY29uc3QgaW5kZXggPSBTdHJpbmcobWV0YS5pbmRleCkucGFkRW5kKDQsIFwiIFwiKVxuICBjb25zdCBvcCA9IGNlbnRlclRleHQoU3RyaW5nKHBhdGNoLm9wKSwgY29uZmlnLndpZHRoLm9wKVxuICBjb25zdCBwYXRoID0gU3RyaW5nKHBhdGNoLnBhdGgpLnBhZEVuZChjb25maWcud2lkdGgucGF0aCwgXCIgXCIpXG5cbiAgY29uc3QgdmFsdWUgPSBmb3JtYXR0ZWRPYmoocGF0Y2gudmFsdWUpXG4gIGNvbnN0IGlzRXJyb3IgPSBPYmplY3QuaGFzT3duKHBhdGNoLnZhbHVlLCBcImVycm9yXCIpXG5cbiAgc3dpdGNoICh0cnVlKSB7XG4gICAgY2FzZSBpc0xvZyhtZXNzYWdlLCBcIi9cIik6XG4gICAgICA7KCgpID0+IHtcbiAgICAgICAgY29uc3QgbXNnID0gW1xuICAgICAgICAgIGAlYyR7dGFnfSR7aW5kZXh9JWMgfCAlYyR7b3B9JWMgfCAlYyR7cGF0aH1gLFxuICAgICAgICAgIFwiY29sb3I6ICMzNDk4ZGI7IGZvbnQtd2VpZ2h0OiBib2xkXCIsXG4gICAgICAgICAgXCJcIixcbiAgICAgICAgICBcImNvbG9yOiAjZTc0YzNjXCIsXG4gICAgICAgICAgXCJcIixcbiAgICAgICAgICBcImNvbG9yOiAjMmVjYzcxXCIsXG4gICAgICAgIF1cbiAgICAgICAgY29uZmlnLmNvbGxhcHNlQWxsID8gY29uc29sZS5ncm91cENvbGxhcHNlZCguLi5tc2cpIDogY29uc29sZS5ncm91cCguLi5tc2cpXG5cbiAgICAgICAgaWYgKHR5cGVvZiBwYXRjaC52YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiBwYXRjaC52YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKVxuICAgICAgICAgIGNvbmZpZy5kZXRhaWwuY29yZSAmJiBsb2dDb3JlKGNvcmUpXG4gICAgICAgIH0gZWxzZSBjb25zb2xlLmxvZyhwYXRjaC52YWx1ZSlcblxuICAgICAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICAgIH0pKClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSBpc0xvZyhtZXNzYWdlLCBcIi9jb250ZXh0XCIpOlxuICAgICAgOygoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZyA9IFtcbiAgICAgICAgICBgJWMke3RhZ30ke2luZGV4fSVjIHwgJWMke29wfSVjIHwgJWMke3BhdGh9YCxcbiAgICAgICAgICBgY29sb3I6ICMzNDk4ZGI7IGZvbnQtd2VpZ2h0OiBib2xkOyAke2lzRXJyb3IgPyBcImJhY2tncm91bmQ6ICM3ZDQ1NDVcIiA6IFwiXCJ9YCxcbiAgICAgICAgICBcIlwiLFxuICAgICAgICAgIFwiY29sb3I6ICNlNzRjM2NcIixcbiAgICAgICAgICBcIlwiLFxuICAgICAgICAgIFwiY29sb3I6ICMyZWNjNzFcIixcbiAgICAgICAgXVxuXG4gICAgICAgIGlmIChpc0Vycm9yKSBjb25zb2xlLmdyb3VwKC4uLm1zZylcbiAgICAgICAgZWxzZSBpZiAoY29uZmlnLmNvbGxhcHNlQWxsKSBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKC4uLm1zZylcbiAgICAgICAgZWxzZSBjb25zb2xlLmdyb3VwKC4uLm1zZylcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICh0eXBlb2YgcGF0Y2gudmFsdWUgPT09IFwib2JqZWN0XCIgJiYgcGF0Y2gudmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKVxuICAgICAgICAgICAgY29uZmlnLmRldGFpbC5jb3JlICYmIGxvZ0NvcmUoY29yZSlcbiAgICAgICAgICB9IGVsc2UgY29uc29sZS5sb2cocGF0Y2gudmFsdWUpXG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpXG4gICAgICAgIH1cbiAgICAgIH0pKClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSBpc0xvZyhtZXNzYWdlLCBcIi9zdGF0ZVwiKTpcbiAgICAgIDsoKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGF0ZVZhbHVlID0gQXJyYXkuaXNBcnJheShwYXRjaC52YWx1ZSlcbiAgICAgICAgICA/IEpTT04uc3RyaW5naWZ5KHBhdGNoLnZhbHVlLCBudWxsLCAyKVxuICAgICAgICAgIDogdHlwZW9mIHBhdGNoLnZhbHVlID09PSBcIm9iamVjdFwiICYmIHBhdGNoLnZhbHVlICE9PSBudWxsXG4gICAgICAgICAgPyBKU09OLnN0cmluZ2lmeShwYXRjaC52YWx1ZSwgbnVsbCwgMilcbiAgICAgICAgICA6IHBhdGNoLnZhbHVlXG5cbiAgICAgICAgY29uc3QgbXNnID0gW1xuICAgICAgICAgIGAlYyR7dGFnfSR7aW5kZXh9JWMgfCAlYyR7b3B9JWMgfCAlYyR7cGF0aH0lYyAlYyR7c3RhdGVWYWx1ZX1gLFxuICAgICAgICAgIFwiY29sb3I6ICMzNDk4ZGI7IGZvbnQtd2VpZ2h0OiBib2xkXCIsXG4gICAgICAgICAgXCJcIixcbiAgICAgICAgICBcImNvbG9yOiAjZTc0YzNjXCIsXG4gICAgICAgICAgXCJcIixcbiAgICAgICAgICBcImNvbG9yOiAjMmVjYzcxXCIsXG4gICAgICAgICAgXCJcIixcbiAgICAgICAgICBcImNvbG9yOiBsaWdodHNreWJsdWU7IGZvbnQtd2VpZ2h0OiBib2xkXCIsXG4gICAgICAgIF1cbiAgICAgICAgY29uZmlnLmNvbGxhcHNlQWxsID8gY29uc29sZS5ncm91cENvbGxhcHNlZCguLi5tc2cpIDogY29uc29sZS5ncm91cCguLi5tc2cpXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uZmlnLmRldGFpbC5jb3JlICYmIGxvZ0NvcmUoY29yZSlcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICAgICAgfVxuICAgICAgfSkoKVxuICAgICAgYnJlYWtcbiAgfVxufVxuXG4vKipcbiAqINCk0YPQvdC60YbQuNGPINC00LvRjyDRhtC10L3RgtGA0LjRgNC+0LLQsNC90LjRjyDRgtC10LrRgdGC0LBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmNvbnN0IGNlbnRlclRleHQgPSAodGV4dCwgd2lkdGgpID0+IHtcbiAgY29uc3QgcGFkTGVmdCA9IE1hdGguZmxvb3IoKHdpZHRoIC0gdGV4dC5sZW5ndGgpIC8gMilcbiAgcmV0dXJuIHRleHQucGFkU3RhcnQocGFkTGVmdCArIHRleHQubGVuZ3RoLCBcIiBcIikucGFkRW5kKHdpZHRoLCBcIiBcIilcbn1cblxuLyoqXG4gKiDQmNGB0L/QvtC70YzQt9GD0LXQvCBKU09OLnN0cmluZ2lmeSDQtNC70Y8g0LrRgNCw0YHQuNCy0L7Qs9C+INCy0YvQstC+0LTQsCDQvtCx0YrQtdC60YLQsFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuY29uc3QgZm9ybWF0dGVkT2JqID0gKHZhbHVlKSA9PlxuICBKU09OLnN0cmluZ2lmeSh2YWx1ZSwgbnVsbCwgMilcbiAgICAuc3BsaXQoXCJcXG5cIilcbiAgICAubWFwKChsaW5lLCBpLCBsaW5lcykgPT4ge1xuICAgICAgLy8g0J3QtSDQtNC+0LHQsNCy0LvRj9C10Lwg0L7RgtGB0YLRg9C/INC00LvRjyDQv9C10YDQstC+0Lkg0Lgg0L/QvtGB0LvQtdC00L3QtdC5INGB0YLRgNC+0LrQuFxuICAgICAgaWYgKGkgPT09IDAgfHwgaSA9PT0gbGluZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICByZXR1cm4gbGluZVxuICAgICAgfVxuICAgICAgcmV0dXJuIGAke2xpbmV9YCAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0L7RgtGB0YLRg9C/INC00LvRjyDQstC70L7QttC10L3QvdGL0YUg0YHRgtGA0L7QulxuICAgIH0pXG4gICAgLmpvaW4oXCJcXG5cIilcblxuLyoqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgYW55Pn0gY29yZSAqL1xuY29uc3QgbG9nQ29yZSA9IChjb3JlKSA9PiB7XG4gIGNvbnNvbGUubG9nKFwic25hcHNob3QgZGVidWc6IFwiLCB7IC4uLmNvcmUgfSlcbiAgY29uc29sZS5sb2coXCJjdXJyZW50ICBkZWJ1ZzogXCIsIGNvcmUpXG59XG4iCiAgXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTSxTQUFTO0FBQUEsRUFDYixRQUFRO0FBQUEsRUFFUixhQUFhO0FBQUEsRUFFYixLQUFLLENBV0w7QUFBQSxFQUNBLE9BQU87QUFBQSxFQUNQLE9BQU8sQ0FBQyxPQUFPLFVBQVUsV0FBVyxRQUFRLFFBQVEsTUFBTTtBQUFBLEVBRTFELE1BQU0sQ0FBQyxLQUFLLFlBQVksUUFBUTtBQUFBLEVBRWhDLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxJQUNMLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxFQUNSO0FBQUEs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
