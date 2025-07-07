# 🚀 MetaFor

> Современная библиотека для создания динамических контекстов с типизированными параметрами в TypeScript/JavaScript

[![TypeScript](https://img.shields.io/badge/TypeScript-4.4+-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.2+-green.svg)](https://bun.sh/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📚 Документация

Документация API генерируется в отдельном подпроекте для оптимизации основного проекта.

## ✨ Особенности

- ✅ **Функциональный API** - удобные методы для создания типов
- ✅ **Система required/optional полей** - по умолчанию поля optional (допускают null)
- ✅ **Только null для optional полей** - никакого undefined
- ✅ **Автоматический вывод типов** - полное автодополнение в TypeScript
- ✅ **Runtime защита от undefined** - undefined значения игнорируются
- ✅ **Совместимость с vanilla JavaScript** - можно использовать без TypeScript

## ⚠️ Ограничения типов

- **enum** — допускает только строки и числа (литеральные значения)
- **array** — допускает только строки, числа или булево (`string | number | boolean`)
- Массивы и enum должны быть однородными по типу (например, только строки или только числа)

## 🛠️ Установка

```bash
bun add @metafor/space
```

## 🚀 Использование

### Базовый пример

```typescript
import { MetaFor, types } from '@metafor/space'

const userContext = MetaFor('user').context({
  // Required поля - не могут быть null
  name: types.string.required({ default: 'Гость' }),
  role: types.enum('user', 'admin', 'moderator').required({ default: 'user' }),
  
  // Optional поля - могут быть null (по умолчанию)
  nickname: types.string(),
  bio: types.string.optional(),
  priority: types.enum('low', 'medium', 'high')(),
  tags: types.array.optional({ default: [] })
})

// Типы: только null для optional полей, без undefined
userContext.context.name      // string (required)
userContext.context.role      // 'user' | 'admin' | 'moderator' (required)
userContext.context.nickname  // string | null (optional)
userContext.context.bio       // string | null (optional)
userContext.context.priority  // 'low' | 'medium' | 'high' | null (optional)
userContext.context.tags      // any[] | null (optional)

// ✅ Валидные обновления
userContext.update({name: "test"})
userContext.update({role: "admin"})
userContext.update({nickname: "nick"})
userContext.update({nickname: null})      // OK - optional поле
userContext.update({bio: null})           // OK - optional поле
userContext.update({priority: "high"})
userContext.update({priority: null})      // OK - optional поле

// ❌ undefined значения отклоняются на runtime
// userContext.update({name: undefined})  // ❌ Error - TypeScript запрещает
// userContext.update({role: undefined})  // ❌ Error - TypeScript запрещает
```

## 📋 Доступные типы

### String

```typescript
// Required string
name: types.string.required({ default: 'Гость' })

// Optional string (по умолчанию)
nickname: types.string()

// Optional string (явно)
bio: types.string.optional()
```

### Number

```typescript
// Required number
age: types.number.required({ default: 18 })

// Optional number
score: types.number()
```

### Boolean

```typescript
// Required boolean
isActive: types.boolean.required({ default: true })

// Optional boolean
isVerified: types.boolean()
```

### Enum

```typescript
// Required enum
role: types.enum('user', 'admin', 'moderator').required({ default: 'user' })
// ❌ Только строки или числа!

// Optional enum
priority: types.enum('low', 'medium', 'high')()
```

### Array

```typescript
// Required array
tags: types.array.required({ default: [] })
// ❌ Только строки, числа или булево!

// Optional array
permissions: types.array()
```

## 🔧 API

### `MetaFor(name: string)`

Создает новый экземпляр MetaFor с указанным именем.

### `types`

Объект с методами для создания типов:

| Метод | Описание |
|-------|----------|
| `types.string.required(options?)` | Обязательное строковое поле |
| `types.string(options?)` | Опциональное строковое поле |
| `types.string.optional(options?)` | Опциональное строковое поле (явно) |
| `types.number.required(options?)` | Обязательное числовое поле |
| `types.number(options?)` | Опциональное числовое поле |
| `types.boolean.required(options?)` | Обязательное булево поле |
| `types.boolean(options?)` | Опциональное булево поле |
| `types.enum(...values).required(options?)` | Обязательное enum поле |
| `types.enum(...values)(options?)` | Опциональное enum поле |
| `types.array.required(options?)` | Обязательное поле массива |
| `types.array(options?)` | Опциональное поле массива |

### `context.update(values)`

Обновляет значения в контексте. Принимает объект с новыми значениями.

> **Важно:** undefined значения игнорируются на runtime и запрещены TypeScript.

## 🎯 Типизация

Библиотека обеспечивает полную типизацию:

- **Required поля** - имеют тип без null и undefined
- **Optional поля** - имеют тип с null, но без undefined
- **Enum поля** - имеют литеральные типы значений
- **Update функция** - запрещает undefined на уровне TypeScript

## 📋 Требования

- TypeScript 4.4+ (для exactOptionalPropertyTypes)
- Bun 1.2+ или современный браузер

## 📄 Лицензия

MIT

---

**MetaFor** - Создавайте типизированные контексты с легкостью! 🎉
