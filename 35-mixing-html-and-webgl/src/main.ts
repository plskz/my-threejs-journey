import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

import { gsap } from 'gsap'

/**
 * Loaders
 */
let sceneReady = false
const loadingBar = document.querySelector<HTMLDivElement>('.loading-bar')!

const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    gsap.delayedCall(0.5, () => {
      // Animate overlay
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })

      // Update loadingBarElement
      loadingBar.classList.add('ended')
      loadingBar.style.transform = ''

      // Set scene as ready
      sceneReady = true
    })
  },

  // Progress
  (_, loaded, total) => {
    // Calculate the progress and update the loadingBar element
    const progressRatio = loaded / total
    loadingBar.style.transform = `scaleX(${progressRatio})`
  }
)
const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

/**
 * Base
 */
// Debug
const debugObject = {
  envMapIntensity: 2.5,
}

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
  // wireframe: true,
  transparent: true,
  uniforms: {
    uAlpha: { value: 1 },
  },
  vertexShader: /* glsl */ `
    void main()
    {
        gl_Position = vec4(position, 1.0);
    }
`,
  fragmentShader: /* glsl */ `
    uniform float uAlpha;

    void main()
    {
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
    }
`,
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity
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

environmentMap.colorSpace = THREE.SRGBColorSpace

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(2.5, 2.5, 2.5)
  gltf.scene.rotation.y = Math.PI * 0.5
  scene.add(gltf.scene)

  updateAllMaterials()
})

/**
 * Points of interest
 */
const raycaster = new THREE.Raycaster()
const points = [
  {
    position: new THREE.Vector3(1.55, 0.3, -0.6),
    element: document.querySelector<HTMLDivElement>('.point-0')!,
  },
  {
    position: new THREE.Vector3(0.5, 0.8, -1.6),
    element: document.querySelector<HTMLDivElement>('.point-1')!,
  },
  {
    position: new THREE.Vector3(1.6, -1.3, -0.7),
    element: document.querySelector<HTMLDivElement>('.point-2')!,
  },
]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
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
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  if (sceneReady) {
    // Go through each point
    for (const point of points) {
      const screenPosition = point.position.clone()
      screenPosition.project(camera)

      raycaster.setFromCamera(screenPosition, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      const isIntersecting = intersects.length === 0
      const pointDistance = point.position.distanceTo(camera.position)

      point.element.classList.toggle(
        'visible',
        isIntersecting || intersects[0].distance >= pointDistance
      )

      const translateX = screenPosition.x * sizes.width * 0.5
      const translateY = -screenPosition.y * sizes.height * 0.5
      point.element.style.transform = `translate(${translateX}px, ${translateY}px)`

      // console.log(screenPosition)
    }
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()