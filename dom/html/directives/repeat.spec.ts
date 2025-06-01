import {describe, expect, beforeAll, test} from "bun:test"
import {html, render} from "../html.js"
import {repeat} from "./repeat.js"

function assertItemIdentity(oldChildren: HTMLElement[], newChildren: HTMLElement[], newOrder: number[]) {
  newOrder.forEach((o, n) => {
    if (o >= 0 && o < oldChildren.length) {
      expect(oldChildren[o]).toBe(newChildren[n])
    }
  })
}

describe("repeat", () => {
  let container: HTMLElement

  beforeAll(() => {
    container = document.createElement("div")
  })

  describe("с ключами", () => {
    test("отображает список", () => {
      // prettier-ignore
      const r = html`${repeat([1, 2, 3], (i) => i, (i) => html`
            <li>item: ${i}</li>`)}`;
      render(r, container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 1</li>
            <li>item: 2</li>
            <li>item: 3</li>`)
    })

    test("отображает список дважды", () => {
      const t = (items: any[]) =>
        // prettier-ignore
        html`${repeat(items, (i) => i, (i) => html`
            <li>item: ${i}</li>`)}`

      render(t([0, 1, 2]), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>`)
      const children1 = Array.from(container.querySelectorAll("li"))

      render(t([0, 1, 2]), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, [0, 1, 2])
    })

    test("перемешивание стабильно", () => {
      let items: number[] = [0, 1, 2]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => i, (i) => html`
            <li>item: ${i}</li>`)}`;
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>`)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [2, 1, 0]
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 2</li>
            <li>item: 1</li>
            <li>item: 0</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, items)
    })

    test("перемешивает список с добавлениями", () => {
      let items = [0, 1, 2, 3, 4]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => i, (i) => html`
            <li>item: ${i}</li>`)}`;
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>
            <li>item: 3</li>
            <li>item: 4</li>`)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [2, 0, 3, 5, 1, 4]
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 2</li>
            <li>item: 0</li>
            <li>item: 3</li>
            <li>item: 5</li>
            <li>item: 1</li>
            <li>item: 4</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, items)
    })

    test("обмен местами стабилен", () => {
      const t = (items: number[]) =>
        // prettier-ignore
        html`${repeat(items, (i) => i, (i) => html`
            <li>item: ${i}</li>`)}`

      let items = [0, 1, 2, 3, 4]
      render(t(items), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>
            <li>item: 3</li>
            <li>item: 4</li>`)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [0, 4, 2, 3, 1]
      render(t(items), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 4</li>
            <li>item: 2</li>
            <li>item: 3</li>
            <li>item: 1</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, items)
    })

    test("может перерисовывать после обмена", () => {
      const t = (items: number[]) =>
        // prettier-ignore
        html`${repeat(items, (i) => i, (i) => html`
            <li>item: ${i}</li>`)}`

      let items = [0, 1, 2]
      render(t(items), container)
      const children1 = Array.from(container.querySelectorAll("li"))

      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>`)

      items = [2, 1, 0]
      render(t(items), container)

      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 2</li>
            <li>item: 1</li>
            <li>item: 0</li>`)

      render(t(items), container)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, items)
    })

    test("может вставить элемент в начало", () => {
      let items = [0, 1, 2]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => i, (i: number) => html`
            <li>item: ${i}</li>`)}`;
      render(t(), container)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [-1, 0, 1, 2]
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: -1</li>
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, items)
    })

    test("может вставить элемент в конец", () => {
      let items = [0, 1, 2]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => i, (i: number) => html`
            <li>item: ${i}</li>`)}`;

      render(t(), container)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [0, 1, 2, 3]
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>
            <li>item: 3</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, items)
    })

    test("может заменить пустым списком", () => {
      let items = [0, 1, 2]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => i, (i: number) => html`
            <li>item: ${i}</li>`)}`;

      render(t(), container)
      items = []
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(``)
    })

    test("может удалить первый элемент", () => {
      let items = [0, 1, 2]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => i, (i) => html`
            <li>item: ${i}</li>`)}`;

      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>`)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [1, 2]
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 1</li>
            <li>item: 2</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, items)
    })

    test("может удалить последний элемент", () => {
      let items = [0, 1, 2]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => i, (i: number) => html`
            <li>item: ${i}</li>`)}`;

      render(t(), container)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [0, 1]
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, items)
    })

    test("может удалить элемент из середины", () => {
      let items = [0, 1, 2]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => i, (i: number) => html`
            <li>item: ${i}</li>`)}`;

      render(t(), container)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [0, 2]
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 2</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, items)
    })

    test("может удалить несколько элементов из середины", () => {
      let items = [0, 1, 2, 3, 4, 5, 6]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => i, (i: number) => html`
            <li>item: ${i}</li>`)}`;

      render(t(), container)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [0, 3, 6]
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 3</li>
            <li>item: 6</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, items)
    })

    test("может переместить несколько элементов из середины", () => {
      let items = [0, 1, 2, 3, 4, 5, 6]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => i, (i: number) => html`
            <li>item: ${i}</li>`)}`;

      render(t(), container)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [0, 4, 5, 3, 2, 1, 6]
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 4</li>
            <li>item: 5</li>
            <li>item: 3</li>
            <li>item: 2</li>
            <li>item: 1</li>
            <li>item: 6</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, items)
    })

    test("может добавить несколько элементов в середину", () => {
      let items = [0, 1, 2, 3, 4]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => i, (i: number) => html`
            <li>item: ${i}</li>`)}`;

      render(t(), container)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [0, 5, 1, 2, 3, 6, 4]
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 5</li>
            <li>item: 1</li>
            <li>item: 2</li>
            <li>item: 3</li>
            <li>item: 6</li>
            <li>item: 4</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      assertItemIdentity(children1, children2, items)
    })
  })

  describe("без ключей", () => {
    test("отображает список", () => {
      // prettier-ignore
      const r = html`${repeat([0, 1, 2], (i: number) => html`
            <li>item: ${i}</li>`)}`;
      render(r, container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>`)
    })

    test("перемешивает список", () => {
      let items = [0, 1, 2]
      // prettier-ignore
      const t = () => html`${repeat(items, (i: number) => html`
            <li>item: ${i}</li>`)}`;
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>`)

      items = [2, 1, 0]
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 2</li>
            <li>item: 1</li>
            <li>item: 0</li>`)
    })

    test("может заменить пустым списком", () => {
      let items = [0, 1, 2]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => html`<li>item: ${i}</li>`)}`
      render(t(), container)

      items = []
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(``)
    })

    test("перерисовывает список", () => {
      const items = [0, 1, 2, 3, 4]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => html`<li>item: ${i}</li>`)}`

      render(t(), container)
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>
            <li>item: 3</li>
            <li>item: 4</li>`)
    })

    test("отображает объекты как элементы с изменяемым обновлением", () => {
      const items = [{text: "0"}, {text: "1"}, {text: "2"}]
      // prettier-ignore
      const t = () => html`${repeat(items, (i) => html` <li>item: ${i.text}</li>`)}`
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>`)
      const children1 = Array.from(container.querySelectorAll("li"))

      items[1].text += "*"
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1*</li>
            <li>item: 2</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))
      assertItemIdentity(children1, children2, [0, 1, 2])
    })

    test("отображает объекты как элементы с неизменяемым обновлением", () => {
      let items: {text: string}[] = [{text: "0"}, {text: "1"}, {text: "2"}]
      const t = () => html`${repeat(items, (i) => html`<li>item: ${i.text}</li>`)}`
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>`)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [items[0], {text: items[1].text + "*"}, items[2]]
      render(t(), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1*</li>
            <li>item: 2</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))
      assertItemIdentity(children1, children2, [0, 1, 2])
    })
  })

  describe("неопределенное поведение", () => {
    // Примечание: эти тесты предназначены только для фиксации текущего поведения реализации,
    // а не для гарантии поведения repeat.
    // Предоставление дублирующихся ключей официально не поддерживается.
    // Если эти тесты сломаются из-за изменений в реализации,
    // можно обновить ожидаемые результаты.

    test("начальное отображение последовательных дублирующихся ключей", () => {
      const t = (items: number[]) =>
        // prettier-ignore
        html`${repeat(items, (i) => i, (i: number) => html`
            <li>item: ${i}</li>`)}`

      render(t([0, 1, 2, 2, 3, 4]), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>
            <li>item: 2</li>
            <li>item: 3</li>
            <li>item: 4</li>`)
    })

    test("обновление последовательных дублирующихся ключей (без изменения порядка)", () => {
      const t = (items: number[]) =>
        // prettier-ignore
        html`${repeat(items, (i) => i, (i: number) => html`
            <li>item: ${i}</li>`)}`

      let items = [0, 1, 2, 2, 3, 4]
      render(t(items), container)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [0, 1, 2, 2, 3, 4]
      render(t(items), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 2</li>
            <li>item: 2</li>
            <li>item: 3</li>
            <li>item: 4</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      //   Части для этих дублирующихся ключей сохраняются v  v
      assertItemIdentity(children1, children2, [0, 1, 2, 3, 4, 5])
    })

    test("начальное отображение дублирующихся ключей с пропуском", () => {
      const t = (items: number[]) => html`
          ${repeat(items, (i) => i, (i: number) => html`
              <li>item: ${i}</li>
          `)}`

      render(t([0, 1, 42, 2, 42, 3, 4]), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 0</li>
            <li>item: 1</li>
            <li>item: 42</li>
            <li>item: 2</li>
            <li>item: 42</li>
            <li>item: 3</li>
            <li>item: 4</li>`)
    })

    test("обновление дублирующихся ключей с пропуском", () => {
      const t = (items: number[]) => html`
      ${repeat(items, (i) => i, (i: number) => html`
          <li>item: ${i}</li>
      `)}`

      let items = [0, 1, 2, 3, 2, 4, 5]
      render(t(items), container)
      const children1 = Array.from(container.querySelectorAll("li"))

      items = [1, 2, 0, 5, 2, 4, 3]
      render(t(items), container)
      expect(container.innerHTML).toMatchStringHTMLStripMarkers(`
            <li>item: 1</li>
            <li>item: 2</li>
            <li>item: 0</li>
            <li>item: 5</li>
            <li>item: 2</li>
            <li>item: 4</li>
            <li>item: 3</li>`)
      const children2 = Array.from(container.querySelectorAll("li"))

      // Часть для этого повторяющегося ключа была пересоздана v
      assertItemIdentity(children1, children2, [1, -1, 0, 6, 2, 5, 3])
    })
  })
})
