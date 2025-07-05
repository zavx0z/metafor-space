import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"


describe("core", () => {
  describe("обработка нажатия и отпускания пробела", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context(({boolean}) => ({
        actionUpdate: boolean({title: "Обновление контекста из action", nullable: true, default: false}),
        isSpacePressed: boolean({title: "Нажата ли клавиша Space", default: false}),
      }))
      .core(({update}) => ({
        handleKeyDown: (code: string) => {
          if (code === "Space") {
            update({actionUpdate: false})
          }
        },
        handleKeyUp(code: string) {
          if (code === "Space") {
            update({actionUpdate: false})
          }
        },
      }))
      .reactions({})
      .states("ОЖИДАНИЕ", "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА", "отпуск элемента")
      .transitions("ОЖИДАНИЕ", {
        "ОЖИДАНИЕ": {
          to: {
            "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА": {isSpacePressed: true}
          }
        },
        "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА": {
          action: ({core}) => {
            core.handleKeyDown("Space")
            return {actionUpdate: true}
          },
          to: {
            "отпуск элемента": {isSpacePressed: false, actionUpdate: false}
          }
        },
        "отпуск элемента": {
          action: ({core}) => {
            core.handleKeyUp("Space")
            return {actionUpdate: true}
          },
          to: {
            "ОЖИДАНИЕ": {isSpacePressed: false, actionUpdate: false}
          }
        }
      })
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    test("Проверяем начальное состояние", () => {
      expect(meta.context.isSpacePressed).toBe(false)
      expect(meta.state).toBe("ОЖИДАНИЕ")
    })
    test("Эмулируем нажатие пробела", () => {
      meta.update({isSpacePressed: true})
      expect(meta.context.isSpacePressed).toBe(true)
      expect(meta.state).toBe("ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
    })
    test("Эмулируем отпускание пробела", () => {
      meta.update({isSpacePressed: false, actionUpdate: false})
      expect(meta.context.isSpacePressed).toBe(false)
      expect(meta.state).toBe("отпуск элемента")
    })
  })

  test.todo("Кто вызывает обновление контекста, какие параметры контекста обновляет и с какими значениями")
  test("Волатильность параметров", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context(({boolean}) => ({
        isSpacePressed: boolean({title: "Нажата ли клавиша Space", default: false}),
      }))
      .core(({update}) => {
        // Создаем объект с общим состоянием
        const coreState = {parameter: true}
        return {
          handleKeyDown(code: string) {
            if (code === "Space") {
              update({isSpacePressed: coreState.parameter})
            }
          },
          parameter: coreState.parameter,
        }
      })
      .reactions({})
      .states("ОЖИДАНИЕ", "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
      .transitions("ОЖИДАНИЕ", {
        "ОЖИДАНИЕ": {
          to: {
            "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА": {isSpacePressed: true}
          }
        },
        "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА": {
          action: ({core}) => {
            core.handleKeyDown("Space")
          },
          to: {
            "ОЖИДАНИЕ": {isSpacePressed: false}
          }
        }
      })
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({isSpacePressed: true})
    expect(meta.context.isSpacePressed).toBe(true)
  })
  test("Доступ внутри ядра ко всем входящим в состав meta функциям и объектам", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context(({boolean}) => ({
        isSpacePressed: boolean({title: "Нажата ли клавиша Space", default: false}),
      }))
      .core(({update}) => ({
        /** Используем стрелочную функцию, которая замкнет coreState */
        handleKeyDown(code: string) {
          if (code === "Space") {
            update({isSpacePressed: this.parameter})
          }
        },
        parameter: true,
      }))
      .reactions({})
      .states("ОЖИДАНИЕ", "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
      .transitions("ОЖИДАНИЕ", {
        "ОЖИДАНИЕ": {
          to: {
            "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА": {isSpacePressed: true}
          }
        },
        "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА": {
          action: ({core}) => {
            core.handleKeyDown("Space")
          },
          to: {
            "ОЖИДАНИЕ": {isSpacePressed: false}
          }
        }
      })
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    meta.update({isSpacePressed: true})
    expect(meta.context.isSpacePressed).toBe(true)
  })

  test("Доступ внутри ядра к контексту meta", () => {
    const tag = Bun.randomUUIDv7()
    document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
    const Meta = MetaFor(tag)
      .context(({number}) => ({
        parameter: number({default: 0}),
        other: number({default: 1})
      }))
      .core(({context, update, self}) => ({
        parameter: context.parameter,
        updateOther: () => update({other: self.parameter})
      }))
      .reactions({})
      .states("ОЖИДАНИЕ", "ПАРАМЕТР ОБНОВЛЕН")
      .transitions("ОЖИДАНИЕ", {
        "ОЖИДАНИЕ": {
          to: {
            "ПАРАМЕТР ОБНОВЛЕН": {other: 1}
          }
        },
        "ПАРАМЕТР ОБНОВЛЕН": {
          action: ({core}) => core.updateOther(),
          to: {
            "ОЖИДАНИЕ": {other: 0}
          }
        }
      })
      .view({})
    const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

    expect(meta.context.other).toBe(0)
  })
})

describe("core", () => {
  describe("Взаимодействие с общими данными через core", () => {
    test("Данные в core доступны для модификации без замены", () => {

      const sharedArray: object[] = []
      const tag = Bun.randomUUIDv7()
      document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
      const Meta = MetaFor(tag)
        .context(({boolean}) => ({
          isUpdated: boolean({title: "Обновлено ли", default: false}),
        }))
        .core(({update}) => ({
          addData: (value: object) => {
            sharedArray.push(value)
            update({isUpdated: true})
          },
          getData: () => sharedArray,
        }))
      .reactions({})
      .states("INITIAL", "MODIFIED")
        .transitions("INITIAL", {
          "INITIAL": {
            action: ({core}) => {
              core.addData(42)
            },
            to: {"MODIFIED": {isUpdated: true}},
          },
        })
        .view({})
      const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

      expect(meta.context.isUpdated).toBe(true)
      expect(meta.state).toBe("MODIFIED")
      expect(sharedArray).toEqual([42])
    })
  })

  describe("обновление ядра внутри через self ", () => {
    test("обновление ядра внутри через self", () => {
      const tag = Bun.randomUUIDv7()
      document.body.innerHTML = `<metafor-${tag}></metafor-${tag}>`
      const Meta = MetaFor(tag)
        .context((t) => ({
          coreParameter: t.number({nullable: true})
        }))
        .core(({self, update}) => ({
          coreParameter: 0,
          update: () => {
            self.coreParameter = 1
            update({coreParameter: self.coreParameter})
          },
        }))
      .reactions({})
      .states("INITIAL", "UPDATED")
        .transitions("INITIAL", {
          "INITIAL": {
            action: ({core}) => core.update(),
            to: {"UPDATED": {coreParameter: null}}
          }
        })
        .view({})
      const meta = document.querySelector(`metafor-${tag}`) as Meta<typeof Meta.state, typeof Meta.types>

      expect(meta.context.coreParameter).toEqual(1)
    })
  })
})
