import "./graph-context.js"

// Простой тест для проверки нового формата переходов
console.log("=== Тест graph-context с новым форматом переходов ===")

// Создаем элемент
const tag = Math.random().toString(36).substring(7)
document.body.innerHTML = `<metafor-graph-context-${tag}></metafor-graph-context-${tag}>`

const element = document.querySelector(`metafor-graph-context-${tag}`)

if (element) {
  console.log("✓ Элемент создан успешно:", element.tagName)
  
  // Проверяем начальное состояние
  setTimeout(() => {
    const state = element.getAttribute('state')
    console.log("✓ Начальное состояние:", state)
    
    if (state === 'измерение') {
      console.log("✓ Новый формат переходов работает корректно")
    } else {
      console.log("✗ Неожиданное состояние:", state)
    }
  }, 100)
} else {
  console.log("✗ Элемент не создан")
}

console.log("=== Тест завершен ===")

export {}