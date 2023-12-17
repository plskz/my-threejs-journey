import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'lil-gui'

// debug
const gui = new GUI()

window.addEventListener('keydown', (event) => {
  if (event.key === 'h') gui.show(gui._hidden)
})

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Resize
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

// Scene
const scene = new THREE.Scene()

// Environment map
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
})

// Textures
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
  './textures/door/ambientOcclusion.jpg'
)
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('./textures/matcaps/8.png')
const gradientTexture = textureLoader.load('./textures/gradients/5.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

// Objects
// // MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial({
//   // color: 'green',
//   // map: doorColorTexture,
//   // wireframe: true,
//   transparent: true,
//   // opacity: 0.5,
//   // side: THREE.DoubleSide,
//   alphaMap: doorAlphaTexture
// })

// // MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial({
//   // flatShading: true,
// })

// // MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial({
//   matcap: matcapTexture,
// })

// // MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial()

// // MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial()

// // MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial({
//   shininess: 100,
//   specular: 0x1188ff,
// })

// // MeshToonMaterial
// const material = new THREE.MeshToonMaterial({
//   gradientMap: gradientTexture,
// })
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false

// // MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial()
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.metalness = 1
// material.roughness = 1
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

/**
 * MeshPhysicalMaterial
 */
const material = new THREE.MeshPhysicalMaterial()
material.metalness = 0
material.roughness = 0
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

// Clearcoat
material.clearcoat = 1
material.clearcoatRoughness = 0
const clearCoatFolder = gui.addFolder('Clearcoat')
clearCoatFolder.add(material, 'clearcoat').min(0).max(1).step(0.0001)
clearCoatFolder.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001)

// Sheen
material.sheen = 1
material.sheenRoughness = 0.25
material.sheenColor.set(1, 1, 1)
const sheenFolder = gui.addFolder('Sheen')
sheenFolder.add(material, 'sheen').min(0).max(1).step(0.0001)
sheenFolder.add(material, 'sheenRoughness').min(0).max(1).step(0.0001)
sheenFolder.addColor(material, 'sheenColor')

// Iridescence
material.iridescence = 1
material.iridescenceIOR = 1
material.iridescenceThicknessRange = [ 100, 800 ]
const iridescenceFolder = gui.addFolder('Iridescence')
iridescenceFolder.add(material, 'iridescence').min(0).max(1).step(0.0001)
iridescenceFolder.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001)
iridescenceFolder.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
iridescenceFolder.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1)

// Transmission
material.transmission = 1
material.ior = 1.5
material.thickness = 0.5
const transmissionFolder = gui.addFolder('Transmission')
transmissionFolder.add(material, 'transmission').min(0).max(1).step(0.0001)
transmissionFolder.add(material, 'ior').min(1).max(10).step(0.0001)
transmissionFolder.add(material, 'thickness').min(0).max(1).step(0.0001)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material)
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
)

sphere.position.x = -1.5
plane.position.x = 0
torus.position.x = 1.5

scene.add(sphere, plane, torus)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 0, 3)
scene.add(camera)

// Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.set(2, 3, 4)
// scene.add(pointLight)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  plane.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = -0.15 * elapsedTime
  plane.rotation.x = -0.15 * elapsedTime
  torus.rotation.x = -0.15 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
