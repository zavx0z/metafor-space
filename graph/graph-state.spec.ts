import { test, describe, expect } from "bun:test"
import { config, data } from "./graph-layout.fixture"
import ELK from "elkjs"
import {
  createStatePorts,
  createConditionPorts,
  createStateNode,
  createConditionNodes,
  createInternalEdges,
  createStateGroup
} from "./graph-layout.actions.js"

describe("Тестирование формирования layout для одного состояния", () => {
  const metaName = "test/1"
  const dataMeta = data.get(metaName)!
  const keyState = "node-meta-state/1"
  const valState = dataMeta.states[keyState]

  test("createStatePorts - создание портов для состояния", () => {
    const statePorts = createStatePorts(dataMeta.sockets, valState.state, {x: valState.x || 0, y: valState.y || 0})
    
    expect(statePorts).toBeDefined()
    expect(Array.isArray(statePorts)).toBe(true)
    
    // Проверяем, что порты имеют корректную структуру
    statePorts.forEach(port => {
      expect(port).toHaveProperty('id')
      expect(port).toHaveProperty('x')
      expect(port).toHaveProperty('y')
      expect(port).toHaveProperty('width')
      expect(port).toHaveProperty('height')
      expect(typeof port.x).toBe('number')
      expect(typeof port.y).toBe('number')
    })
    

  })

  test("createConditionPorts - создание портов для условий", () => {
    const conditionPorts = createConditionPorts(dataMeta.sockets, valState.state, config)
    
    expect(conditionPorts).toBeDefined()
    expect(Array.isArray(conditionPorts)).toBe(true)
    
    // Проверяем структуру портов условий
    conditionPorts.forEach(port => {
      expect(port).toHaveProperty('id')
      expect(port).toHaveProperty('layoutOptions')
      expect(port).toHaveProperty('width')
      expect(port).toHaveProperty('height')
    })
    

  })

  test("createStateNode - создание узла состояния", () => {
    const stateNode = createStateNode(keyState, valState, dataMeta.sockets, config)
    
    expect(stateNode).toBeDefined()
    expect(stateNode).toHaveProperty('id', keyState)
    expect(stateNode).toHaveProperty('width', valState.width)
    expect(stateNode).toHaveProperty('height', valState.height)
    expect(stateNode).toHaveProperty('layoutOptions')
    expect(stateNode).toHaveProperty('ports')
    expect(Array.isArray(stateNode.ports)).toBe(true)
    

  })

  test("createConditionNodes - создание узлов условий", () => {
    const conditionNodes = createConditionNodes(dataMeta.conditions, valState.state, dataMeta.sockets, config)
    
    expect(conditionNodes).toBeDefined()
    expect(Array.isArray(conditionNodes)).toBe(true)
    
    // Проверяем структуру узлов условий
    conditionNodes.forEach(node => {
      expect(node).toHaveProperty('id')
      expect(node).toHaveProperty('width')
      expect(node).toHaveProperty('height')
      expect(node).toHaveProperty('layoutOptions')
      expect(node).toHaveProperty('ports')
    })
    

  })

  test("createInternalEdges - создание внутренних рёбер", () => {
    const internalEdges = createInternalEdges(dataMeta.sockets, valState.state)
    
    expect(internalEdges).toBeDefined()
    expect(Array.isArray(internalEdges)).toBe(true)
    
    // Проверяем структуру рёбер
    internalEdges.forEach(edge => {
      expect(edge).toHaveProperty('id')
      expect(edge).toHaveProperty('sources')
      expect(edge).toHaveProperty('targets')
      expect(Array.isArray(edge.sources)).toBe(true)
      expect(Array.isArray(edge.targets)).toBe(true)
    })
    

  })

  test("createStateGroup - создание полной группы одного состояния", () => {
    const stateGroup = createStateGroup(keyState, valState, dataMeta, config)
    
    expect(stateGroup).toBeDefined()
    expect(stateGroup).toHaveProperty('id', valState.state)
    expect(stateGroup).toHaveProperty('layoutOptions')
    expect(stateGroup).toHaveProperty('children')
    expect(stateGroup).toHaveProperty('edges')
    expect(Array.isArray(stateGroup.children)).toBe(true)
    expect(Array.isArray(stateGroup.edges)).toBe(true)
    
    // Проверяем, что дети включают узел состояния и узлы условий
    expect(stateGroup.children).toBeDefined()
    expect(stateGroup.children!.length).toBeGreaterThan(0)
    
    // Первый ребенок должен быть узлом состояния
    const stateNode = stateGroup.children![0]
    expect(stateNode.id).toBe(keyState)
    expect(stateNode.width).toBe(valState.width)
    expect(stateNode.height).toBe(valState.height)
    
    // Проверяем наличие портов у состояния
    expect(stateNode.ports).toBeDefined()
    expect(Array.isArray(stateNode.ports)).toBe(true)
    
    // Снепшот полной структуры группы состояния для ELK
    expect(stateGroup).toMatchSnapshot()
  })

  test("ELK layout для сформированного состояния", async () => {
    // Создаем полную структуру состояния для ELK
    const stateGroup = createStateGroup(keyState, valState, dataMeta, config)
    
    // Оборачиваем в контейнер для ELK layout
    const elkContainer = {
      id: `layout-${valState.state}`,
      layoutOptions: config.base,
      children: [stateGroup]
    }
    expect(elkContainer).toMatchSnapshot()
    const elk = new ELK()
    const layout = await elk.layout(elkContainer)
    
    // Проверяем, что layout был выполнен
    expect(layout).toBeDefined()
    expect(layout.children).toBeDefined()
    expect(layout.children!.length).toBe(1)
    
    const layoutedStateGroup = layout.children![0]
    expect(layoutedStateGroup.id).toBe(valState.state)
    expect(layoutedStateGroup.x).toBeDefined()
    expect(layoutedStateGroup.y).toBeDefined()
    expect(layoutedStateGroup.width).toBeDefined()
    expect(layoutedStateGroup.height).toBeDefined()
    
    // Снепшот результата ELK layout
    expect(layout).toMatchSnapshot()
  })

  test("сохранение layout одного состояния в sessionStorage", () => {
    // Создаем layout только для одного состояния
    const stateGroup = createStateGroup(keyState, valState, dataMeta, config)
    
    // Сохраняем в sessionStorage только данные одного состояния
    const stateLayoutData = {
      stateId: valState.state,
      stateKey: keyState,
      stateGroup: stateGroup,
      metrics: {
        states: {[keyState]: valState},
        conditions: Object.fromEntries(
          Object.entries(dataMeta.conditions).filter(([_, condition]) => condition.to === valState.state)
        ),
        sockets: Object.fromEntries(
          Object.entries(dataMeta.sockets).filter(([_, socket]) => socket.state === valState.state)
        )
      },
      config: config
    }
    
    sessionStorage.setItem(`state-layout-${valState.state}`, JSON.stringify(stateLayoutData))
    
    // Проверяем, что данные корректно сохранены
    const savedStateLayout = JSON.parse(sessionStorage.getItem(`state-layout-${valState.state}`) || '{}')
    
    expect(savedStateLayout.stateId).toBe(valState.state)
    expect(savedStateLayout.stateKey).toBe(keyState)
    expect(savedStateLayout.stateGroup).toBeDefined()
    expect(savedStateLayout.stateGroup.id).toBe(valState.state)
    expect(savedStateLayout.metrics).toBeDefined()
    expect(savedStateLayout.config).toBeDefined()
    
    // Проверяем, что можем воссоздать состояние из сохраненных данных
    const recreatedStateGroup = createStateGroup(
      savedStateLayout.stateKey, 
      savedStateLayout.metrics.states[savedStateLayout.stateKey], 
      savedStateLayout.metrics, 
      savedStateLayout.config
    )
    
    expect(recreatedStateGroup).toBeDefined()
    expect(recreatedStateGroup.id).toBe(savedStateLayout.stateId)
    
    // Очищаем sessionStorage
    sessionStorage.removeItem(`state-layout-${valState.state}`)
  })
})
