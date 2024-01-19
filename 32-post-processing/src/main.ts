import './style.css'
import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import {
  DotScreenPass,
  EffectComposer,
  GammaCorrectionShader,
  GlitchPass,
  RGBShiftShader,
  RenderPass,
  SMAAPass,
  ShaderPass,
} from 'three/examples/jsm/Addons.js'

import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 2.5
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
])

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(2, 2, 2)
  gltf.scene.rotation.y = Math.PI * 0.5
  scene.add(gltf.scene)

  updateAllMaterials()
})

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, -2.25)
scene.add(directionalLight)

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

  // Update effect composer
  effectComposer.setSize(sizes.width, sizes.height)
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
camera.position.set(4, 1, -4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Post processing
 */
const renderTarget = new THREE.WebGLRenderTarget(600, 800, {
  samples: renderer.getPixelRatio() === 1 ? 2 : 0,
})

const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setSize(sizes.width, sizes.height)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

const glitchPass = new GlitchPass()
glitchPass.enabled = true
effectComposer.addPass(glitchPass)

const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
gammaCorrectionPass.enabled = true
effectComposer.addPass(gammaCorrectionPass)

// SMAA pass
if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
  const smaaPass = new SMAAPass(sizes.width, sizes.height)
  effectComposer.addPass(smaaPass)

  console.log('Using SMAA')
}

// Debug
const dotScreenPassFolder = gui.addFolder('DotScreenPass')
dotScreenPassFolder.add(dotScreenPass, 'enabled')

const glitchPassFolder = gui.addFolder('GlitchPass')
glitchPassFolder.add(glitchPass, 'goWild')
glitchPassFolder.add(glitchPass, 'enabled')

const rgbShiftPassFolder = gui.addFolder('RGBShiftPass')
rgbShiftPassFolder.add(rgbShiftPass, 'enabled')

const gammaCorrectionPassFolder = gui.addFolder('GammaCorrectionPass')
gammaCorrectionPassFolder.add(gammaCorrectionPass, 'enabled')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  // renderer.render(scene, camera)
  effectComposer.render()

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
