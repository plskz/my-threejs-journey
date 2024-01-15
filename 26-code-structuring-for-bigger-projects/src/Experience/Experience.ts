import * as THREE from 'three'
import Sizes from './Utils/Sizes.ts'
import Camera from './Camera.ts'
import Renderer from './Renderer.ts'
import Time from './Utils/Time.ts'
import Debug from './Utils/Debug.ts'
import Resources from './Utils/Resources.ts'
import World from './World/World.ts'
import { sourcesData } from './sources.ts'

export default class Experience {
  private static instance: Experience
  canvas: HTMLCanvasElement
  debug: Debug
  scene: THREE.Scene
  sizes: Sizes
  camera: Camera
  time: Time
  renderer: Renderer
  resources: Resources
  world: World

  constructor(canvas: HTMLCanvasElement) {
    if (!Experience.instance) Experience.instance = this

    // @ts-ignore
    window.experience = this

    this.canvas = canvas

    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sourcesData)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    this.sizes.on('resize', () => {
      this.resize()
    })
    this.time.on('tick', () => {
      this.update()
    })
  }

  public static getInstance(canvas?: HTMLCanvasElement): Experience {
    if (!Experience.instance) {
      if (!canvas)
        throw new Error(
          'canvas not defined, check your canvas class or querySelector'
        )
      Experience.instance = new Experience(canvas as HTMLCanvasElement)
    }

    return Experience.instance
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.updateOrbitControls()
    this.world.update()
    this.renderer.update()
  }
  destroy() {
    this.sizes.off('resize')
    this.time.off('tick')
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()

        for (const key in child.material) {
          const value = child.material[key]
          if (value && typeof value.dispose == 'function') {
            value.dispose()
          }
        }
      }
    })

    this.camera.destroy()
    this.renderer.destroy()
    if (this.debug.active) {
      this.debug.destroy()
    }
  }
}
