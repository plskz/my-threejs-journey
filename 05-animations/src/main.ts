import './style.css'
import * as THREE from 'three'
import { gsap } from 'gsap'

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 'red' })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
  width: 800,
  height: 600,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)

/** --------------------
 * Tick 1 - Using Clock
 */

const clock = new THREE.Clock()

const tick1 = () => {
  const elapsedTime = clock.getElapsedTime()

  // // Update objects
  // mesh.position.y = Math.sin(elapsedTime)
  // mesh.rotation.y = Math.sin(elapsedTime) * Math.PI * 2 // full rotation

  // circle movement
  camera.position.y = Math.sin(elapsedTime)
  camera.position.x = Math.cos(elapsedTime)

  // camera.lookAt(mesh.position)

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick1)
}
// tick1()

// --------------------

/** --------------------
 * Tick 2 - Using GSAP
 */

// using tween with delays
// const animations = [
//   { duration: 1, delay: 1, x: 2 },
//   { duration: 0.5, delay: 2, x: 0 },
//   { duration: 0.5, delay: 3, x: -2 },
//   { duration: 0.5, delay: 4, y: 1.2 },
//   { duration: 0.5, delay: 5, x: 2 },
//   { duration: 0.5, delay: 6, y: -1.2 },
//   { duration: 0.5, delay: 7, y: -1.2 },
// ]
// animations.map((animation) => gsap.to(mesh.position, animation))

// using timeline
const animations = [{ x: -2 }, { y: 1.2 }, { x: 2 }, { y: -1.2 }, { x: -2 }]
const tl = gsap.timeline({ repeat: -1, yoyo: true })
animations.map((animation) => tl.to(mesh.position, animation))
tl.to(mesh.rotation, { duration: 1.2, y: Math.PI * 2 })

const tick2 = () => {
  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick2)
}
tick2()
