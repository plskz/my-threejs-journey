import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap'

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

// Textures
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => console.log('onStart')
loadingManager.onProgress = (url) => console.log('onProgress', url)
loadingManager.onLoad = () => console.log('onLoad')
loadingManager.onError = () => console.log('onError')

const textureLoader = new THREE.TextureLoader(loadingManager)
// const colorTexture = textureLoader.load('/textures/door/color.jpg')
const colorTexture = textureLoader.load('/textures/minecraft.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
colorTexture.colorSpace = THREE.SRGBColorSpace

const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3

// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.rotation = Math.PI * 0.25
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

// colorTexture.generateMipmaps = false
// colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 0, 3)
scene.add(camera)

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

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()