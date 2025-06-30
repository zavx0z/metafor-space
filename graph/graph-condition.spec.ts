import { test, describe, expect } from "bun:test"
import "./node-meta-condition.js"

describe("node-meta-condition", () => {
  const setupElement = () => {
    document.body.innerHTML = '<metafor-graph-condition></metafor-graph-condition>'
    return document.querySelector('metafor-graph-condition') as any
  }
  
  test("снапшот компонента", () => {
    const element = setupElement()
    const snapshot = element.snapshot()
    
    expect(snapshot).toMatchSnapshot()
  })

  test("состояние и контекст компонента", () => {
    const element = setupElement()
    const snapshot = element.snapshot()
    
    // Состояние может быть "рендер" или "измерение" в зависимости от времени
    expect(["рендер", "измерение", "позиционирование"]).toContain(snapshot.state)
    expect(snapshot.context.error).toBeNull()
    expect(snapshot.context.width).toBeNull()
    expect(snapshot.context.height).toBeNull()
    expect(snapshot.context.x).toBeNull()
    expect(snapshot.context.y).toBeNull()
  })

  test("переходы между состояниями", () => {
    const element = setupElement()
    const snapshot = element.snapshot()
    
    expect(snapshot.transitions).toMatchSnapshot()
  })

  test("контекст компонента", () => {
    const element = setupElement()
    const snapshot = element.snapshot()
    
    expect(snapshot.types).toMatchSnapshot()
    expect(snapshot.context).toMatchSnapshot()
  })

  test("состояния компонента", () => {
    const element = setupElement()
    const snapshot = element.snapshot()
    
    expect(snapshot.states).toEqual(["рендер", "измерение", "позиционирование"])
  })

  test("проверка типов контекста", () => {
    const element = setupElement()
    const snapshot = element.snapshot()
    
    expect(snapshot.types.id).toBeDefined()
    expect(snapshot.types.from).toBeDefined()
    expect(snapshot.types.to).toBeDefined()
    expect(snapshot.types.param).toBeDefined()
    expect(snapshot.types.error).toBeDefined()
    expect(snapshot.types.width).toBeDefined()
    expect(snapshot.types.height).toBeDefined()
    expect(snapshot.types.x).toBeDefined()
    expect(snapshot.types.y).toBeDefined()
  })

  test("переходы содержат правильные состояния", () => {
    const element = setupElement()
    const snapshot = element.snapshot()
    
    const renderTransition = snapshot.transitions.find((t: any) => t.in === "рендер")
    const measureTransition = snapshot.transitions.find((t: any) => t.in === "измерение")
    const positionTransition = snapshot.transitions.find((t: any) => t.in === "позиционирование")
    
    expect(renderTransition).toBeDefined()
    expect(measureTransition).toBeDefined()
    expect(positionTransition).toBeDefined()
    
    expect(renderTransition?.to[0]?.state).toBe("измерение")
    expect(measureTransition?.to[0]?.state).toBe("позиционирование")
    expect(positionTransition?.to).toEqual([])
  })

  test("создание элемента в DOM", () => {
    const element = setupElement()
    
    expect(element).toBeDefined()
    expect(element.tagName.toLowerCase()).toBe('metafor-node-meta-condition')
  })

  test("базовая функциональность элемента", () => {
    const element = setupElement()
    
    // Проверяем, что элемент имеет метод snapshot
    expect(typeof element.snapshot).toBe("function")
    
    // Проверяем, что можно получить snapshot
    const snapshot = element.snapshot()
    expect(snapshot).toBeDefined()
    expect(snapshot.context).toBeDefined()
  })
}) 