import './style.css'
import * as THREE from 'three'

import { gsap } from 'gsap'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
  materialColor: '#8349ca',
}

gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor)
  particleMaterial.color.set(parameters.materialColor)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
  side: THREE.DoubleSide,
})

// Meshes
const objectsDistance = 4

const geometries = {
  boxGeometry: new THREE.Mesh(new THREE.BoxGeometry(), material),
  capsuleGeometry: new THREE.Mesh(new THREE.CapsuleGeometry(), material),
  circleGeometry: new THREE.Mesh(new THREE.CircleGeometry(), material),
  coneGeometry: new THREE.Mesh(new THREE.ConeGeometry(), material),
  cylinderGeometry: new THREE.Mesh(new THREE.CylinderGeometry(), material),
  dodecahedronGeometry: new THREE.Mesh(new THREE.DodecahedronGeometry(), material),
  extrudeGeometry: new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0),]), { depth: 1 }), material),
  icosahedronGeometry: new THREE.Mesh(new THREE.IcosahedronGeometry(), material),
  octahedronGeometry: new THREE.Mesh(new THREE.OctahedronGeometry(), material),
  planeGeometry: new THREE.Mesh(new THREE.PlaneGeometry(), material),
  ringGeometry: new THREE.Mesh(new THREE.RingGeometry(), material),
  sphereGeometry: new THREE.Mesh(new THREE.SphereGeometry(), material),
  tetrahedronGeometry: new THREE.Mesh(new THREE.TetrahedronGeometry(), material),
  torusGeometry: new THREE.Mesh(new THREE.TorusGeometry(), material),
  torusKnotGeometry: new THREE.Mesh(new THREE.TorusKnotGeometry(), material),
}

const geometriesLength = Object.keys(geometries).length

for (let i = 0; i < geometriesLength; i++) {
  const geometry = Object.values(geometries)[i]
  geometry.scale.setScalar(0.8)
  geometry.position.y = -objectsDistance * i

  // html append section.section>h2{geometry}}
  const container = document.querySelector('.container')!
  const section = document.createElement('section')

  container.appendChild(section)
  
  const h2 = document.createElement('h2')
  h2.innerText = Object.keys(geometries)[i]
  section.appendChild(h2)

  scene.add(geometry)
}

/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
  const i3 = i * 3
  positions[i3 + 0] = (Math.random() - 0.5) * 10
  positions[i3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * geometriesLength
  positions[i3 + 2] = (Math.random() - 0.5) * 10
}

const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particleMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  size: 0.03,
  sizeAttenuation: true,
})

// Points
const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
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
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scroll = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
  scroll = window.scrollY

  const newSection = Math.round(scroll / sizes.height)

  if (currentSection !== newSection) {
    currentSection = newSection

    gsap.to(Object.values(geometries)[currentSection].rotation, {
      duration: 1.23,
      ease: 'power1.inOut',
      x: '+=2.5',
      y: '+=2',
      z: '+=1.5',
    })
  }
})

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
}

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = -(event.clientY / sizes.height - 0.5)
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Animate camera
  camera.position.y = (-scroll / sizes.height) * objectsDistance

  // parallax
  const parallaxX = cursor.x * 0.5
  const parallaxY = cursor.y * 0.5
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

  // Animate meshes
  for (const geometry of Object.values(geometries)) {
    geometry.rotation.x = elapsedTime * 0.1
    geometry.rotation.y = elapsedTime * 0.32
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
