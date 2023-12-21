import './style.css'
import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// import { gsap } from 'gsap'
import GUI from 'lil-gui'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// bakedShadow.jpg
// const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
// bakedShadow.colorSpace = THREE.SRGBColorSpace

// simpleShadow.jpg
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')
simpleShadow.colorSpace = THREE.SRGBColorSpace

/**
 * Base
 */
// Debug
const gui = new GUI()

window.addEventListener('keydown', (event) => {
  if (event.key === 'h') gui.show(gui._hidden)
})

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
const folderAmbientLight = gui.addFolder('Ambient Light')
folderAmbientLight.add(ambientLight, 'visible')
folderAmbientLight.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(2, 2, -1)
const folderDirectionalLight = gui.addFolder('Directional Light')
folderDirectionalLight.add(directionalLight, 'visible')
folderDirectionalLight
  .add(directionalLight, 'intensity')
  .min(0)
  .max(3)
  .step(0.001)
folderDirectionalLight
  .add(directionalLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.001)
folderDirectionalLight
  .add(directionalLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.001)
folderDirectionalLight
  .add(directionalLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.001)
scene.add(directionalLight)

directionalLight.castShadow = true
directionalLight.shadow.mapSize.setScalar(1024)
// amplitude
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
// near and far
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

// won't work if the renderer.shadowMap.type is set to THREE.PCFSoftShadowMap
// directionalLight.shadow.radius = 10

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
)
directionalLightCameraHelper.visible = false
folderDirectionalLight
  .add(directionalLightCameraHelper, 'visible')
  .name('directionalLightHelper')
scene.add(directionalLightCameraHelper)

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.shadow.mapSize.setScalar(1024)
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

spotLight.position.set(0, 2, 2)
scene.add(spotLight, spotLight.target)

const folderSpotLight = gui.addFolder('Spot Light')
folderSpotLight.add(spotLight, 'visible')
folderSpotLight.add(spotLight, 'intensity').min(0).max(3).step(0.001)
folderSpotLight.add(spotLight.position, 'x').min(-5).max(5).step(0.001)
folderSpotLight.add(spotLight.position, 'y').min(-5).max(5).step(0.001)
folderSpotLight.add(spotLight.position, 'z').min(-5).max(5).step(0.001)
folderSpotLight
  .add(spotLight, 'angle')
  .min(0)
  .max(Math.PI / 2)
  .step(0.001)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)
folderSpotLight.add(spotLightCameraHelper, 'visible').name('spotLightHelper')

// Point light
const pointLight = new THREE.PointLight(0xffffff, 2.7)
pointLight.castShadow = true
pointLight.shadow.mapSize.setScalar(1024)
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

pointLight.position.set(-1, 1, 0)
scene.add(pointLight)

const folderPointLight = gui.addFolder('Point Light')
folderPointLight.add(pointLight, 'visible')
folderPointLight.add(pointLight, 'intensity').min(0).max(3).step(0.001)
folderPointLight.add(pointLight.position, 'x').min(-5).max(5).step(0.001)
folderPointLight.add(pointLight.position, 'y').min(-5).max(5).step(0.001)
folderPointLight.add(pointLight.position, 'z').min(-5).max(5).step(0.001)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)
folderPointLight.add(pointLightCameraHelper, 'visible').name('pointLightHelper')

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
const folderMaterial = gui.addFolder('Material')
folderMaterial.add(material, 'metalness').min(0).max(1).step(0.001)
folderMaterial.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
// sphere geometry
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
const folderSphere = gui.addFolder('Sphere')
folderSphere.add(sphere.position, 'x').min(-5).max(5).step(0.001)
folderSphere.add(sphere.position, 'y').min(-5).max(5).step(0.001)
folderSphere.add(sphere.position, 'z').min(-5).max(5).step(0.001)

sphere.castShadow = true

// plane geometry
// new THREE.MeshBasicMaterial({ map: bakedShadow })
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5
plane.receiveShadow = true

// sphere geometry (used for the shadow)
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  })
)

sphereShadow.rotation.x = -Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

scene.add(sphere, plane, sphereShadow)

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
camera.position.set(4, 3.7, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true // note: set this to true to enable shadow
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update sphere

  // orbit
  sphere.position.x = Math.cos(elapsedTime) * 1.5
  sphere.position.z = Math.sin(elapsedTime) * 1.5

  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3)) // bounce effect

  // Update shadow
  sphereShadow.position.x = sphere.position.x
  sphereShadow.position.z = sphere.position.z
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
