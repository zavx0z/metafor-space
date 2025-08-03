---
trigger: manual
description:
globs:
---

# Дизайн-гид Apple Vision Pro для MetaFor

## Обязательное использование цветов темы

Все компоненты MetaFor должны использовать **только** цвета из `theme/theme.css`. Никаких хардкодных цветов!

### Основная палитра

```css
/* Используйте ТОЛЬКО эти цвета */
--primary-*     /* Небесно-голубой (#87ceeb) - основной акцент */
--secondary-*   /* Зеленый (#47bd74) - успех, подтверждения */
--tertiary-*    /* Серый (#BFC8D1) - нейтральные элементы */
--surface-*     /* Темно-синий (#384d6b) - фоны, контейнеры */
--success-*     /* Салатовый (#9ED99D) - валидация, статус OK */
--warning-*     /* Золотой (#FFD175) - предупреждения */
--error-*       /* Коралловый (#FF8D8D) - ошибки, опасность */
```

## Принципы Vision Pro дизайна

### 1. Glassmorphism - основа всех элементов

```css
.my-component {
  /* Обязательно используйте .backdrop класс */
  @extend .backdrop;

  /* Или самостоятельно */
  backdrop-filter: var(--backdrop-filter-blur);
  background: rgba(var(--surface-800) / var(--background-alpha));
  border: 1px solid rgba(var(--surface-400) / 0.3);
  border-radius: 12px;
}
```

### 2. Многослойность и глубина

```css
.elevated-component {
  /* Базовый стеклянный слой */
  background: rgba(var(--surface-800) / 0.6);
  backdrop-filter: blur(22px);

  /* Тень для пространственности */
  box-shadow: 0 8px 32px rgba(var(--surface-900) / 0.4), 0 2px 8px rgba(var(--surface-900) / 0.2);

  /* Граница-ореол */
  border: 1px solid rgba(var(--surface-400) / 0.3);
}

/* Поднятые элементы (при hover, active) */
.elevated-component:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(var(--surface-900) / 0.5), 0 4px 16px rgba(var(--surface-900) / 0.3);
  border-color: rgba(var(--primary-400) / 0.5);
}
```

### 3. Цветовая система для разных состояний

```css
/* Нейтральное состояние */
.default-state {
  background: rgba(var(--surface-700) / 0.6);
  border-color: rgba(var(--surface-400) / 0.3);
}

/* Активное/фокус */
.active-state {
  background: rgba(var(--primary-800) / 0.4);
  border-color: rgba(var(--primary-400) / 0.6);
  box-shadow: 0 0 20px rgba(var(--primary-500) / 0.3);
}

/* Успех/подключено */
.success-state {
  background: rgba(var(--success-800) / 0.4);
  border-color: rgba(var(--success-400) / 0.6);
  box-shadow: 0 0 16px rgba(var(--success-500) / 0.25);
}

/* Ошибка/недоступно */
.error-state {
  background: rgba(var(--error-800) / 0.4);
  border-color: rgba(var(--error-400) / 0.6);
  box-shadow: 0 0 16px rgba(var(--error-500) / 0.25);
}

/* Предупреждение */
.warning-state {
  background: rgba(var(--warning-800) / 0.4);
  border-color: rgba(var(--warning-400) / 0.6);
  box-shadow: 0 0 16px rgba(var(--warning-500) / 0.25);
}
```

### 4. Интерактивность и микроанимации

```css
.interactive-element {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Покой */
  transform: scale(1);
  filter: brightness(1);

  /* Наведение */
  &:hover {
    transform: scale(1.05) translateY(-1px);
    filter: brightness(1.1);
    box-shadow: 0 8px 32px rgba(var(--primary-500) / 0.2);
  }

  /* Нажатие */
  &:active {
    transform: scale(0.98) translateY(0px);
    filter: brightness(0.95);
    transition: all 0.1s ease;
  }

  /* Фокус (клавиатура) */
  &:focus-visible {
    outline: 2px solid rgba(var(--primary-400) / 0.8);
    outline-offset: 3px;
  }
}
```

### 5. Типографика с Vision Pro эстетикой

```css
.visionpro-text {
  /* Используйте переменные темы */
  color: var(--font-color);
  text-shadow: 0 1px 2px rgba(var(--surface-900) / 0.5);

  /* Заголовки */
  &.heading {
    font-weight: 600;
    letter-spacing: -0.02em;
    color: rgba(var(--surface-50) / 0.95);
  }

  /* Вторичный текст */
  &.secondary {
    color: rgba(var(--surface-300) / 0.8);
    font-size: 0.9em;
  }

  /* Мета-информация */
  &.caption {
    color: rgba(var(--surface-400) / 0.7);
    font-size: 0.8em;
    letter-spacing: 0.02em;
  }
}
```

### 6. Адаптивные градиенты

```css
.gradient-background {
  background: linear-gradient(
    135deg,
    rgba(var(--surface-800) / 0.8) 0%,
    rgba(var(--surface-700) / 0.6) 50%,
    rgba(var(--surface-800) / 0.8) 100%
  );
}

/* Активный градиент */
.gradient-active {
  background: linear-gradient(
    135deg,
    rgba(var(--primary-800) / 0.4) 0%,
    rgba(var(--primary-700) / 0.6) 50%,
    rgba(var(--primary-800) / 0.4) 100%
  );
}
```

## Практические примеры

### Кнопка Vision Pro

```css
.visionpro-button {
  padding: 12px 24px;
  border-radius: 12px;
  background: rgba(var(--surface-700) / 0.6);
  backdrop-filter: blur(22px);
  border: 1px solid rgba(var(--surface-400) / 0.3);
  color: var(--font-color);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(var(--primary-700) / 0.4);
    border-color: rgba(var(--primary-400) / 0.6);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(var(--primary-500) / 0.2);
  }

  &:active {
    transform: scale(0.98);
    transition: all 0.1s ease;
  }
}
```

### Карточка компонента

```css
.component-card {
  @extend .backdrop;
  padding: 20px;
  border-radius: 16px;
  background: rgba(var(--surface-800) / 0.5);

  /* Контент карточки */
  .title {
    color: rgba(var(--surface-50) / 0.95);
    font-weight: 600;
    margin-bottom: 8px;
  }

  .description {
    color: rgba(var(--surface-300) / 0.8);
    font-size: 0.9em;
    line-height: 1.4;
  }

  /* Состояния */
  &.active {
    border-color: rgba(var(--primary-400) / 0.6);
    box-shadow: 0 0 20px rgba(var(--primary-500) / 0.15);
  }

  &.error {
    border-color: rgba(var(--error-400) / 0.6);
    background: rgba(var(--error-900) / 0.3);
  }
}
```

### Индикатор состояния

```css
.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;

  /* Состояния с цветами темы */
  &.idle {
    background: rgba(var(--surface-500) / 0.8);
    box-shadow: 0 0 8px rgba(var(--surface-500) / 0.3);
  }

  &.active {
    background: rgba(var(--primary-400) / 0.9);
    box-shadow: 0 0 12px rgba(var(--primary-400) / 0.5);
  }

  &.success {
    background: rgba(var(--success-400) / 0.9);
    box-shadow: 0 0 12px rgba(var(--success-400) / 0.5);
  }

  &.error {
    background: rgba(var(--error-400) / 0.9);
    box-shadow: 0 0 12px rgba(var(--error-400) / 0.5);
  }
}
```

## Пример актора с Vision Pro дизайном

```javascript
export default MetaFor("visionpro-card")
  .context((t) => ({
    title: t.string({ default: "Карточка" }),
    status: t.enum("idle", "active", "success", "error")({ default: "idle" }),
    description: t.string({ default: "" }),
    interactive: t.boolean({ default: true }),
  }))
  .core(({ update }) => ({
    activate: () => update({ status: "active" }),
    deactivate: () => update({ status: "idle" }),
    setSuccess: () => update({ status: "success" }),
    setError: () => update({ status: "error" }),
  }))
  .reactions({
    "реакция на внешние события": {
      filter: ({ meta, patch }) => meta.tag === "external-controller" && patch.path === "/context",
      action: ({ patch, update, core }) => {
        const command = patch.value.command
        if (command === "activate") core.activate()
        if (command === "deactivate") core.deactivate()
        if (command === "success") core.setSuccess()
        if (command === "error") core.setError()
      },
    },
  })
  .states("idle", "active", "success", "error")
  .transitions("idle", {
    idle: {
      to: { active: { status: "active" } },
    },
    active: {
      to: {
        success: { status: "success" },
        error: { status: "error" },
        idle: { status: "idle" },
      },
    },
  })
  .view({
    render: ({ html, context, state, core }) => html`
      <div
        class="visionpro-card ${state}"
        ?interactive=${context.interactive}
        @click=${context.interactive ? core.activate : null}>
        <div class="card-header">
          <h3 class="title">${context.title}</h3>
          <div class="status-indicator ${context.status}"></div>
        </div>
        ${context.description ? html` <p class="description">${context.description}</p> ` : ""}
        <slot></slot>
      </div>
    `,
    style: ({ css }) => css`
      .visionpro-card {
        @extend .backdrop;
        padding: 20px;
        border-radius: 16px;
        background: rgba(var(--surface-800) / 0.5);
        border: 1px solid rgba(var(--surface-400) / 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: default;
      }

      .visionpro-card[interactive] {
        cursor: pointer;
      }

      .visionpro-card[interactive]:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(var(--primary-500) / 0.2);
        border-color: rgba(var(--primary-400) / 0.5);
      }

      .visionpro-card.active {
        border-color: rgba(var(--primary-400) / 0.6);
        box-shadow: 0 0 20px rgba(var(--primary-500) / 0.15);
      }

      .visionpro-card.success {
        border-color: rgba(var(--success-400) / 0.6);
        background: rgba(var(--success-900) / 0.3);
      }

      .visionpro-card.error {
        border-color: rgba(var(--error-400) / 0.6);
        background: rgba(var(--error-900) / 0.3);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .title {
        color: rgba(var(--surface-50) / 0.95);
        font-weight: 600;
        margin: 0;
        letter-spacing: -0.02em;
      }

      .status-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        backdrop-filter: blur(8px);
        transition: all 0.3s ease;
      }

      .status-indicator.idle {
        background: rgba(var(--surface-500) / 0.8);
        box-shadow: 0 0 8px rgba(var(--surface-500) / 0.3);
      }

      .status-indicator.active {
        background: rgba(var(--primary-400) / 0.9);
        box-shadow: 0 0 12px rgba(var(--primary-400) / 0.5);
      }

      .status-indicator.success {
        background: rgba(var(--success-400) / 0.9);
        box-shadow: 0 0 12px rgba(var(--success-400) / 0.5);
      }

      .status-indicator.error {
        background: rgba(var(--error-400) / 0.9);
        box-shadow: 0 0 12px rgba(var(--error-400) / 0.5);
      }

      .description {
        color: rgba(var(--surface-300) / 0.8);
        font-size: 0.9em;
        line-height: 1.4;
        margin: 0 0 12px 0;
      }
    `,
  })
```

## Ключевые правила

1. **Никаких хардкодных цветов** - только CSS-переменные из темы
2. **Обязательный backdrop-filter** для всех поверхностей
3. **Полупрозрачность** - rgba с альфа-каналом 0.3-0.8
4. **Мягкие тени** с цветами темы, не черные
5. **Скругленные углы** 8px-16px для компонентов
6. **Плавные переходы** с cubic-bezier кривыми
7. **Пространственность** через transform и тени
8. **Доступность** с focus-visible и proper contrast
9. **Именованные реакции** для лучшей читаемости кода

Следуя этим принципам, все компоненты MetaFor будут выглядеть как нативные элементы Apple Vision Pro с единообразной эстетикой и максимальной функциональностью.
