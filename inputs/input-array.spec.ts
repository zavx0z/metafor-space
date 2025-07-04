import {describe, expect, test} from "bun:test"
import {MetaFor} from "../metafor.js"

describe("input-array типизация", () => {
  test("правильная типизация строкового массива", () => {
    const actor = MetaFor("test-array-string")
      .context(t => ({
        items: t.array({default: ["hello", "world"]}),
      }))
      .core(() => ({}))
      .states("idle")
      .transitions("idle", [])
      .reactions([])
      .view({})

    // Создаем экземпляр для проверки типов
    document.body.innerHTML = '<metafor-test-array-string></metafor-test-array-string>'
    const element = document.querySelector('metafor-test-array-string') as any
    
    expect(element).toBeDefined()
    expect(element?.context.items).toEqual(["hello", "world"])
    
    // Проверяем, что можно добавлять строки
    element?.update({items: [...element.context.items, "test"]})
    expect(element?.context.items).toEqual(["hello", "world", "test"])
  })

  test("правильная типизация числового массива", () => {
    const actor = MetaFor("test-array-number")
      .context(t => ({
        numbers: t.array({default: [1, 2, 3]}),
      }))
      .core(() => ({}))
      .states("idle")
      .transitions("idle", [])
      .reactions([])
      .view({})

    document.body.innerHTML = '<metafor-test-array-number></metafor-test-array-number>'
    const element = document.querySelector('metafor-test-array-number') as any
    
    expect(element).toBeDefined()
    expect(element?.context.numbers).toEqual([1, 2, 3])
    
    // Проверяем, что можно добавлять числа
    element?.update({numbers: [...element.context.numbers, 42]})
    expect(element?.context.numbers).toEqual([1, 2, 3, 42])
  })

  test("пустой массив по умолчанию строки", () => {
    const actor = MetaFor("test-array-empty")
      .context(t => ({
        empty: t.array({default: []}),
      }))
      .core(() => ({}))
      .states("idle")
      .transitions("idle", [])
      .reactions([])
      .view({})

    document.body.innerHTML = '<metafor-test-array-empty></metafor-test-array-empty>'
    const element = document.querySelector('metafor-test-array-empty') as any
    
    expect(element).toBeDefined()
    expect(element?.context.empty).toEqual([])
    
    // Проверяем, что можно добавлять элементы
    element?.update({empty: ["first"]})
    expect(element?.context.empty).toEqual(["first"])
  })
}) 