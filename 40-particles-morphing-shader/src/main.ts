import './style.css'
import * as THREE from 'three'

import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { gsap } from 'gsap'
import GUI from 'lil-gui'

import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject: any = {}

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

  // Materials
  if (particles) {
    particles.material.uniforms.uResolution.value.set(
      sizes.width * sizes.pixelRatio,
      sizes.height * sizes.pixelRatio
    )
  }

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(0, 0, 8 * 2)
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

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

debugObject.clearColor = '#160920'
gui.addColor(debugObject, 'clearColor').onChange(() => {
  renderer.setClearColor(debugObject.clearColor)
})
renderer.setClearColor(debugObject.clearColor)

/**
 * Particles
 */
let particles: any = null

gltfLoader.load('./models.glb', (gltf) => {
  particles = {}

  // Positions
  const positions = gltf.scene.children.map(
    (child: any) => child.geometry.attributes.position
  )

  particles.maxCount = 0

  for (const position of positions) {
    particles.maxCount = Math.max(particles.maxCount, position.count)
  }

  particles.positions = []
  for (const position of positions) {
    const originalArray = position.array
    const newArray = new Float32Array(particles.maxCount * 3)

    for (let i = 0; i < particles.maxCount; i++) {
      const i3 = i * 3

      if (i3 < originalArray.length) {
        newArray[i3 + 0] = originalArray[i3 + 0]
        newArray[i3 + 1] = originalArray[i3 + 1]
        newArray[i3 + 2] = originalArray[i3 + 2]
      } else {
        const randomIndex = Math.floor(position.count * Math.random()) * 3
        newArray[i3 + 0] = originalArray[randomIndex + 0]
        newArray[i3 + 1] = originalArray[randomIndex + 1]
        newArray[i3 + 2] = originalArray[randomIndex + 2]
      }
    }

    particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3))
  }

  console.log(particles.positions)

  // Geometry
  particles.geometry = new THREE.BufferGeometry()
  particles.geometry.setAttribute('position', particles.positions[1])
  particles.geometry.setIndex(null)

  // Materials
  particles.material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(0.2),
      uResolution: new THREE.Uniform(
        new THREE.Vector2(
          sizes.width * sizes.pixelRatio,
          sizes.height * sizes.pixelRatio
        )
      ),
    },
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  // Points
  particles.points = new THREE.Points(particles.geometry, particles.material)
  scene.add(particles.points)
})

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  // Render normal scene
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
