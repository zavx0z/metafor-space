import {beforeAll, describe, expect, test} from "bun:test"
import {html, nothing, render} from '../../html.js'
import {guard} from '../../directives/guard.js'
import {Directive, directive} from "../../directive.js"
import type {PartInfo} from "../../types/directives.js"

describe('guard', () => {
  let container: HTMLDivElement

  function renderGuarded(value: any, f: () => any) {
    render(html`
      <div>${guard(value, f)}</div>`, container)
  }

  beforeAll(() => {
    container = document.createElement('div')
  })

  test('re-renders only on identity changes', () => {
    let callCount = 0
    let renderCount = 0

    const guardedTemplate = () => {
      callCount += 1
      return html`Template ${renderCount}`
    }

    renderCount += 1
    renderGuarded('foo', guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div>Template 1</div>')

    renderCount += 1
    renderGuarded('foo', guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div>Template 1</div>')

    renderCount += 1
    renderGuarded('bar', guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div>Template 3</div>')

    expect(callCount).toBe(2)
  })

  test('renders with undefined the first time', () => {
    let callCount = 0
    let renderCount = 0

    const guardedTemplate = () => {
      callCount += 1
      return html`${renderCount}`
    }

    renderCount += 1
    renderGuarded(undefined, guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div>1</div>')

    renderCount += 1
    renderGuarded(undefined, guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div>1</div>')

    expect(callCount).toBe(1)
  })

  test('renders with nothing the first time', () => {
    let callCount = 0
    let renderCount = 0

    const guardedTemplate = () => {
      callCount += 1
      return html`${renderCount}`
    }

    renderCount += 1
    renderGuarded(nothing, guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div>1</div>')

    renderCount += 1
    renderGuarded(nothing, guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div>1</div>')

    expect(callCount).toBe(1)
  })

  test('dirty checks array values', () => {
    let callCount = 0
    let items = ['foo', 'bar']

    const guardedTemplate = () => {
      callCount += 1
      return html`
        <ul>${items.map((i) => html`
          <li>${i}</li>`)}
        </ul>`
    }

    renderGuarded([items], guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div><ul><li>foo</li><li>bar</li></ul></div>')

    items.push('baz')
    renderGuarded([items], guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div><ul><li>foo</li><li>bar</li></ul></div>')

    items = [...items]
    renderGuarded([items], guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div><ul><li>foo</li><li>bar</li><li>baz</li></ul></div>')

    expect(callCount).toBe(2)
  })

  test('dirty checks arrays of values', () => {
    let callCount = 0
    const items = ['foo', 'bar']

    const guardedTemplate = () => {
      callCount += 1
      return html`
        <ul>${items.map((i) => html`
          <li>${i}</li>`)}
        </ul>`
    }

    renderGuarded(items, guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div><ul><li>foo</li><li>bar</li></ul></div>')

    renderGuarded(['foo', 'bar'], guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div><ul><li>foo</li><li>bar</li></ul></div>')

    items.push('baz')
    renderGuarded(items, guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div><ul><li>foo</li><li>bar</li><li>baz</li></ul></div>')

    expect(callCount).toBe(2)
  })

  test('guards directive from running', () => {
    let directiveRenderCount = 0
    let directiveConstructedCount = 0
    let renderCount = 0

    class MyDirective extends Directive {

      constructor(partInfo: PartInfo) {
        super(partInfo)
        directiveConstructedCount++
      }

      render() {
        directiveRenderCount++
        return directiveRenderCount
      }
    }

    const testDirective = directive(MyDirective)

    const guardedTemplate = () => {
      renderCount += 1
      return testDirective()
    }

    renderGuarded('foo', guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div>1</div>')

    renderGuarded('foo', guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div>1</div>')

    renderGuarded('bar', guardedTemplate)
    expect(container.innerHTML).toMatchStringHTMLStripMarkers('<div>2</div>')

    expect(renderCount).toBe(2)
    expect(directiveConstructedCount).toBe(1)
  })
})
