# 📊 Graph Module

Модуль для визуализации и управления графами состояний акторов MetaFor.

## 🎯 Описание

Модуль `graph` предоставляет полный набор акторов для создания интерактивных графических представлений автоматов состояний. Включает автоматическую компоновку, визуализацию состояний, переходов, условий и параметров.

## 📁 Структура модуля

```
graph/
├── graph-meta.js              # Основной мета-узел графа
├── graph-meta.actions.js      # Действия мета-узла
├── graph-meta.t.ts           # Типы мета-узла
├── graph-meta.layout.json    # Конфигурация компоновки
├── graph-layout.js            # Движок автоматической компоновки
├── graph-layout.actions.js    # Алгоритмы ELK компоновки
├── graph-layout.spec.ts       # Тесты компоновки
├── graph-layout.t.ts         # Типы компоновки
├── graph-layout.fixture.ts   # Тестовые данные
├── graph-nodes.js            # Система управления узлами
├── graph-state.js            # Компонент состояния узла
├── graph-state.spec.ts       # Тесты состояния
├── graph-state.t.ts         # Типы состояния
├── graph-context.js          # Компонент контекста
├── graph-context.t.ts       # Типы контекста
├── graph-param.js            # Компонент параметра
├── graph-param.html         # HTML шаблон параметра
├── graph-param.t.ts         # Типы параметра
├── graph-socket.js           # Компонент сокета подключения
├── graph-socket.t.ts        # Типы сокета
├── graph-condition.js        # Компонент условия перехода
├── graph-condition.html     # HTML шаблон условия
├── graph-condition.spec.ts  # Тесты условий
├── graph-condition.t.ts     # Типы условий
├── graph-operator.js         # Компонент оператора сравнения
├── graph-operator.html      # HTML шаблон оператора
├── graph-operator.t.ts      # Типы операторов
├── lib/                     # Библиотеки
│   ├── elk-api.js          # API интерфейс ELK
│   └── elk-worker.js       # Web Worker для ELK
├── __snapshots__/           # Тестовые снапшоты
│   ├── graph-state.spec.ts.snap
│   └── graph-layout.spec.ts.snap
├── index.html               # Демо страница
├── index.css               # Стили модуля
├── index.js                # Тестовый актор модуля
└── README.md               # Документация модуля
```

## 🚀 Основные акторы

### 1. `graph-meta`
Основной мета-узел графа. Отображает информацию об одном акторе с его состояниями и переходами.

**Контекст:**
- `id` - ID мета элемента
- `width`, `height` - размеры узла
- `error` - сообщения об ошибках

### 2. `graph-layout` 
Движок автоматической компоновки графов на основе ELK (Eclipse Layout Kernel).

**Возможности:**
- Автоматическое размещение узлов
- Построение связей между состояниями  
- Оптимизация расположения элементов
- Поддержка различных алгоритмов компоновки

### 3. `graph-nodes`
Система управления всеми узлами графа. Создает и координирует отображение мета-узлов.

**Функции:**
- Отслеживание создания новых акторов
- Автоматическое создание визуализации
- Управление жизненным циклом узлов

## 🔧 Компоненты узлов

### `graph-state`
Отображение отдельного состояния актора с возможностью позиционирования и анимации переходов.

**Состояния:** `рендер`, `изменение размера`, `перемещение`

### `graph-context` 
Контейнер для параметров состояния с заголовком и слотами.

### `graph-param`
Параметр состояния с входными и выходными сокетами.

### `graph-socket`
Точка подключения для связей между узлами.

### `graph-condition`
Условие перехода между состояниями с поддержкой сложных логических выражений.

### `graph-operator`
Оператор сравнения в условиях с богатым набором операций:

**Числовые операторы:**
- `eq` (⊜) - Равно
- `notEq` (≠) - Не равно  
- `gt` (⊐) - Больше
- `gte` (⊒) - Больше или равно
- `lt` (⊏) - Меньше
- `lte` (⊑) - Меньше или равно
- `between` (⋈) - Между значениями

**Строковые операторы:**
- `startsWith` (⊰) - Начинается с
- `endsWith` (⊱) - Заканчивается на
- `include` (⊆) - Содержит
- `pattern` (⋊) - Регулярное выражение

**Операторы массивов:**
- `includes` (⊂) - Содержит элемент
- `length` (⊢) - Длина массива
- `every` (⋀) - Все элементы
- `some` (⋁) - Хотя бы один

**Операторы null:**
- `isNull` (∅) - Проверка на null
- `notNull` (¬∅) - Проверка на не null

## 💻 Использование

### Импорт модуля

```javascript
// Импорт всех компонентов модуля
import "./graph/graph-meta.js"
import "./graph/graph-layout.js"
import "./graph/graph-nodes.js"
import "./graph/graph-state.js"
import "./graph/graph-context.js"
import "./graph/graph-param.js"
import "./graph/graph-socket.js"
import "./graph/graph-condition.js"
import "./graph/graph-operator.js"
```

### HTML использование

```html
<!-- Основной контейнер графа -->
<metafor-graph-nodes>
  <!-- Мета-узлы создаются автоматически -->
  <metafor-graph-meta context='{"id": "counter/1"}'>
    <!-- Состояния -->
    <metafor-graph-state context='{"state": "idle"}'>
      <!-- Контекст состояния -->
      <metafor-graph-context>
        <!-- Параметры -->
        <metafor-graph-param context='{"name": "value", "type": "number"}'>
          <metafor-graph-socket></metafor-graph-socket>
        </metafor-graph-param>
      </metafor-graph-context>
    </metafor-graph-state>
    
    <!-- Условия переходов -->
    <metafor-graph-condition>
      <metafor-graph-operator context='{"op": "gt", "value": "10"}'></metafor-graph-operator>
    </metafor-graph-condition>
  </metafor-graph-meta>
</metafor-graph-nodes>

<!-- Автоматическая компоновка -->
<metafor-graph-layout></metafor-graph-layout>
```

## ⚙️ Конфигурация ELK

Алгоритмы компоновки настраиваются через `graph-meta.layout.json`:

```json
{
  "base": {
    "elk.layered.spacing.edgeEdgeBetweenLayers": "36",
    "elk.spacing.edgeEdge": "36", 
    "hierarchyHandling": "INCLUDE_CHILDREN",
    "elk.layered.layering.strategy": "LONGEST_PATH_SOURCE"
  },
  "meta": {
    "elk.spacing.nodeNode": "0",
    "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX"
  }
}
```

## 🧪 Тестирование

Запуск тестов модуля:
```bash
# Все тесты модуля
bun test graph/

# Конкретный компонент  
bun test graph/graph-layout.spec.ts
bun test graph/graph-state.spec.ts
bun test graph/graph-condition.spec.ts

# С наблюдением за изменениями
bun test graph/ --watch
```

## 🎨 Стилизация

Модуль использует CSS кастомные свойства из `index.css`:

```css
:root {
  --surface-50: 255, 255, 255;
  --surface-600: 75, 85, 99;
  --primary-500: 59, 130, 246;
  --primary-900: 30, 58, 138;
  --secondary-500: 16, 185, 129;
  --background-alpha: 0.9;
  --node-border-radius: 8px;
}
```

## 🔄 Демократическое взаимодействие

Все акторы модуля равноправны и могут взаимодействовать друг с другом:

- `graph-nodes` отслеживает создание новых акторов
- `graph-layout` вычисляет оптимальное размещение
- `graph-state` реагирует на изменения layout и позиционирует элементы
- `graph-operator` предоставляет богатый набор операций сравнения
- Любой актор может влиять на визуализацию графа

## 📊 Типы данных

Модуль экспортирует TypeScript типы для всех структур данных:

```typescript
import type { 
  Metrics, 
  LayoutConfig, 
  LayoutResult,
  TypedLayoutResult
} from './graph-layout.t'

import type { 
  GraphMetaContext
} from './graph-meta.t'

import type {
  GraphStateContext
} from './graph-state.t'

import type {
  GraphConditionContext
} from './graph-condition.t'

import type {
  GraphOperatorContext,
  OperatorType
} from './graph-operator.t'
```

## 🌟 Особенности

- **Автоматическая компоновка** - ELK алгоритмы для оптимального размещения
- **Реактивность** - мгновенная синхронизация изменений через SessionStorage
- **Типизация** - полная поддержка TypeScript с подробными типами
- **Модульность** - независимые переиспользуемые компоненты
- **Демократичность** - равноправное взаимодействие акторов
- **Тестируемость** - комплексное покрытие тестами со снапшотами
- **HTML шаблоны** - отдельные HTML файлы для сложных компонентов
- **Web Workers** - вычисления компоновки в фоновом режиме
- **Богатые операторы** - 25+ операторов сравнения с символьной нотацией

## 🚀 Производительность

- **Web Worker для ELK** - компоновка графа не блокирует UI
- **SessionStorage** - быстрая передача данных между акторами  
- **Снапшот тестирование** - валидация результатов компоновки
- **Оптимизированные DOM обновления** - минимальные перерисовки 