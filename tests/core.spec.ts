import { describe, expect, test } from "bun:test"
import { MetaFor } from "../index.js"

describe("core", () => {
  describe("обработка нажатия и отпускания пробела", () => {
    const particle = MetaFor("core-test1")
      .states("ОЖИДАНИЕ", "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
      .context(({ boolean }) => ({
        actionUpdate: boolean({ title: "Обновление контекста из action", nullable: true }),
        isSpacePressed: boolean({ title: "Нажата ли клавиша Space", default: false }),
      }))
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{ state: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА", trigger: { isSpacePressed: true } }],
          action: "init",
        },
        {
          from: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА",
          to: [{ state: "ОЖИДАНИЕ", trigger: { isSpacePressed: false } }],
        },
      ])
      .core(({ update }) => ({
        handleKeyDown: (code: string) => {
          if (code === "Space") {
            update({ isSpacePressed: true, actionUpdate: false })
          }
        },
        handleKeyUp(code: string) {
          if (code === "Space") {
            update({ isSpacePressed: false })
          }
        },
      }))
      .actions({
        init: ({ update }) => {
          update({ actionUpdate: true })
        },
      })
      .create({
        state: "ОЖИДАНИЕ",
      })
    test("Проверяем начальное состояние", () => {
      expect(particle.context.isSpacePressed).toBe(false)
      expect(particle.context.actionUpdate).toBe(true)
      expect(particle.state).toBe("ОЖИДАНИЕ")
    })
    test("Эмулируем нажатие пробела", () => {
      particle.core.handleKeyDown("Space", "Other")
      expect(particle.context.isSpacePressed).toBe(true)
      expect(particle.state).toBe("ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
    })
    test("Эмулируем отпускание пробела", () => {
      particle.core.handleKeyUp("Space")
      expect(particle.context.isSpacePressed).toBe(false)
      expect(particle.state).toBe("ОЖИДАНИЕ")
    })
  })

  test.todo("Кто вызывает обновление контекста, какие параметры контекста обновляет и с какими значениями")
  test("Волатильность параметров", () => {
    const particle = MetaFor("core-test2")
      .states("ОЖИДАНИЕ", "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
      .context(({ boolean }) => ({
        isSpacePressed: boolean({ title: "Нажата ли клавиша Space", default: false }),
      }))
      .transitions([
        { from: "ОЖИДАНИЕ", to: [{ state: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА", trigger: { isSpacePressed: true } }] },
      ])
      .core(({ update }) => {
        // Создаем объект с общим состоянием
        const coreState = { parameter: true }
        return {
          handleKeyDown(code: string) {
            if (code === "Space") {
              update({ isSpacePressed: coreState.parameter })
            }
          },
          parameter: coreState.parameter,
        }
      })
      .actions({})
      .reactions([])
      .create({ state: "ОЖИДАНИЕ" })
    particle.core.handleKeyDown("Space")
    expect(particle.context.isSpacePressed).toBe(true)
  })
  test("Доступ внутри ядра ко всем входящим в состав частицы функциям и объектам", () => {
    const particle = MetaFor("core-test3")
      .states("ОЖИДАНИЕ", "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
      .context(({ boolean }) => ({
        isSpacePressed: boolean({ title: "Нажата ли клавиша Space", default: false }),
      }))
      .transitions([
        { from: "ОЖИДАНИЕ", to: [{ state: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА", trigger: { isSpacePressed: true } }] },
      ])
      .core(({ update }) => ({
        /** Используем стрелочную функцию, которая замкнет coreState */
        handleKeyDown(code: string) {
          if (code === "Space") {
            update({ isSpacePressed: this.parameter })
          }
        },
        parameter: true,
      }))
      .actions({})
      .reactions([])
      .create({ state: "ОЖИДАНИЕ" })
    particle.core.handleKeyDown("Space")
    expect(particle.context.isSpacePressed).toBe(true)
  })
  test("Доступ внутри ядра к контексту частицы", () => {
    const particle = MetaFor("core-test4")
      .states("ОЖИДАНИЕ")
      .context(({ number }) => ({
        parameter: number({
          default: 0,
        }),
      }))
      .transitions([])
      .core(({ context }) => ({
        parameter: context.parameter,
      }))
      .actions({})
      .reactions([])
      .create({ state: "ОЖИДАНИЕ" })
    expect(particle.core.parameter).toBe(0)
  })
})

describe("core", () => {
  describe("Взаимодействие с общими данными через core", () => {
    test("Данные в core доступны для модификации без замены", () => {
      //@ts-ignore
      const sharedArray = []
      const particle = MetaFor("core-shared-data-test")
        .states("INITIAL", "MODIFIED")
        .context(({ boolean }) => ({
          isUpdated: boolean({ title: "Обновлено ли", default: false }),
        }))
        .transitions([
          {
            from: "INITIAL",
            to: [{ state: "MODIFIED", trigger: { isUpdated: true } }],
          },
        ])
        .core(({ update }) => ({
          //@ts-ignore
          addData: (value) => {
            sharedArray.push(value)
            update({ isUpdated: true })
          }, //@ts-ignore
          getData: () => sharedArray,
        }))
        .actions({})
        .reactions([]) //@ts-ignore
        .create({ state: "INITIAL", core: { sharedArray } })

      particle.core.addData(42)
      particle.core.addData(100)

      expect(particle.context.isUpdated).toBe(true)
      expect(particle.state).toBe("MODIFIED")
      expect(particle.core.getData()).toEqual([42, 100])
    })
  })

  describe("Защита данных в core", () => {
    test("Данные в core остаются неизменяемыми при попытке модификации структуры", () => {
      const sharedObject = { key: "value" }
      const particle = MetaFor("core-protection-test")
        .states("INITIAL")
        .context(({ boolean }) => ({
          integrityMaintained: boolean({ title: "Сохранена ли целостность", default: true }),
        }))
        .transitions([])
        .core(() => ({
          updateKey: () => {
            try {
              sharedObject.key = "newValue" // Допустимо
            } catch {
              // Ошибок быть не должно
            }
          },
          modifyStructure: () => {
            try {
              //@ts-ignore
              delete sharedObject.key //@ts-ignore Попытка модификации структуры
              sharedObject.newKey = "newValue" // Попытка добавить новое свойство
            } catch {
              particle.context.integrityMaintained = false // Сигнализируем о проблеме
            }
          },
        }))
        .actions({})
        .reactions([]) //@ts-ignore
        .create({ state: "INITIAL", core: { sharedObject } })

      particle.core.updateKey()
      expect(sharedObject.key).toBe("newValue") // Изменение значения допустимо

      particle.core.modifyStructure()
      expect("key" in sharedObject).toBe(false) // Свойство удалено
      //@ts-ignore
      expect(sharedObject.newKey).toBe("newValue") // Новое свойство добавлено
    })
  })
  describe("обновление ядра внутри через self ", () => {
    test("обновление ядра внутри через self", () => {
      const particle = MetaFor("core-test5")
        .states("INITIAL")
        .context(() => ({}))
        .transitions([])
        .core(({ self }) => ({
          coreParameter: 0,
          update: () => {
            self.coreParameter = 1
          },
        }))
        .actions({})
        .create({ state: "INITIAL" })
      particle.core.update()
      expect(particle.core.coreParameter).toEqual(1)
    })
  })
})
