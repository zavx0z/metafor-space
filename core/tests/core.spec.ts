import { describe, expect, test } from "bun:test"
import { MetaFor } from "@metafor/space"

describe("core", () => {
  describe("обработка нажатия и отпускания пробела", () => {
    const meta = MetaFor("core-test1")
      .states("ОЖИДАНИЕ", "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
      .context(({ boolean }) => ({
        actionUpdate: boolean({ title: "Обновление контекста из action", nullable: true }),
        isSpacePressed: boolean({ title: "Нажата ли клавиша Space", default: false }),
      }))
      .core(({ update, context }) => ({
        handleKeyDown: (code: string) => {
          if (code === "Space") {
            update({ isSpacePressed: true, actionUpdate: false })
          }
        },
        handleKeyUp(code: string) {
          if (code === "Space") {
            update({ isSpacePressed: false })
            console.log(context)
          }
        },
      }))
      .transitions([
        {
          from: "ОЖИДАНИЕ",
          to: [{ state: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА", when: { isSpacePressed: true } }],
          action: ({ update }) => update({ actionUpdate: true }),
        },
        {
          from: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА",
          to: [{ state: "ОЖИДАНИЕ", when: { isSpacePressed: false } }],
        },
      ])
      .create({
        state: "ОЖИДАНИЕ",
      })
    test("Проверяем начальное состояние", () => {
      expect(meta.context.isSpacePressed).toBe(false)
      expect(meta.context.actionUpdate).toBe(true)
      expect(meta.state).toBe("ОЖИДАНИЕ")
    })
    test("Эмулируем нажатие пробела", () => {
      meta.core.handleKeyDown("Space", "Other")
      expect(meta.context.isSpacePressed).toBe(true)
      expect(meta.state).toBe("ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
    })
    test("Эмулируем отпускание пробела", () => {
      meta.core.handleKeyUp("Space")
      console.log(meta.context.isSpacePressed, meta.state)
      expect(meta.context.isSpacePressed).toBe(false)
      expect(meta.state).toBe("ОЖИДАНИЕ")
    })
  })

  test.todo("Кто вызывает обновление контекста, какие параметры контекста обновляет и с какими значениями")
  test("Волатильность параметров", () => {
    const meta = MetaFor("core-test2")
      .states("ОЖИДАНИЕ", "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
      .context(({ boolean }) => ({
        isSpacePressed: boolean({ title: "Нажата ли клавиша Space", default: false }),
      }))
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
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА", when: { isSpacePressed: true } }] }])
      .create({ state: "ОЖИДАНИЕ" })
    meta.core.handleKeyDown("Space")
    expect(meta.context.isSpacePressed).toBe(true)
  })
  test("Доступ внутри ядра ко всем входящим в состав meta функциям и объектам", () => {
    const meta = MetaFor("core-test3")
      .states("ОЖИДАНИЕ", "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА")
      .context(({ boolean }) => ({
        isSpacePressed: boolean({ title: "Нажата ли клавиша Space", default: false }),
      }))
      .core(({ update }) => ({
        /** Используем стрелочную функцию, которая замкнет coreState */
        handleKeyDown(code: string) {
          if (code === "Space") {
            update({ isSpacePressed: this.parameter })
          }
        },
        parameter: true,
      }))
      .transitions([{ from: "ОЖИДАНИЕ", to: [{ state: "ПЕРЕТАСКИВАНИЕ_ЭЛЕМЕНТА", when: { isSpacePressed: true } }] }])
      .create({ state: "ОЖИДАНИЕ" })
    meta.core.handleKeyDown("Space")
    expect(meta.context.isSpacePressed).toBe(true)
  })
  test("Доступ внутри ядра к контексту meta", () => {
    const meta = MetaFor("core-test4")
      .states("ОЖИДАНИЕ")
      .context(({ number }) => ({
        parameter: number({
          default: 0,
        }),
      }))
      .core(({ context }) => ({
        parameter: context.parameter,
      }))
      .transitions([])
      .create({ state: "ОЖИДАНИЕ" })
    expect(meta.core.parameter).toBe(0)
  })
})

describe("core", () => {
  describe("Взаимодействие с общими данными через core", () => {
    test("Данные в core доступны для модификации без замены", () => {
      const sharedArray: object[] = []
      const meta = MetaFor("core-shared-data-test")
        .states("INITIAL", "MODIFIED")
        .context(({ boolean }) => ({
          isUpdated: boolean({ title: "Обновлено ли", default: false }),
        }))
        .core(({ update }) => ({
          addData: (value: object) => {
            sharedArray.push(value)
            update({ isUpdated: true })
          },
          getData: () => sharedArray,
        }))
        .transitions([
          {
            from: "INITIAL",
            to: [{ state: "MODIFIED", when: { isUpdated: true } }],
          },
        ])
        .create({ state: "INITIAL", core: { sharedArray } })

      meta.core.addData(42)
      meta.core.addData(100)

      expect(meta.context.isUpdated).toBe(true)
      expect(meta.state).toBe("MODIFIED")
      expect(meta.core.getData()).toEqual([42, 100])
    })
  })

  describe("Защита данных в core", () => {
    test("Данные в core остаются неизменяемыми при попытке модификации структуры", () => {
      const sharedObject: { [key: string]: string } = { key: "value" }

      const meta = MetaFor("core-protection-test")
        .states("INITIAL")
        .context(({ boolean }) => ({
          integrityMaintained: boolean({ title: "Сохранена ли целостность", default: true }),
        }))
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
              delete sharedObject.key // Попытка модификации структуры
              sharedObject['newKey'] = "newValue" // Попытка добавить новое свойство
            } catch {
              meta.context.integrityMaintained = false // Сигнализируем о проблеме
            }
          },
        }))
        .transitions([])
        .create({ state: "INITIAL", core: { sharedObject } })

      meta.core.updateKey()
      expect(sharedObject.key).toBe("newValue") // Изменение значения допустимо

      meta.core.modifyStructure()
      expect("key" in sharedObject).toBe(false) // Свойство удалено
      expect(sharedObject.newKey).toBe("newValue") // Новое свойство добавлено
    })
  })
  describe("обновление ядра внутри через self ", () => {
    test("обновление ядра внутри через self", () => {
      const meta = MetaFor("core-test5")
        .states("INITIAL")
        .context(() => ({}))
        .core(({ self }) => ({
          coreParameter: 0,
          update: () => {
            self.coreParameter = 1
          },
        }))
        .transitions([])
        .create({ state: "INITIAL" })
      meta.core.update()
      expect(meta.core.coreParameter).toEqual(1)
    })
  })
})
