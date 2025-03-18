// @ts-nocheck
import {afterAll, beforeAll, describe, expect, test} from "bun:test"
import {createGraphFixture} from "@metafor/fixtures/graph.fixture.ts"

const fixture = createGraphFixture({
  headless: false,
  devtools: true,
  width: 1024 * 2,
  height: 768 * 2,
  port: 4432
})

beforeAll(async () => {
  await fixture.setup()
})

afterAll(async () => {
  await fixture.teardown()
})

describe("Граф частицы", () => {
  test("Должен добавить WebComponent при включенной опции graph", async () => {
    const result = await fixture.page.evaluate(async () => {
      const particle = window
        .MetaFor("test-particle")
        .states("IDLE", "ACTIVE")
        .context({
          value: window.t.number({title: "Значение для тестирования переходов", nullable: false})
        })
        .collapses([
          {from: "IDLE", to: [{state: "ACTIVE", trigger: {value: {gt: 0}}}]}
        ])
        .core()
        .actions({})
        .reactions([]).create({
          state: "IDLE",
          graph: true
        })
      const component = await particle.graph()
      return component.id
    })
    expect(result).toEqual("/test-particle")
  })
})