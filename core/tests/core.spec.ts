import {describe, expect, test} from "bun:test"
import {MetaFor} from "@metafor/space"

describe("core", () => {
  describe("обработка нажатия и отпускания пробела", () => {
    document.body.innerHTML = `<metafor-test-1></metafor-test-1>`
    const meta = MetaFor("test-1")
      .states("ОЖИДАНИЕ", "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА", "отпуск элемента")
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
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{state: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА", when: {isSpacePressed: true}}],
        },
        {
          from: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА",
          action: ({core, update}) => {
            core.handleKeyDown("Space")
            update({actionUpdate: true})
          },
          to: [{state: "отпуск элемента", when: {isSpacePressed: false, actionUpdate: false}}]
        },
        {
          from: "отпуск элемента",
          action: ({core, update}) => {
            core.handleKeyUp("Space")
            update({actionUpdate: true})
          },
          to: [{state: "ОЖИДАНИЕ", when: {isSpacePressed: false, actionUpdate: false}}],
        }
      ])
      .create({
        state: "ОЖИДАНИЕ",
      })
    console.log(meta.context, meta.state)
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
    document.body.innerHTML = `<metafor-test-2></metafor-test-2>`

    const meta = MetaFor("test-2")
      .states("ОЖИДАНИЕ", "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
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
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{state: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА", when: {isSpacePressed: true}}]
        },
        {
          from: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА",
          action: ({core}) => {
            core.handleKeyDown("Space")
          },
          to: [{state: "ОЖИДАНИЕ", when: {isSpacePressed: false}}]
        }
      ])
      .create({state: "ОЖИДАНИЕ"})
    meta.update({isSpacePressed: true})
    expect(meta.context.isSpacePressed).toBe(true)
  })
  test("Доступ внутри ядра ко всем входящим в состав meta функциям и объектам", () => {
    document.body.innerHTML = `<metafor-test-3></metafor-test-3>`

    const meta = MetaFor("test-3")
      .states("ОЖИДАНИЕ", "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
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
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{state: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА", when: {isSpacePressed: true}}]
        },
        {
          from: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА",
          action: ({core}) => {
            core.handleKeyDown("Space")
          },
          to: [{state: "ОЖИДАНИЕ", when: {isSpacePressed: false}}]
        }
      ])
      .create({state: "ОЖИДАНИЕ"})
    meta.update({isSpacePressed: true})
    expect(meta.context.isSpacePressed).toBe(true)
  })

  test("Доступ внутри ядра к контексту meta", () => {
    document.body.innerHTML = `<metafor-test-4></metafor-test-4>`

    const meta = MetaFor("test-4")
      .states("ОЖИДАНИЕ", "ПАРАМЕТР ОБНОВЛЕН")
      .context(({number}) => ({
        parameter: number({default: 0}),
        other: number({default: 1})
      }))
      .core(({context, update, self}) => ({
        parameter: context.parameter,
        updateOther: () => update({other: self.parameter})
      }))
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{state: "ПАРАМЕТР ОБНОВЛЕН", when: {other: 1}}]
        },
        {
          from: "ПАРАМЕТР ОБНОВЛЕН",
          action: ({core}) => core.updateOther(),
          to: [{state: "ОЖИДАНИЕ", when: {other: 0}}]
        }
      ])
      .create({state: "ОЖИДАНИЕ"})
    expect(meta.context.other).toBe(0)
  })
})

describe("core", () => {
  describe("Взаимодействие с общими данными через core", () => {
    test("Данные в core доступны для модификации без замены", () => {
      document.body.innerHTML = `<metafor-test-5></metafor-test-5>`

      const sharedArray: object[] = []
      const meta = MetaFor("test-5")
        .states("INITIAL", "MODIFIED")
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
        .transitions([
          {
            from: "INITIAL",
            action: ({core}) => {
              core.addData(42)
            },
            to: [{state: "MODIFIED", when: {isUpdated: true}}],
          },
        ])
        .create({state: "INITIAL"})

      expect(meta.context.isUpdated).toBe(true)
      expect(meta.state).toBe("MODIFIED")
      expect(sharedArray).toEqual([42])
    })
  })

  describe("обновление ядра внутри через self ", () => {
    test("обновление ядра внутри через self", () => {
      document.body.innerHTML = `<metafor-test-7></metafor-test-7>`

      const meta = MetaFor("test-7")
        .states("INITIAL", "UPDATED")
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
        .transitions([
          {
            from: "INITIAL",
            action: ({core}) => core.update(),
            to: [{state: "UPDATED", when: {coreParameter: null}}]
          }
        ])
        .create({state: "INITIAL"})
      expect(meta.context.coreParameter).toEqual(1)
    })
  })
})
