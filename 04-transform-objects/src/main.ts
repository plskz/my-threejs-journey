import './style.css'
import * as THREE from 'three'

const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

// Objects
const group = new THREE.Group()
group.position.y = 1
group.scale.y = 2
group.rotation.y = 1
scene.add(group)

const geometry = new THREE.BoxGeometry(1, 1, 1)

const cube1 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: 'red' })
)
group.add(cube1)

const cube2 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: 'green' })
)
cube2.position.x = -2
group.add(cube2)

const cube3 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: 'blue' })
)
cube3.position.x = 2
group.add(cube3)

// Axes helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

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

renderer.render(scene, camera)
