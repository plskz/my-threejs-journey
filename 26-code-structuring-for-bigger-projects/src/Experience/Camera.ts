import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Experience from './Experience'

export default class Camera {
  experience: Experience
  sizes: any
  scene: any
  canvas: HTMLElement
  instance!: THREE.PerspectiveCamera
  controls!: OrbitControls
  constructor() {
    this.experience = Experience.getInstance()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setOrbitControls()
  }

  setInstance(): THREE.PerspectiveCamera {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    )
    this.instance.position.set(6, 4, 8)
    this.scene.add(this.instance)
    return this.instance
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  updateOrbitControls() {
    this.controls.update()
  }

  destroy() {
    this.controls.dispose()
  }
}
