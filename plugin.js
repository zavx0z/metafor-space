// import { MarkdownPageEvent } from "typedoc-plugin-markdown"

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
//   app.renderer.on(MarkdownPageEvent.END, (page) => {
//     console.log("page.begin", page)
//     page.contents = page.contents.replace(`**MetaFor**
//
// ***
// `, `---
// description:
// globs:
// alwaysApply: true
// ---
// `)
//   })
  app.renderer.markdownHooks.on(
    "index.page.begin",
    () => `---
description:
globs:
alwaysApply: true
---
`)
}