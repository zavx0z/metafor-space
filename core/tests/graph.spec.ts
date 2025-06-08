// import {afterAll, beforeAll, describe, expect, test} from "bun:test"
// import {createBrowserFixture} from "../../fixtures/browser"
//
// const fixture = createBrowserFixture({
//   headless: false,
//   devtools: true,
//   width: 1024 * 2,
//   height: 768 * 2,
//   port: 4432
// })
//
// beforeAll(async () => {
//   await fixture.setup()
// })
//
// afterAll(async () => {
//   await fixture.teardown()
// })
//
// describe("Граф частицы", () => {
//   test("Должен добавить WebComponent при включенной опции graph", async () => {
//     const result = await fixture.page.evaluate(async () => {
//       const meta = window
//         .MetaFor("test-meta")
//         .states("IDLE", "ACTIVE")
//         .context((t) => ({
//           value: t.number({title: "Значение для тестирования переходов", nullable: false})
//         }))
//         .transitions([
//           {from: "IDLE", to: [{state: "ACTIVE", when: {value: {gt: 0}}}]}
//         ])
//         .core()
//         .actions({})
//         .reactions([]).create({
//           state: "IDLE",
//           graph: true
//         })
//       const component = await meta.graph()
//       return component.id
//     })
//     expect(result).toEqual("/test-meta")
//   })
// })