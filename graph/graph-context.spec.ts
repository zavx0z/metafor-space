import {describe, expect, test} from "bun:test"
import {MetaFor} from "../metafor.js"

describe("graph-context с новым форматом переходов", () => {
  test("новый формат переходов должен работать", () => {
    const tag = "test-context-transitions"
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    
    const Meta = MetaFor(tag, {development: true})
      .context((t) => ({
        layout: t.boolean({default: false}),
        error: t.string({nullable: true}),
        active: t.boolean({default: false}),
        process: t.boolean({default: false}),
      }))
      .core(() => ({}))
      .reactions([])
      .states("измерение", "позиционирование", "неактивно", "активно")
      .transitions("измерение", [
        {
          in: "измерение",
          to: {
            "позиционирование": {layout: true}
          }
        },
        {
          in: "позиционирование", 
          to: {
            "неактивно": {error: null, active: false},
            "активно": {error: null, active: true}
          }
        }
      ])
      .view({})
      
    const meta = document.querySelector(`metafor-${tag}`)
    
    expect(meta).toBeTruthy()
    expect(meta.getAttribute('state')).toBe('измерение')
    
    // Проверяем переход по условию
    meta.update({layout: true})
    expect(meta.getAttribute('state')).toBe('позиционирование')
    
    // Проверяем следующий переход
    meta.update({active: false, error: null})
    expect(meta.getAttribute('state')).toBe('неактивно')
  })
})

export {}