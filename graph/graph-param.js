import { MetaFor } from "../metafor.js"
import "./graph-socket.js"
import "../inputs/input-string.js"
import "../inputs/input-number.js"
import "../inputs/input-boolean.js"
import "../inputs/input-array.js"
import "../inputs/input-enum.js"

MetaFor("graph-param")
  .context((t) => ({
    id: t.string.required()({ title: "ID meta" }),
    state: t.string.required()({ title: "Название состояния" }),
    param: t.string.required()({ title: "Ключ параметра" }),
    title: t.string.required()({ title: "Название параметра" }),
    type: t.enum("string", "number", "boolean", "array", "enum").required()({ title: "Тип параметра" }),
    value: t.string.optional()({ title: "Значение параметра" }),
    error: t.string.optional()({ title: "Ошибка" }),
    width: t.number.optional(),
    height: t.number.optional(),
    x: t.number.optional(),
    y: t.number.optional(),
    options: t.array.optional(),
  }))
  .states({
    рендер: { измерение: { error: null } },
    измерение: { "установка положения": { x: { null: false }, y: { null: false } } },
    "установка положения": {},
  })
  .core()
  .processes((process) => ({
    рендер: process({}).action(() => {
      console.log("рендер")
      //   document.addEventListener("channel", (ev) => {
      //     const {detail} = /** @type {CustomEvent} */ (ev)
      //     const {meta, patch} =  /**@type {import("../metafor.js").BroadcastMessage}*/(detail)
      //     if (
      //       context.id === `${meta.tag}/${meta.index}`
      //       && patch.path === "/context"
      //       && Object.hasOwn(patch.value, context.param)
      //     ) {
      //       // console.log(context.param, patch.value[context.param])
      //       // console.log(patch.value[context.param])
      //       update({value: patch.value[context.param]})
      //     }
      //   })
      //   return {
      //     /** @type {MetaAny|null}*/
      //     meta: null
      //   }
      // })
    }),
    измерение: process({})
      .action(
        ({ element }) =>
          new Promise((resolve) => {
            requestAnimationFrame(() => {
              const { width, height } = element.getBoundingClientRect()
              resolve({ width: Math.round(width), height: Math.round(height) })
            })
          })
      )
      .success(({ update, data }) => update({ x: data.width, y: data.height })),
  }))
  .reactions((reaction) => [
    [
      ["измерение", "установка положения"],
      reaction({ title: "изменение значений" })
        .filter({
          tag: { include: "input-" },
          path: "/context",
          // patch: {value: {value: {null: false}}},
        })
        .equal(({ patch, core, context }) => {
          if (patch.value.value) core.meta.update({ [context.param]: patch.value.value })
        }),
    ],
  ])
  .view({
    onMount() {},
    render: ({ context, html, choose }) => html`
      <metafor-graph-socket
        context=${{
          id: context.id,
          state: context.state,
          param: context.param,
          parent: "state",
          direction: "west",
          type: context.type,
        }}></metafor-graph-socket>
      ${choose(
        context.type,
        [
          [
            "string",
            () => html` <metafor-input-string
              context=${{
                name: context.param,
                title: context.title,
                value: context.value,
              }}></metafor-input-string>`,
          ],
          [
            "number",
            () => html` <metafor-input-number
              context=${{
                name: context.param,
                title: context.title,
                value: context.value,
              }}></metafor-input-number>`,
          ],
          [
            "boolean",
            () => html` <metafor-input-boolean
              context=${{
                name: context.param,
                title: context.title,
                value: context.value,
              }}></metafor-input-boolean>`,
          ],
          [
            "array",
            () => html` <metafor-input-array
              context=${{
                name: context.param,
                title: context.title,
                value: context.value,
              }}></metafor-input-array>`,
          ],
          [
            "enum",
            () => html` <metafor-input-enum
              context=${{
                name: context.param,
                title: context.title,
                value: context.value,
                options: context.options,
              }}></metafor-input-enum>`,
          ],
        ],
        () => html` <span>Неизвестный тип</span> `
      )}
      <metafor-graph-socket
        context=${{
          id: context.id,
          state: context.state,
          param: context.param,
          parent: "state",
          direction: "east",
          type: context.type,
        }}></metafor-graph-socket>
    `,
    style: ({ css }) => css`
      :host {
        background-color: rgba(var(--surface-900));
        margin: 2px 0;
        padding: 0 2px;
        display: flex;
        align-items: center;
        border-radius: calc(var(--node-border-radius) / 2);
      }
    `,
  })
