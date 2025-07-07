import { describe, it, expect } from 'bun:test'
import { MetaFor } from './metafor'

describe('MetaFor', () => {
  it('создаёт контекст с правильными типами и значениями по умолчанию', () => {
    const userContext = MetaFor('user').context(types => ({
      name: types.string.required({ default: 'Гость' }),
      role: types.enum('user', 'admin', 'moderator').required({ default: 'user' }),
      nickname: types.string(),
      bio: types.string.optional(),
      priority: types.enum('low', 'medium', 'high')(),
      tags: types.array.optional({ default: [] }),
    }))
    expect(userContext.context.name).toBe('Гость')
    expect(userContext.context.role).toBe('user')
    expect(userContext.context.nickname).toBe(null)
    expect(userContext.context.bio).toBe(null)
    expect(userContext.context.priority).toBe(null)
    expect(userContext.context.tags).toEqual([])
  })

  it('обновляет только переданные значения, игнорирует undefined', () => {
    const ctx = MetaFor('user').context(types => ({
      name: types.string.required({ default: 'Гость' }),
      nickname: types.string(),
    }))
    ctx.update({ name: 'test' })
    expect(ctx.context.name).toBe('test')
    ctx.update({ nickname: 'nick' })
    expect(ctx.context.nickname).toBe('nick')
    ctx.update({ nickname: null })
    expect(ctx.context.nickname).toBe(null)
    // ctx.update({ name: undefined }) // TS должен ругаться
  })

  it('не допускает undefined для optional полей (TS)', () => {
    const ctx = MetaFor('user').context(types => ({
      nickname: types.string(),
    }))
    // ctx.update({ nickname: undefined }) // TS должен ругаться
    ctx.update({ nickname: null })
    expect(ctx.context.nickname).toBe(null)
  })

  it('enum допускает только строки и числа', () => {
    // types.enum(true, false)() // TS должен ругаться
    // types.enum({})() // TS должен ругаться
    const ctx = MetaFor('user').context(types => ({
      role: types.enum('user', 'admin')(),
    }))
    expect(ctx.context.role).toBe(null)
    ctx.update({ role: 'admin' })
    expect(ctx.context.role).toBe('admin')
  })

  it('array допускает только строки, числа или булево', () => {
    // types.array({ default: [{}] }) // TS должен ругаться
    const ctx = MetaFor('user').context(types => ({
      tags: types.array<string>({ default: ['a', 'b'] }),
      numbers: types.array<number>(),
      flags: types.array<boolean>(),
    }))
    expect(ctx.context.tags).toEqual(['a', 'b'])
    expect(ctx.context.numbers).toBe(null)
    expect(ctx.context.flags).toBe(null)
  })

  it('корректно работает с разными типами', () => {
    const ctx = MetaFor('complex').context(types => ({
      title: types.string.required({ default: 'Заголовок' }),
      description: types.string(),
      age: types.number.required({ default: 18 }),
      score: types.number(),
      isActive: types.boolean.required({ default: true }),
      isVerified: types.boolean(),
      status: types.enum('draft', 'published', 'archived').required({ default: 'draft' }),
      category: types.enum('tech', 'design', 'business')(),
      tags: types.array.required<string>({ default: [] }),
      permissions: types.array<number>(),
      flags: types.array<boolean>(),
    }))
    ctx.update({
      title: 'Новый заголовок',
      description: 'Новое описание',
      age: 25,
      score: 100,
      isActive: false,
      isVerified: true,
      status: 'published',
      category: 'tech',
      tags: ['typescript', 'library'],
      permissions: [1, 2, 3],
      flags: [true, false, true],
    })
    expect(ctx.context.title).toBe('Новый заголовок')
    expect(ctx.context.description).toBe('Новое описание')
    expect(ctx.context.age).toBe(25)
    expect(ctx.context.score).toBe(100)
    expect(ctx.context.isActive).toBe(false)
    expect(ctx.context.isVerified).toBe(true)
    expect(ctx.context.status).toBe('published')
    expect(ctx.context.category).toBe('tech')
    expect(ctx.context.tags).toEqual(['typescript', 'library'])
    expect(ctx.context.permissions).toEqual([1, 2, 3])
    expect(ctx.context.flags).toEqual([true, false, true])
  })

  describe('Иммутабельность контекста', () => {
    it('запрещает прямое изменение значений контекста', () => {
      const ctx = MetaFor('user').context(types => ({
        name: types.string.required({ default: 'Гость' }),
        status: types.enum('start', 'process', 'end').required({ default: 'start' }),
      }))
      // ctx.context.name = "other" // будет ошибка линтинга
      // Попытка прямого изменения должна вызывать ошибку
      expect(() => {
        (ctx.context as any).name = 'Новое имя'
      }).toThrow('Прямое изменение контекста запрещено')

      expect(() => {
        (ctx.context as any).status = 'process'
      }).toThrow('Прямое изменение контекста запрещено')

      expect(() => {
        (ctx.context as any).newField = 'значение'
      }).toThrow('Прямое изменение контекста запрещено')
    })

    it('запрещает удаление свойств контекста', () => {
      const ctx = MetaFor('user').context(types => ({
        name: types.string.required({ default: 'Гость' }),
        status: types.enum('start', 'process', 'end').required({ default: 'start' }),
      }))

      // Попытка удаления свойства должна вызывать ошибку
      expect(() => {
        delete (ctx.context as any).name
      }).toThrow('Удаление свойств контекста запрещено')

      expect(() => {
        delete (ctx.context as any).status
      }).toThrow('Удаление свойств контекста запрещено')
    })

    it('позволяет читать значения контекста', () => {
      const ctx = MetaFor('user').context(types => ({
        name: types.string.required({ default: 'Гость' }),
        status: types.enum('start', 'process', 'end').required({ default: 'start' }),
      }))

      // Чтение значений должно работать
      expect(ctx.context.name).toBe('Гость')
      expect(ctx.context.status).toBe('start')
    })

    it('обновление через update() работает корректно', () => {
      const ctx = MetaFor('user').context(types => ({
        name: types.string.required({ default: 'Гость' }),
        status: types.enum('start', 'process', 'end').required({ default: 'start' }),
      }))

      // Обновление через update() должно работать
      ctx.update({ name: 'Новое имя', status: 'process' })
      expect(ctx.context.name).toBe('Новое имя')
      expect(ctx.context.status).toBe('process')
    })

    it('контекст остается иммутабельным после обновления', () => {
      const ctx = MetaFor('user').context(types => ({
        name: types.string.required({ default: 'Гость' }),
        status: types.enum('start', 'process', 'end').required({ default: 'start' }),
      }))

      ctx.update({ name: 'Новое имя' })

      // После обновления прямое изменение все еще должно быть запрещено
      expect(() => {
        (ctx.context as any).name = 'Другое имя'
      }).toThrow('Прямое изменение контекста запрещено')

      expect(() => {
        (ctx.context as any).status = 'end'
      }).toThrow('Прямое изменение контекста запрещено')
    })
  })
}) 