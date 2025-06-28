import * as THREE from 'three'

/**
 * Three.js tagged template literal system based on MetaFor architecture
 * Inspired by the meta-elements prototype with Web Components approach
 */

// Символы для internal API
const ThreePart = Symbol('ThreePart')
const ThreeTemplateResult = Symbol('ThreeTemplateResult')

// Карта типов для автоматического создания Three.js объектов
const ThreeTypeMap = new Map([
  // Geometries
  ['sphereGeometry', THREE.SphereGeometry],
  ['boxGeometry', THREE.BoxGeometry],
  ['cylinderGeometry', THREE.CylinderGeometry],
  ['coneGeometry', THREE.ConeGeometry],
  ['planeGeometry', THREE.PlaneGeometry],
  ['torusGeometry', THREE.TorusGeometry],
  ['torusKnotGeometry', THREE.TorusKnotGeometry],
  
  // Materials  
  ['meshBasicMaterial', THREE.MeshBasicMaterial],
  ['meshStandardMaterial', THREE.MeshStandardMaterial],
  ['meshPhysicalMaterial', THREE.MeshPhysicalMaterial],
  ['meshLambertMaterial', THREE.MeshLambertMaterial],
  ['meshPhongMaterial', THREE.MeshPhongMaterial],
  ['lineBasicMaterial', THREE.LineBasicMaterial],
  ['lineDashedMaterial', THREE.LineDashedMaterial],
  ['pointsMaterial', THREE.PointsMaterial],
  
  // Objects
  ['mesh', THREE.Mesh],
  ['group', THREE.Group],
  ['object3D', THREE.Object3D],
  ['line', THREE.Line],
  ['lineLoop', THREE.LineLoop],
  ['lineSegments', THREE.LineSegments],
  ['points', THREE.Points],
  ['sprite', THREE.Sprite],
  
  // Lights
  ['ambientLight', THREE.AmbientLight],
  ['directionalLight', THREE.DirectionalLight],
  ['pointLight', THREE.PointLight],
  ['spotLight', THREE.SpotLight],
  ['hemisphereLight', THREE.HemisphereLight],
  ['rectAreaLight', THREE.RectAreaLight],
  
  // Cameras
  ['perspectiveCamera', THREE.PerspectiveCamera],
  ['orthographicCamera', THREE.OrthographicCamera],
  
  // Helpers
  ['axesHelper', THREE.AxesHelper],
  ['gridHelper', THREE.GridHelper],
  ['boxHelper', THREE.BoxHelper],
  ['directionalLightHelper', THREE.DirectionalLightHelper],
  ['pointLightHelper', THREE.PointLightHelper],
  ['spotLightHelper', THREE.SpotLightHelper],
  
  // Scene
  ['scene', THREE.Scene],
])

/**
 * Базовый класс для Three.js частей - аналог вашего MetaElement
 */
class BaseThreePart {
  constructor(type, props = {}, children = []) {
    this.type = type
    this.props = props
    this.children = children
    this._object = null
    this._parent = null
  }

  /**
   * Создает Three.js объект - аналог constructWrappedObject
   */
  createObject() {
    if (this._object) return this._object

    const ThreeClass = ThreeTypeMap.get(this.type)
    if (!ThreeClass) {
      console.warn(`Unknown Three.js type: ${this.type}`)
      return null
    }

    // Создаем объект с аргументами из props.args
    const args = this.props.args || []
    this._object = new ThreeClass(...args)

    // Применяем свойства - аналог applyPropWithDirective
    this.applyProps()

    return this._object
  }

  /**
   * Применяет свойства к объекту - аналог attributeChangedCallback
   */
  applyProps() {
    if (!this._object) return

    for (const [key, value] of Object.entries(this.props)) {
      if (key === 'args') continue // args уже использованы при создании
      
      this.applyProp(key, value)
    }
  }

  /**
   * Применяет одно свойство - аналог applyPropWithDirective
   */
  applyProp(key, value) {
    if (!this._object) return

    // Обработка nested свойств (position.x, rotation.y, etc.)
    if (key.includes('.')) {
      const [prop, subProp] = key.split('.')
      if (this._object[prop] && typeof this._object[prop][subProp] !== 'undefined') {
        this._object[prop][subProp] = value
        return
      }
    }

    // Специальная обработка Vector3 свойств (position, rotation, scale)
    if (['position', 'rotation', 'scale'].includes(key) && this._object[key]) {
      if (Array.isArray(value)) {
        // Если передан массив [x, y, z]
        this._object[key].set(...value)
      } else if (value && typeof value === 'object' && ('x' in value || 'y' in value || 'z' in value)) {
        // Если передан объект {x, y, z}
        if ('x' in value) this._object[key].x = value.x
        if ('y' in value) this._object[key].y = value.y
        if ('z' in value) this._object[key].z = value.z
      } else if (value && value.isVector3) {
        // Если передан Vector3
        this._object[key].copy(value)
      }
      return
    }

    // Обработка методов set (setX, setY, etc.)
    const setterName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`
    if (typeof this._object[setterName] === 'function') {
      if (Array.isArray(value)) {
        this._object[setterName](...value)
      } else {
        this._object[setterName](value)
      }
      return
    }

    // Прямое присвоение свойства
    if (key in this._object) {
      this._object[key] = value
    }
  }

  /**
   * Добавляет к родительскому объекту - аналог addObjectToParent
   */
  addToParent(parent) {
    this._parent = parent
    
    if (!this._object || !parent) return

    // Обработка attach - аналог handleAttach
    const attachProp = this.props.attach
    if (attachProp) {
      if (parent[attachProp] !== undefined) {
        parent[attachProp] = this._object
        return
      }
    }

    // Автоматический attach по типу объекта
    if (this._object.isMaterial && parent.material !== undefined) {
      parent.material = this._object
    } else if ((this._object.isGeometry || this._object.isBufferGeometry) && parent.geometry !== undefined) {
      parent.geometry = this._object
    } else if (this._object.isObject3D && parent.add) {
      parent.add(this._object)
    }
  }

  /**
   * Рендерит дочерние элементы
   */
  renderChildren() {
    if (!this._object) return

    for (const child of this.children) {
      if (child && child[ThreePart]) {
        const childObject = child.createObject()
        if (childObject) {
          child.addToParent(this._object)
          child.renderChildren()
        }
      }
    }
  }

  /**
   * Помечаем как Three.js часть
   */
  get [ThreePart]() { return true }
}

/**
 * Результат three`` template literal - аналог TemplateResult
 */
class ThreeResult {
  constructor(strings, values) {
    this.strings = strings
    this.values = values
    this._parsed = null
  }

  /**
   * Парсит template literal в дерево объектов
   */
  parse() {
    if (this._parsed) return this._parsed

    // Простой парсер для демонстрации концепции
    // В реальной реализации нужен полноценный JSX-like парсер
    let template = this.strings[0]
    
    for (let i = 0; i < this.values.length; i++) {
      template += String(this.values[i]) + this.strings[i + 1]
    }

    // Пока возвращаем простую структуру для тестирования
    this._parsed = this.parseTemplate(template)
    return this._parsed
  }

  /**
   * Упрощенный парсер template (заглушка)
   */
  parseTemplate(template) {
    // TODO: Реализовать полноценный парсер
    // Пока возвращаем простую группу
    return new BaseThreePart('group', {}, [])
  }

  get [ThreeTemplateResult]() { return true }
}

/**
 * Tagged template literal для Three.js - аналог html``
 */
export function three(strings, ...values) {
  return new ThreeResult(strings, values)
}

/**
 * Функция рендеринга Three.js в сцену - аналог render()
 */
export function render3d(result, scene) {
  if (!result || !result[ThreeTemplateResult]) {
    console.warn('Invalid three template result')
    return
  }

  if (!scene || !scene.isScene) {
    console.warn('Invalid scene provided to render3d')
    return
  }

  const parsed = result.parse()
  if (parsed && parsed[ThreePart]) {
    const object = parsed.createObject()
    if (object) {
      parsed.addToParent(scene)
      parsed.renderChildren()
    }
  }
}

/**
 * Хелперы для создания объектов в стиле React Three Fiber
 */

// Создает mesh с geometry и material
export function createMesh(geometry, material, props = {}) {
  const mesh = new BaseThreePart('mesh', props)
  mesh.children = [geometry, material].filter(Boolean)
  return mesh
}

// Создает базовую геометрию
export function createGeometry(type, args = [], props = {}) {
  return new BaseThreePart(type, { ...props, args })
}

// Создает материал
export function createMaterial(type, props = {}) {
  return new BaseThreePart(type, props)
}

// Создает свет
export function createLight(type, props = {}) {
  return new BaseThreePart(type, props)
}

// Создает группу
export function createGroup(children = [], props = {}) {
  const group = new BaseThreePart('group', props)
  group.children = children
  return group
}

// Экспорт типов для TypeScript
export { BaseThreePart, ThreeResult, ThreeTypeMap }

/**
 * Пример использования (как в вашем прототипе):
 * 
 * const scene = new THREE.Scene()
 * 
 * const cubeTemplate = three`
 *   <mesh position="${[0, 0, 0]}">
 *     <boxGeometry args="${[1, 1, 1]}" />
 *     <meshStandardMaterial color="hotpink" />
 *   </mesh>
 * `
 * 
 * render3d(cubeTemplate, scene)
 */ 