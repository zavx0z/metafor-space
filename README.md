# MetaFor Framework

MetaFor — это фреймворк для управления состояниями в виде конечных автоматов, где **Контекст** служит единственным источником истины, а все переходы между состояниями происходят автоматически по триггерам.

## Основные компоненты

1. **Частица (Particle)** — основная единица в MetaFor
   - Имеет уникальный идентификатор, состояние, контекст, действия, переходы, ядро, реакции и представление

2. **Состояния (States)** — определяют возможные состояния частицы
   - Каждая частица должна находиться в одном из предопределенных состояний

3. **Контекст (Context)** — содержит данные, связанные с частицей
   - Определяется с помощью типизированного объекта и типов данных

4. **Переходы (Transitions)** — правила перехода между состояниями
   - Каждый переход содержит исходное состояние, возможные целевые состояния с триггерами,
     и опционально действие, которое будет выполнено при входе в новое состояние

5. **Действия (Actions)** — функции, выполняемые при входе в определенное состояние
   - Могут изменять контекст и вызывать переходы между состояниями

6. **Ядро (Core)** — предоставляет доступ к сервисам и ресурсам
   - Сюда включаются API-запросы, таймеры, локальное хранилище и т.д.

7. **Реакции (Reactions)** — позволяют частицам реагировать на изменения в других частицах
   - Определяют взаимодействие между различными частицами

8. **Представление (View)** — определяет визуальный компонент, связанный с частицей
   - Автоматически обновляется при изменении состояния или контекста частицы

## Начало работы

### Установка

```bash
npm install @metafor/lib
```

или

```bash
bun add @metafor/lib
```

### Простой пример

```js
const todoParticle = MetaFor("todo-list")
  .states("IDLE", "LOADING", "SUCCESS", "ERROR")
  .context((t) => ({
    items: t.array({ default: [] }),
    isLoading: t.boolean({ default: false }),
    error: t.string({ default: null }),
  }))
  .transitions([
    {
      from: "IDLE",
      action: "fetchItems",
      to: [
        { state: "LOADING", trigger: { isLoading: true } },
      ],
    },
    {
      from: "LOADING",
      to: [
        { state: "SUCCESS", trigger: { items: { length: { gt: 0 } } } },
        { state: "ERROR", trigger: { error: { isNull: false } } },
      ],
    },
  ])
  .actions({
    fetchItems: ({ update, core }) => {
      update({ isLoading: true });
      
      core.api.getItems()
        .then(items => update({ items, isLoading: false }))
        .catch(err => update({ error: err.message, isLoading: false }));
    }
  })
  .create({
    state: "IDLE", // Начальное состояние
    context: {
      // Начальный контекст (опционально)
      items: [],
    },
  });

// Запустить загрузку
todoParticle.update({ trigger: "load" });
```

## Документация

Полная документация доступна в разделе API Reference этого сайта.

## Лицензия

MIT
