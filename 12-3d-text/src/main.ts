import './style.css'
import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

// import { gsap } from 'gsap'
import { GUI } from 'lil-gui'

// Debug
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
const donutGroup = new THREE.Group()
scene.add(donutGroup)

// Axes helper
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
gui.add(axesHelper, 'visible').name('AxesHelper')

// Textures
const textureLoader = new THREE.TextureLoader()
const matcapTextures: THREE.Texture[] = []

for (let i = 1; i <= 10; i++) {
  const texture = textureLoader.load(`/textures/matcaps/${i}.png`)
  texture.colorSpace = THREE.SRGBColorSpace
  matcapTextures.push(texture)
}

// Fonts
const fontLoader = new FontLoader()

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Hello Three.js', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  })
  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTextures[0],
  })
  // textGeometry.computeBoundingBox()
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
  //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
  //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5 // Subtract bevel thickness
  // )
  textGeometry.center() // same above but better

  const text = new THREE.Mesh(textGeometry, textMaterial)
  scene.add(text)

  // controls for textGeometry
  gui.add(text, 'visible').name('TextGeometry')
  const folderTextGeometry = gui.addFolder('Position')
  folderTextGeometry.add(text.position, 'x').min(-3).max(3).step(0.01).name('x').name('position.x')
  folderTextGeometry.add(text.position, 'y').min(-3).max(3).step(0.01).name('y').name('position.y')
  folderTextGeometry.add(text.position, 'z').min(-3).max(3).step(0.01).name('z').name('position.z')
  const folderTextGeometryRotation = gui.addFolder('Rotation')
  folderTextGeometryRotation.add(text.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.01).name('x').name('rotation.x')
  folderTextGeometryRotation.add(text.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('y').name('rotation.y')
  folderTextGeometryRotation.add(text.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.01).name('z').name('rotation.z')
  const folderTextGeometryScale = gui.addFolder('Scale')
  folderTextGeometryScale.add(text.scale, 'x').min(0).max(3).step(0.01).name('x').name('scale.x')
  folderTextGeometryScale.add(text.scale, 'y').min(0).max(3).step(0.01).name('y').name('scale.y')
  folderTextGeometryScale.add(text.scale, 'z').min(0).max(3).step(0.01).name('z').name('scale.z')
})

// Donuts
type Donut = {
  object: THREE.Mesh<THREE.TorusGeometry, THREE.MeshMatcapMaterial>
  speed: number
}

const donuts: Donut[] = []
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const donutMaterials: THREE.MeshMatcapMaterial[] = []

for (let i = 0; i < 10; i++) {
  donutMaterials.push(
    new THREE.MeshMatcapMaterial({ matcap: matcapTextures[i] })
  )
}

for (let i = 0; i < 400; i++) {
  const donut = new THREE.Mesh(
    donutGeometry,
    donutMaterials[Math.floor(Math.random() * donutMaterials.length)]
  )
  donutGroup.add(donut)

  donut.position.x = (Math.random() - 0.5) * 10
  donut.position.y = (Math.random() - 0.5) * 10
  donut.position.z = (Math.random() - 0.5) * 10

  donut.rotation.x = Math.random() * Math.PI
  donut.rotation.y = Math.random() * Math.PI

  donut.scale.setScalar(Math.random())

  donuts.push({ object: donut, speed: Math.random() })
}

gui.add(donutGroup, 'visible').name('Donuts')

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 0, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 1.5
controls.maxDistance = 20

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

console.log(donuts)

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  donuts.forEach((donut: Donut) => {
    const speed = elapsedTime * donut.speed
    donut.object.rotation.set(speed, speed, 0)
  })

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
