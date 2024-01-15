import * as THREE from 'three'
import Experience from './Experience'

export default class Renderer {
  experience: Experience
  canvas: HTMLCanvasElement
  sizes: any
  scene: any
  camera: any
  instance!: THREE.WebGLRenderer

  constructor() {
    this.experience = Experience.getInstance()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera

    this.setInstance()
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })

    // Substitute outputEncoding = THREE.sRGBEncoding
    this.instance.outputColorSpace = THREE.SRGBColorSpace
    // Substitute usePhysicallyCorrectLights = true
    this.instance.useLegacyLights = false
    // LDR simulate HDR, toneMappingExposure required is around half of 0.147 version's value
    this.instance.toneMapping = THREE.CineonToneMapping
    this.instance.toneMappingExposure = 1.75
    // ShadowMap
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    // "BG" color
    this.instance.setClearColor('#211d20')

    this.resize()
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }

  destroy() {
    this.instance.dispose()
  }
}
