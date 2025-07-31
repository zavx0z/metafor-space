import { MetaFor } from "./server/metafor"

MetaFor("server")
  .context((types) => ({
    test: types.string.required("test"),
  }))
  .states({
    init: {},
  })
  .core()
  .processes((process) => ({
    init: process()
      .action(({ context }) => {
        return {
          test: "test",
        }
      })
      .success(({ data, update }) => update(data)),
  }))
  .reactions((reaction) => [
    [
      ["init"],
      reaction()
        .filter({
          tag: "roadmap",
        })
        .equal(({ update, meta }) => {
          update({
            test: meta.tag,
          })
        }),
    ],
  ])
  .view({
    render: ({ html, context }) => html`<div>test: ${context.test}</div>`,
  })
