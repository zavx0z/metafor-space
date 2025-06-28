import * as THREE from 'three'

export interface ThreeProps {
  args?: any[]
  attach?: string
  position?: [number, number, number] | THREE.Vector3
  rotation?: [number, number, number] | THREE.Euler
  scale?: [number, number, number] | THREE.Vector3
  visible?: boolean
  castShadow?: boolean
  receiveShadow?: boolean
  [key: string]: any
}

export interface BaseThreePartInterface {
  type: string
  props: ThreeProps
  children: BaseThreePartInterface[]
  createObject(): THREE.Object3D | null
  addToParent(parent: THREE.Object3D): void
  renderChildren(): void
}

export interface ThreeResultInterface {
  strings: TemplateStringsArray
  values: any[]
  parse(): BaseThreePartInterface | null
}

export type ThreeTemplateFunction = (strings: TemplateStringsArray, ...values: any[]) => ThreeResultInterface

export declare const three: ThreeTemplateFunction
export declare function render3d(result: ThreeResultInterface, scene: THREE.Scene): void

export declare function createMesh(
  geometry: BaseThreePartInterface, 
  material: BaseThreePartInterface, 
  props?: ThreeProps
): BaseThreePartInterface

export declare function createGeometry(
  type: string, 
  args?: any[], 
  props?: ThreeProps
): BaseThreePartInterface

export declare function createMaterial(
  type: string, 
  props?: ThreeProps
): BaseThreePartInterface

export declare function createLight(
  type: string, 
  props?: ThreeProps
): BaseThreePartInterface

export declare function createGroup(
  children?: BaseThreePartInterface[], 
  props?: ThreeProps
): BaseThreePartInterface 