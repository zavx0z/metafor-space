/**
 * Данные одного мета элемента
 * 
 * Содержит всю информацию, необходимую для построения layout графа состояний:
 * состояния, условия переходов, сокеты для соединений и параметры.
 * 
 * Структура формируется актором node-layout на основе данных от дочерних 
 * компонентов (node-meta-state, node-meta-condition, node-meta-socket, node-meta-param).
 */
export interface Metrics {
  /** 
   * Состояния мета элемента
   * Ключ: ID состояния (например, "node-meta-state/1")
   * Значение: данные состояния с именем и размерами после рендеринга
   */
  states: Record<string, {
    /** Имя состояния (например, "начало", "конец") */
    state: string
    /** Ширина элемента состояния в пикселях */
    width?: number
    /** Высота элемента состояния в пикселях */
    height?: number
    /** Координата X состояния относительно контейнера */
    x?: number
    /** Координата Y состояния относительно контейнера */
    y?: number
  }>
  
  /** 
   * Условия переходов между состояниями
   * Ключ: ID условия (например, "node-meta-condition/1")
   * Значение: данные условия с направлением перехода и параметром
   */
  conditions: Record<string, {
    /** Исходное состояние перехода */
    from: string
    /** Параметр, по которому происходит переход */
    param: string
    /** Целевое состояние перехода */
    to: string
    /** Ширина элемента условия в пикселях */
    width?: number
    /** Высота элемента условия в пикселях */
    height?: number
  }>
  
  /** 
   * Сокеты (точки подключения) для соединений
   * Ключ: ID сокета (например, "node-meta-socket/1")
   * Значение: данные сокета с направлением и привязкой к родителю
   */
  sockets: Record<string, {
    /** Направление сокета: запад (вход) или восток (выход) */
    direction: "west" | "east"
    /** Родительский элемент: состояние или условие */
    parent: "state" | "condition"
    /** Состояние, к которому привязан сокет */
    state: string
    /** Параметр, который передается через сокет */
    param: string
    /** Размер сокета в пикселях */
    size?: number
    /** Абсолютная координата X сокета */
    x?: number
    /** Абсолютная координата Y сокета */
    y?: number
  }>
  
  /** 
   * Параметры состояний
   * Ключ: ID параметра (например, "node-meta-param/1")
   * Значение: данные параметра с привязкой к состоянию
   */
  params: Record<string, {
    /** Состояние, к которому относится параметр */
    state: string
    /** Имя параметра */
    param: string
    /** Ширина элемента параметра в пикселях */
    width?: number
    /** Высота элемента параметра в пикселях */
    height?: number
    /** Координата X параметра относительно состояния */
    x?: number
    /** Координата Y параметра относительно состояния */
    y?: number
  }>
}

/**
 * Карта всех мета данных, индексированная по ID мета элементов
 * 
 * Используется для хранения данных множества мета элементов в актора node-layout.
 * Ключ - уникальный идентификатор мета элемента (например, "test/1", "workflow/2"),
 * значение - полные данные мета элемента со всеми состояниями, условиями и сокетами.
 * 
 * @example
 * ```javascript
 * const metaMap = new Map([
 *   ["test/1", { states: {...}, conditions: {...}, sockets: {...}, params: {...} }],
 *   ["workflow/2", { states: {...}, conditions: {...}, sockets: {...}, params: {...} }]
 * ])
 * ```
 */
export type MetricsMap = Map<string, Metrics>



/**
 * Точка с координатами в двумерном пространстве
 * 
 * Базовая структура для представления координат элементов, портов,
 * точек изгиба рёбер и других позиционируемых объектов.
 * 
 * @example
 * ```typescript
 * const startPoint: Point = { x: 100, y: 50 }
 * const endPoint: Point = { x: 200, y: 150 }
 * ```
 */
export interface Point {
  /** Координата по горизонтали в пикселях */
  x: number
  /** Координата по вертикали в пикселях */
  y: number
}

/**
 * Интерфейс для конфигурации макета ELK
 *
 * Определяет все параметры алгоритма автоматического размещения элементов графа.
 * Каждая секция конфигурации применяется к соответствующему типу узлов в иерархии.
 * 
 * Иерархия применения:
 * - base: корневые настройки для всего графа
 * - meta: настройки для группирующих узлов состояний  
 * - state: настройки для узлов самих состояний
 * - condition: настройки для узлов условий переходов
 * - operator: настройки для операторов
 * - port: настройки для портов подключения
 *
 * @see https://www.eclipse.org/elk/reference.html - документация по параметрам ELK
 */
export interface LayoutConfig {
  /** 
   * Базовые настройки для корневого узла графа
   * Определяют общий алгоритм размещения и глобальные параметры
   */
  base: {
    /** Расстояние между ребрами в разных слоях (по умолчанию: "36") */
    "elk.layered.spacing.edgeEdgeBetweenLayers": string
    /** Минимальное расстояние между ребрами */
    "elk.spacing.edgeEdge"?: string
    /** Минимальное расстояние между ребром и узлом */
    "elk.spacing.edgeNode"?: string
    /** Способ обработки иерархии: "INCLUDE_CHILDREN" - включить дочерние элементы */
    "hierarchyHandling": string
    /** Стратегия разбиения на слои: "LONGEST_PATH_SOURCE" - от источника по длинному пути */
    "elk.layered.layering.strategy": string
    /** Отступы вокруг содержимого в формате "[top=20.0, left=20.0, bottom=20.0, right=20.0]" */
    "elk.padding": string
    /** Стратегия учета порядка модели: "PREFER_NODES" - предпочитать порядок узлов */
    "considerModelOrder.strategy": string
  }
  
  /** 
   * Настройки для группирующих узлов состояний (мета-узлы)
   * Определяют размещение состояний внутри группы
   */
  meta: {
    /** Алгоритм размещения: "box" - прямоугольная упаковка, "layered" - слоистый */
    // "elk.algorithm": string
    /** Направление размещения элементов: "RIGHT" - слева направо, "DOWN" - сверху вниз */
    // "elk.direction": string
    /** Расстояние между соседними узлами: "0" - плотное размещение */
    "elk.spacing.nodeNode": string
  }
  
  /** 
   * Настройки для узлов состояний
   * Определяют размещение элементов внутри состояния
   */
  state: {
    /** Расстояние между узлами состояния: "0" - плотная упаковка */
    "elk.spacing.nodeNode": string
    /** Отступы внутри состояния: без отступов для плотной упаковки */
    "elk.padding": string
    /** Ограничения портов: "FIXED_POS" - фиксированные позиции портов */
    "portConstraints": string
  }
  
  /** 
   * Настройки для узлов условий переходов
   * Определяют размещение элементов условий
   */
  condition: {
    /** Расстояние между узлами условий: "0" - плотная упаковка */
    "elk.spacing.nodeNode": string
    /** Отступы внутри условий: без отступов */
    "elk.padding": string
    /** Ограничения портов: "FIXED_SIDE" - порты привязаны к сторонам */
    "portConstraints": string
  }
  
  /** 
   * Настройки для операторов
   * Определяют размещение элементов операторов
   */
  operator: {
    /** Ограничения портов: "FIXED_SIDE" - порты привязаны к сторонам */
    "portConstraints": string
    /** Выравнивание западных портов: "JUSTIFIED" - равномерное распределение */
    "portAlignment.west": string
    /** Выравнивание западных портов: "JUSTIFIED" - равномерное распределение */
    "portAlignment.east": string
  }
  
  /** 
   * Настройки для портов подключения
   * Определяют расположение портов на сторонах узлов
   */
  port: {
    /** Настройки для западных (входных) портов */
    west: {
      /** Сторона размещения порта: "WEST" - западная сторона */
      "port.side": string
    }
    /** Настройки для восточных (выходных) портов */
    east: {
      /** Сторона размещения порта: "EAST" - восточная сторона */
      "port.side": string
    }
  }
}

/**
 * Базовый элемент layout с координатами и идентификатором
 * 
 * Представляет любой элемент в результате ELK layout: состояние, условие, сокет.
 * Содержит обязательный идентификатор и опциональные координаты после размещения.
 * 
 * @example
 * ```typescript
 * const layoutNode: LayoutNode = {
 *   id: "node-meta-state/1",
 *   x: 100,
 *   y: 50
 * }
 * ```
 */
export interface LayoutNode {
  /** Уникальный идентификатор элемента */
  id: string
  /** Координата X левого верхнего угла элемента в пикселях */
  x?: number
  /** Координата Y левого верхнего угла элемента в пикселях */
  y?: number
}

/**
 * Ребро графа с точками пути и типизацией соединения
 * 
 * Представляет связь между двумя портами в графе состояний.
 * Содержит информацию о пути ребра, включая точки изгиба,
 * а также тип соединения для различного отображения.
 * 
 * @example
 * ```typescript
 * const edge: Edge = {
 *   id: "socket/1->socket/2",
 *   points: [{ x: 100, y: 50 }, { x: 150, y: 75 }, { x: 200, y: 50 }],
 *   type: "east-input",
 *   sources: ["socket/1"],
 *   targets: ["socket/2"]
 * }
 * ```
 */
export interface Edge {
  /** Уникальный идентификатор ребра в формате "source->target" */
  id: string
  /** Массив точек, определяющих путь ребра от начала до конца */
  points: Point[]
  /** Тип ребра для визуального различия:
   * - "east-input": от восточного порта к входному порту
   * - "west": от западного порта  
   * - "other": прочие типы соединений */
  type: "east-input" | "west" | "other"
  /** Секции ребра с детальной информацией о пути (опционально) */
  sections?: EdgeSection[]
  /** Массив идентификаторов исходных портов */
  sources: string[]
  /** Массив идентификаторов целевых портов */
  targets: string[]
}

/**
 * Состояние в layout с дочерними элементами
 * 
 * Представляет группу состояния, содержащую сам узел состояния,
 * связанные с ним условия, операторы и их рёбра.
 * Результат обработки ELK для группы состояния.
 * 
 * @example
 * ```typescript
 * const layoutState: LayoutState = {
 *   id: "idle",
 *   x: 150,
 *   y: 100,
 *   children: [
 *     { id: "node-meta-state/1", x: 0, y: 0 },
 *     { id: "node-meta-condition/1", x: 50, y: 30 }
 *   ],
 *   edges: [
 *     { id: "edge1", sources: ["port1"], targets: ["port2"] }
 *   ]
 * }
 * ```
 */
export interface LayoutState extends LayoutNode {
  /** Дочерние элементы состояния: узел состояния, условия, операторы */
  children?: LayoutNode[]
  /** Рёбра внутри группы состояния */
  edges?: InputEdge[]
}

/**
 * Полный результат ELK layout для мета элемента
 * 
 * Содержит размещённые группы состояний и рёбра между ними.
 * Это главная структура, которая сохраняется в sessionStorage
 * и используется компонентами для получения своих координат.
 * 
 * @example
 * ```typescript
 * const layoutResult: LayoutResult = {
 *   id: "test/1", 
 *   children: [
 *     {
 *       id: "idle",
 *       x: 100, y: 50,
 *       children: [
 *         { id: "node-meta-state/1", x: 0, y: 0 },
 *         { id: "node-meta-condition/1", x: 80, y: 30 }
 *       ],
 *       edges: [...]
 *     },
 *     {
 *       id: "active", 
 *       x: 300, y: 50,
 *       children: [...],
 *       edges: [...]
 *     }
 *   ],
 *   edges: [
 *     { id: "state-edge", sources: [...], targets: [...] }
 *   ]
 * }
 * ```
 */
export interface LayoutResult extends LayoutNode {
  /** Ширина всего мета элемента в пикселях (вычисляется ELK) */
  width?: number
  /** Высота всего мета элемента в пикселях (вычисляется ELK) */
  height?: number
  /** Группы состояний с их размещением */
  children: LayoutState[]
  /** Рёбра между состояниями на верхнем уровне */
  edges?: InputEdge[]
}

/**
 * Секция ребра с детальной информацией о пути
 * 
 * Представляет отдельный сегмент ребра между двумя портами.
 * Содержит начальную и конечную точки, а также промежуточные
 * точки изгиба для создания криволинейного пути.
 * 
 * @example
 * ```typescript
 * const section: EdgeSection = {
 *   startPoint: { x: 100, y: 50 },
 *   endPoint: { x: 200, y: 100 },
 *   bendPoints: [
 *     { x: 130, y: 60 },
 *     { x: 170, y: 80 }
 *   ]
 * }
 * ```
 */
export interface EdgeSection {
  /** Начальная точка секции ребра */
  startPoint: Point
  /** Конечная точка секции ребра */
  endPoint: Point
  /** Промежуточные точки изгиба для создания кривой (опционально) */
  bendPoints?: Point[]
}

/**
 * Входное ребро с секциями и портами подключения
 * 
 * Представляет ребро в том виде, в котором оно поступает в ELK
 * или возвращается из ELK после обработки. Может содержать
 * несколько секций для сложных путей соединения.
 * 
 * @example
 * ```typescript
 * const inputEdge: InputEdge = {
 *   id: "node-meta-socket/1->node-meta-socket/3",
 *   sources: ["node-meta-socket/1"],
 *   targets: ["node-meta-socket/3"],
 *   sections: [
 *     {
 *       startPoint: { x: 192, y: 96 },
 *       endPoint: { x: -6, y: 96 },
 *       bendPoints: [{ x: 100, y: 120 }]
 *     }
 *   ]
 * }
 * ```
 */
export interface InputEdge {
  /** Уникальный идентификатор ребра в формате "source->target" */
  id: string
  /** Массив секций ребра с детальными путями (опционально) */
  sections?: EdgeSection[]
  /** Массив идентификаторов исходных портов */
  sources: string[]
  /** Массив идентификаторов целевых портов */
  targets: string[]
}



/**
 * Формирует структуру данных для ELK layout из meta данных
 * 
 * Функция преобразует структурированные данные мета элементов (состояния, условия, сокеты, параметры)
 * в формат, понятный библиотеке ELK для автоматического размещения элементов графа.
 * 
 * Создает иерархическую структуру:
 * - Корневой узел с ID мета элемента
 * - Дочерние узлы для каждого состояния
 * - Внутри каждого состояния: узел самого состояния + узлы условий/операторов
 * - Порты для подключения соединений
 * - Ребра между портами (внутри состояний и между состояниями)
 * 
 * @param metaId - Уникальный идентификатор мета элемента (например, "test/1")
 * @param metrics - Структурированные данные мета элемента, содержащие:
 *   - states: состояния с их размерами и позициями
 *   - conditions: условия переходов между состояниями  
 *   - sockets: точки подключения с направлением и привязкой
 *   - params: параметры состояний с их размерами
 * @param config - Конфигурация макета ELK с настройками для:
 *   - base: основные параметры алгоритма размещения
 *   - meta: настройки для мета узлов
 *   - state: настройки для узлов состояний
 *   - condition: настройки для узлов условий
 *   - operator: настройки для операторов
 *   - port: настройки портов (west/east)
 * 
 * @returns Структура ElkNode для передачи в ELK.layout()
 * После обработки ELK результат будет соответствовать типу LayoutResult
 * 
 * @example
 * ```javascript
 * const elkData = createElkData("meta/1", {
 *   states: { "state/1": { state: "idle", width: 100, height: 50 } },
 *   conditions: { "cond/1": { from: "idle", to: "active", param: "trigger" } },
 *   sockets: { "sock/1": { state: "idle", parent: "state", direction: "east" } },
 *   params: { "param/1": { state: "idle", param: "trigger" } }
 * }, layoutConfig)
 * 
 * const layoutResult: LayoutResult = await elk.layout(elkData) as LayoutResult
 * ```
 */
export declare function createElkData(
  metaId: string,
  metrics: Metrics,
  config: LayoutConfig
): import("elkjs").ElkNode

// ==================================================================================
// КОМПОЗИЦИОННЫЕ ФУНКЦИИ ДЛЯ ФОРМИРОВАНИЯ ELK СТРУКТУРЫ
// ==================================================================================

/**
 * ## Архитектура формирования ELK структуры
 * 
 * Процесс создания layout структуры разделен на логические этапы:
 * 
 * ### 1️⃣ **Базовые компоненты (атомарные функции)**
 * - `createStatePorts()` - порты для узлов состояний
 * - `createConditionPorts()` - порты для узлов условий  
 * - `createStateNode()` - узел состояния с портами
 * - `createConditionNodes()` - узлы условий для состояния
 * 
 * ### 2️⃣ **Соединения (связующие функции)**
 * - `createInternalEdges()` - ребра внутри состояния (условие → состояние)
 * - `createExternalEdges()` - ребра между состояниями (состояние → условие)
 * 
 * ### 3️⃣ **Группировка (композитные функции)**
 * - `createStateGroup()` - группа состояния со всеми дочерними элементами
 * - `createElkData()` - корневая ELK структура со всеми группами
 * 
 * ### 🎯 **Иерархия ELK структуры:**
 * ```
 * ElkNode (корневой)
 * ├── layoutOptions: config.base
 * ├── children: StateGroup[]
 * │   ├── layoutOptions: config.meta  
 * │   ├── children: [StateNode, ...ConditionNodes]
 * │   │   ├── StateNode
 * │   │   │   ├── layoutOptions: config.state
 * │   │   │   └── ports: StatePorts[]
 * │   │   └── ConditionNode
 * │   │       ├── layoutOptions: config.condition
 * │   │       └── ports: ConditionPorts[]
 * │   └── edges: InternalEdges[]
 * └── edges: ExternalEdges[]
 * ```
 * 
 * ### 🔄 **Поток данных:**
 * 1. **Metrics** → `createStatePorts/createConditionPorts` → **ElkPort[]**
 * 2. **ElkPort[]** → `createStateNode/createConditionNodes` → **ElkNode[]**
 * 3. **Metrics.sockets** → `createInternalEdges/createExternalEdges` → **ElkExtendedEdge[]**
 * 4. **ElkNode[] + ElkExtendedEdge[]** → `createStateGroup` → **StateGroup**
 * 5. **StateGroup[]** → `createElkData` → **ElkNode (root)**
 * 6. **ElkNode** → `ELK.layout()` → **LayoutResult**
 * 
 * ### 🧪 **Тестирование в ELK JSON Playground:**
 * Каждая функция возвращает валидную ELK структуру, которую можно:
 * - Тестировать независимо в https://rtsys.informatik.uni-kiel.de/elklive/
 * - Визуализировать для отладки layout логики
 * - Комбинировать для создания сложных графов
 */

/**
 * Создает порты для узла состояния
 * 
 * Формирует массив портов ELK для узла состояния на основе сокетов.
 * Порты располагаются относительно позиции состояния, координаты
 * пересчитываются в локальную систему координат узла.
 * 
 * **Особенности:**
 * - Фильтрует сокеты только для данного состояния и parent="state"
 * - Конвертирует абсолютные координаты в относительные
 * - Каждый сокет становится портом с размерами и позицией
 * 
 * @param sockets - Все сокеты из Metrics.sockets
 * @param stateName - Имя состояния для фильтрации сокетов
 * @param statePosition - Абсолютная позиция состояния {x, y}
 * @returns Массив портов ELK для узла состояния
 * 
 * @example
 * ```javascript
 * const ports = createStatePorts(
 *   {"socket/1": {state: "idle", parent: "state", x: 120, y: 80, size: 12}},
 *   "idle", 
 *   {x: 100, y: 50}
 * )
 * // Result: [{id: "socket/1", x: 20, y: 30, width: 12, height: 12}]
 * ```
 */
export declare function createStatePorts(
  sockets: Metrics["sockets"],
  stateName: string,
  statePosition: { x: number; y: number }
): import("elkjs").ElkPort[]

/**
 * Создает порты для узла условия
 * 
 * Формирует массив портов ELK для узла условия на основе сокетов.
 * Порты автоматически получают layoutOptions в зависимости от направления
 * (west/east) для правильного размещения ELK алгоритмом.
 * 
 * **Особенности:**
 * - Фильтрует сокеты только для данного состояния и parent="condition"
 * - Назначает layoutOptions.port.west/east в зависимости от direction
 * - Размеры берутся из socket.size
 * 
 * @param sockets - Все сокеты из Metrics.sockets
 * @param stateName - Имя состояния для фильтрации сокетов
 * @param config - Конфигурация layout с настройками портов
 * @returns Массив портов ELK для узла условия
 * 
 * @example
 * ```javascript
 * const ports = createConditionPorts(
 *   {"sock/1": {state: "idle", parent: "condition", direction: "west", size: 8}},
 *   "idle",
 *   {port: {west: {"port.side": "WEST"}, east: {"port.side": "EAST"}}}
 * )
 * // Result: [{id: "sock/1", layoutOptions: {"port.side": "WEST"}, width: 8, height: 8}]
 * ```
 */
export declare function createConditionPorts(
  sockets: Metrics["sockets"],
  stateName: string,
  config: LayoutConfig
): import("elkjs").ElkPort[]

/**
 * Создает узел состояния с портами
 * 
 * Формирует ELK узел для состояния, включающий все его порты.
 * Узел получает размеры из Metrics и порты через createStatePorts().
 * 
 * **Структура узла:**
 * - layoutOptions: config.state (настройки для узлов состояний)
 * - id: keyState (уникальный ID узла состояния)
 * - width/height: из valState (размеры после рендеринга)
 * - ports: результат createStatePorts() 
 * 
 * @param keyState - Уникальный ID узла состояния (например, "node-meta-state/1")
 * @param valState - Данные состояния из Metrics.states
 * @param sockets - Все сокеты для создания портов
 * @param config - Конфигурация layout
 * @returns ELK узел для состояния
 * 
 * @example
 * ```javascript
 * const stateNode = createStateNode(
 *   "node-meta-state/1",
 *   {state: "idle", width: 100, height: 50, x: 0, y: 0},
 *   sockets,
 *   config
 * )
 * // Result: ELK узел с портами и размерами
 * ```
 */
export declare function createStateNode(
  keyState: string,
  valState: Metrics["states"][string],
  sockets: Metrics["sockets"],
  config: LayoutConfig
): import("elkjs").ElkNode

/**
 * Создает узлы условий для состояния
 * 
 * Формирует массив ELK узлов для всех условий, связанных с данным состоянием.
 * Фильтрует условия по полю `to` (целевое состояние) и создает узел для каждого.
 * 
 * **Логика фильтрации:**
 * - Берутся только условия где `condition.to === stateName`
 * - Каждое условие становится отдельным ELK узлом
 * - Узлы получают порты через createConditionPorts()
 * 
 * @param conditions - Все условия из Metrics.conditions
 * @param stateName - Имя состояния для фильтрации условий
 * @param sockets - Все сокеты для создания портов условий
 * @param config - Конфигурация layout
 * @returns Массив ELK узлов для условий
 * 
 * @example
 * ```javascript
 * const conditionNodes = createConditionNodes(
 *   {"cond/1": {from: "start", to: "idle", param: "trigger", width: 80, height: 30}},
 *   "idle",
 *   sockets,
 *   config  
 * )
 * // Result: [ELK узел условия с портами]
 * ```
 */
export declare function createConditionNodes(
  conditions: Metrics["conditions"],
  stateName: string,
  sockets: Metrics["sockets"],
  config: LayoutConfig
): import("elkjs").ElkNode[]

/**
 * Создает внутренние ребра (условие → состояние)
 * 
 * Формирует ребра внутри группы состояния, соединяющие условия с состоянием.
 * Ребра создаются между выходными портами условий (direction="east") 
 * и входными портами состояния (direction="west") по совпадению параметра.
 * 
 * **Алгоритм соединения:**
 * 1. Найти все выходные сокеты условий (parent="condition", direction="east")
 * 2. Для каждого найти соответствующий входной сокет состояния
 * 3. Соединить их ребром если param совпадает
 * 
 * **Условия соединения:**
 * - socket.state === stateName (в рамках одного состояния)
 * - socketCond.parent === "condition" && socketCond.direction === "east"
 * - socketState.parent === "state" && socketState.direction === "west"  
 * - socketCond.param === socketState.param (совпадение параметра)
 * 
 * @param sockets - Все сокеты из Metrics.sockets
 * @param stateName - Имя состояния для фильтрации
 * @returns Массив внутренних ребер ELK
 * 
 * @example
 * ```javascript
 * const edges = createInternalEdges(sockets, "idle")
 * // Result: [{id: "condition-sock->state-sock", sources: [...], targets: [...]}]
 * ```
 */
export declare function createInternalEdges(
  sockets: Metrics["sockets"],
  stateName: string
): import("elkjs").ElkExtendedEdge[]

/**
 * Создает внешние ребра (состояние → условие другого состояния)
 * 
 * Формирует ребра между группами состояний на верхнем уровне графа.
 * Соединяет выходные порты состояний с входными портами условий других состояний.
 * 
 * **Алгоритм соединения:**
 * 1. Найти все выходные сокеты состояний (parent="state", direction="east")
 * 2. Для каждого найти соответствующий входной сокет условия
 * 3. Соединить их ребром если param совпадает и состояния разные
 * 
 * **Условия соединения:**
 * - socketState.parent === "state" && socketState.direction === "east"
 * - socketCond.parent === "condition" && socketCond.direction === "west"
 * - socketState.param === socketCond.param (совпадение параметра)
 * - socketState.state !== socketCond.state (разные состояния)
 * 
 * @param sockets - Все сокеты из Metrics.sockets
 * @returns Массив внешних ребер ELK
 * 
 * @example
 * ```javascript
 * const edges = createExternalEdges(sockets)
 * // Result: [{id: "state1-sock->state2-cond-sock", sources: [...], targets: [...]}]
 * ```
 */
export declare function createExternalEdges(
  sockets: Metrics["sockets"]
): import("elkjs").ElkExtendedEdge[]

/**
 * Создает группу состояния со всеми дочерними элементами
 * 
 * Формирует ELK узел группы, содержащий узел состояния, узлы условий
 * и внутренние ребра. Это ключевая композитная функция, объединяющая
 * все элементы одного состояния в единую ELK структуру.
 * 
 * **Состав группы:**
 * - layoutOptions: config.meta (настройки для группирующих узлов)
 * - id: valState.state (имя состояния, например "idle")
 * - children: [StateNode, ...ConditionNodes] (узел состояния + узлы условий)
 * - edges: InternalEdges[] (соединения внутри группы)
 * 
 * **Порядок формирования:**
 * 1. Создать узел состояния через createStateNode()
 * 2. Создать узлы условий через createConditionNodes()
 * 3. Создать внутренние ребра через createInternalEdges()
 * 4. Объединить все в группу с настройками config.meta
 * 
 * @param keyState - ID узла состояния (например, "node-meta-state/1")
 * @param valState - Данные состояния из Metrics.states
 * @param metrics - Полные мета данные для создания дочерних элементов
 * @param config - Конфигурация layout
 * @returns ELK узел группы состояния
 * 
 * @example
 * ```javascript
 * const stateGroup = createStateGroup(
 *   "node-meta-state/1",
 *   {state: "idle", width: 100, height: 50},
 *   metrics,
 *   config
 * )
 * // Result: ELK группа с состоянием, условиями и рёбрами
 * ```
 */
export declare function createStateGroup(
  keyState: string,
  valState: Metrics["states"][string],
  metrics: Metrics,
  config: LayoutConfig
): import("elkjs").ElkNode