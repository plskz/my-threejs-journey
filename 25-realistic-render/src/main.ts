import './style.css'
import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader, RGBELoader } from 'three/examples/jsm/Addons.js'

import GUI from 'lil-gui'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Base
 */
// Debug
const gui = new GUI()
const global = {}

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity

      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 1
gui.add(global, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
})

/**
 * Directional light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 6)
directionalLight.position.set(-4, 6.5, 2.5)
scene.add(directionalLight)

// GUI directional light
const directionalLightFolder = gui.addFolder('directionalLight')
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
directionalLightFolder.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('lightX')
directionalLightFolder.add(directionalLight.position, 'y').min(-10).max(10).step(0.001).name('lightY')
directionalLightFolder.add(directionalLight.position, 'z').min(-10).max(10).step(0.001).name('lightZ')

// Shadow
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLightFolder.add(directionalLight, 'castShadow')

// Helper
const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightHelper)
directionalLightHelper.visible = false
directionalLightFolder.add(directionalLightHelper, 'visible').name('lightHelper')

// Target
directionalLight.target.position.set(0, 4, 0)
directionalLight.target.updateMatrixWorld()

/**
 * Models
 */
// Helmet
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(10, 10, 10)
  scene.add(gltf.scene)

  updateAllMaterials()
})

/**
 * Floor
 */
const floorTextures = {
  color: textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg'),
  normal: textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png'),
  aoRoughtnessMetalness: textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg')
}
floorTextures.color.colorSpace = THREE.SRGBColorSpace

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
      map: floorTextures.color,
      normalMap: floorTextures.normal,
      aoMap: floorTextures.aoRoughtnessMetalness,
      metalnessMap: floorTextures.aoRoughtnessMetalness,
      roughnessMap: floorTextures.aoRoughtnessMetalness,
  })
)
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

/**
 * Wall
 */
const wallTextures = {
  color: textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg'),
  normal: textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png'),
  aoRoughtnessMetalness: textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg')
}
wallTextures.color.colorSpace = THREE.SRGBColorSpace

const wall = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
      map: wallTextures.color,
      normalMap: wallTextures.normal,
      aoMap: wallTextures.aoRoughtnessMetalness,
      metalnessMap: wallTextures.aoRoughtnessMetalness,
      roughnessMap: wallTextures.aoRoughtnessMetalness,
  })
)
wall.position.set(0, 4, -4)
scene.add(wall)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Tone mapping
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3

// GUI tone mapping
const toneMappingFolder = gui.addFolder('toneMapping')
toneMappingFolder.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
})
toneMappingFolder.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
