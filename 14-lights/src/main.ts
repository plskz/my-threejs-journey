import './style.css'
import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';


import { gsap } from 'gsap'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()
const folderAmbientLight = gui.addFolder('Ambient Light').close()
const folderDirectionalLight = gui.addFolder('Directional Light').close()
const folderHemisphereLight = gui.addFolder('Hemisphere Light').close()
const folderPointLight = gui.addFolder('Point Light').close()
const folderRectAreaLight = gui.addFolder('Rect Area Light').close()
const folderSpotLight = gui.addFolder('Spot Light').close()

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
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
scene.add(ambientLight)
folderAmbientLight.add(ambientLight, 'visible')
folderAmbientLight.add(ambientLight, 'intensity').min(0).max(10).step(0.001)
folderAmbientLight.addColor(ambientLight, 'color')

// Directional light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)
folderDirectionalLight.add(directionalLight, 'visible')
folderDirectionalLight.add(directionalLight, 'intensity').min(0).max(10).step(0.001)
folderDirectionalLight.addColor(directionalLight, 'color')
const nestedFolderDirectionalLightPosition = folderDirectionalLight.addFolder('Position')
nestedFolderDirectionalLightPosition.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('position.x')
nestedFolderDirectionalLightPosition.add(directionalLight.position, 'y').min(-10).max(10).step(0.001).name('position.y')
nestedFolderDirectionalLightPosition.add(directionalLight.position, 'z').min(-10).max(10).step(0.001).name('position.z')
const nestedFolderDirectionalLightTargetPosition = folderDirectionalLight.addFolder('Target Position')
nestedFolderDirectionalLightTargetPosition.add(directionalLight.target.position, 'x').min(-10).max(10).step(0.001).name('target.position.x')
nestedFolderDirectionalLightTargetPosition.add(directionalLight.target.position, 'y').min(-10).max(10).step(0.001).name('target.position.y')
nestedFolderDirectionalLightTargetPosition.add(directionalLight.target.position, 'z').min(-10).max(10).step(0.001).name('target.position.z')

// Hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9)
scene.add(hemisphereLight)
folderHemisphereLight.add(hemisphereLight, 'visible')
folderHemisphereLight.add(hemisphereLight, 'intensity').min(0).max(10).step(0.001)
folderHemisphereLight.addColor(hemisphereLight, 'color')
folderHemisphereLight.addColor(hemisphereLight, 'groundColor')
const nestedFolderHemisphereLightPosition = folderHemisphereLight.addFolder('Position')
nestedFolderHemisphereLightPosition.add(hemisphereLight.position, 'x').min(-10).max(10).step(0.001).name('position.x')
nestedFolderHemisphereLightPosition.add(hemisphereLight.position, 'y').min(-10).max(10).step(0.001).name('position.y')
nestedFolderHemisphereLightPosition.add(hemisphereLight.position, 'z').min(-10).max(10).step(0.001).name('position.z')

// Point light
const pointLight = new THREE.PointLight(0xff9000, 1.5)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)
folderPointLight.add(pointLight, 'visible')
folderPointLight.add(pointLight, 'intensity').min(0).max(10).step(0.001)
folderPointLight.addColor(pointLight, 'color')
folderPointLight.add(pointLight, 'distance').min(0).max(10).step(0.001)
folderPointLight.add(pointLight, 'decay').min(0).max(10).step(0.001)
const nestedFolderPointLightPosition = folderPointLight.addFolder('Position').close()
nestedFolderPointLightPosition.add(pointLight.position, 'x').min(-10).max(10).step(0.001).name('position.x')
nestedFolderPointLightPosition.add(pointLight.position, 'y').min(-10).max(10).step(0.001).name('position.y')
nestedFolderPointLightPosition.add(pointLight.position, 'z').min(-10).max(10).step(0.001).name('position.z')

// Rect area light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
scene.add(rectAreaLight)
folderRectAreaLight.add(rectAreaLight, 'visible')
folderRectAreaLight.add(rectAreaLight, 'intensity').min(0).max(10).step(0.001)
folderRectAreaLight.addColor(rectAreaLight, 'color')
folderRectAreaLight.add(rectAreaLight, 'width').min(0).max(10).step(0.001)
folderRectAreaLight.add(rectAreaLight, 'height').min(0).max(10).step(0.001)
const nestedFolderRectAreaLightPosition = folderRectAreaLight.addFolder('Position').close()
nestedFolderRectAreaLightPosition.add(rectAreaLight.position, 'x').min(-10).max(10).step(0.001).name('position.x')
nestedFolderRectAreaLightPosition.add(rectAreaLight.position, 'y').min(-10).max(10).step(0.001).name('position.y')
nestedFolderRectAreaLightPosition.add(rectAreaLight.position, 'z').min(-10).max(10).step(0.001).name('position.z')
rectAreaLight.rotation.x = -Math.PI * 0.25

// Spot light
const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
spotLight.target.position.x = -0.75
scene.add(spotLight.target)
folderSpotLight.add(spotLight, 'visible')
folderSpotLight.add(spotLight, 'intensity').min(0).max(10).step(0.001)
folderSpotLight.addColor(spotLight, 'color')
folderSpotLight.add(spotLight, 'distance').min(0).max(10).step(0.001)
folderSpotLight.add(spotLight, 'decay').min(0).max(10).step(0.001)
folderSpotLight.add(spotLight, 'penumbra').min(0).max(10).step(0.001)
folderSpotLight.add(spotLight, 'angle').min(0).max(10).step(0.001)
const nestedFolderSpotLightPosition = folderSpotLight.addFolder('Position').close()
nestedFolderSpotLightPosition.add(spotLight.position, 'x').min(-10).max(10).step(0.001).name('position.x')
nestedFolderSpotLightPosition.add(spotLight.position, 'y').min(-10).max(10).step(0.001).name('position.y')
nestedFolderSpotLightPosition.add(spotLight.position, 'z').min(-10).max(10).step(0.001).name('position.z')
const nestedFolderSpotLightTargetPosition = folderSpotLight.addFolder('Target Position').close()
nestedFolderSpotLightTargetPosition.add(spotLight.target.position, 'x').min(-10).max(10).step(0.001).name('target.position.x')
nestedFolderSpotLightTargetPosition.add(spotLight.target.position, 'y').min(-10).max(10).step(0.001).name('target.position.y')
nestedFolderSpotLightTargetPosition.add(spotLight.target.position, 'z').min(-10).max(10).step(0.001).name('target.position.z')

// Light Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.1)
scene.add(hemisphereLightHelper)
folderHemisphereLight.add(hemisphereLightHelper, 'visible').name('helper')

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.1)
scene.add(directionalLightHelper)
folderDirectionalLight.add(directionalLightHelper, 'visible').name('helper')

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1)
scene.add(pointLightHelper)
folderPointLight.add(pointLightHelper, 'visible').name('helper')

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
folderSpotLight.add(spotLightHelper, 'visible').name('helper')

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)
folderRectAreaLight.add(rectAreaLightHelper, 'visible').name('helper')

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
)
sphere.position.x = -1.5

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75),
  material
)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.set(1, 1, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()

  // Update helpers
  hemisphereLightHelper.update()
  directionalLightHelper.update()
  pointLightHelper.update()
  spotLightHelper.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
