import * as THREE from 'three'
import Experience from '../Experience'

export default class Fox {
  experience: Experience
  sizes: any
  debug: any
  debugFolder: any
  scene: any
  resource: any
  time: any
  model!: any
  animation!: Record<string, any>

  constructor() {
    this.experience = Experience.getInstance()
    this.scene = this.experience.scene
    this.resource = this.experience.resources.items.get('foxModel')
    this.time = this.experience.time
    this.debug = this.experience.debug

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('fox')
    }

    this.setModel()
    this.setAnimation()
  }
  setModel() {
    this.model = this.resource.scene
    this.model.scale.set(0.02, 0.02, 0.02)
    this.scene.add(this.model)
    //Add SHadowcast to whole models
    this.model.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
      }
    })
  }

  setAnimation() {
    this.animation = {}

    // Mixer
    this.animation.mixer = new THREE.AnimationMixer(this.model)

    // Actions
    this.animation.actions = {}

    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0]
    )
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.resource.animations[1]
    )
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.resource.animations[2]
    )

    this.animation.actions.current = this.animation.actions.idle
    this.animation.actions.current.play()

    // Play the action
    this.animation.play = (name: string) => {
      const newAction = this.animation.actions[name]
      const oldAction = this.animation.actions.current

      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 1)

      this.animation.actions.current = newAction
    }

    // Debug
    if (this.debug.active) {
      const debugObject = {
        playIdle: () => {
          this.animation.play('idle')
        },
        playWalking: () => {
          this.animation.play('walking')
        },
        playRunning: () => {
          this.animation.play('running')
        },
      }
      this.debugFolder.add(debugObject, 'playIdle')
      this.debugFolder.add(debugObject, 'playWalking')
      this.debugFolder.add(debugObject, 'playRunning')
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}
