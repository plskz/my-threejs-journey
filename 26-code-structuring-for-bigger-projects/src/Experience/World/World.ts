import * as THREE from 'three'
import Experience from '../Experience.ts'
import Environment from './Enviroment'
import Floor from './Floor.ts'
import Fox from './Fox.ts'

export default class World {
  experience: Experience
  debug: any
  scene: THREE.Scene
  sizes: any
  camera: any
  time: any
  renderer: any
  resources: any
  environment!: Environment
  floor: any
  fox: any
  constructor() {
    this.experience = Experience.getInstance()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    //Setup
    this.resources.on('ready', () => {
      // EnviromentMap after resources are ready
      console.log('ready resources')
      this.floor = new Floor()
      this.fox = new Fox()
      //last to apply enviroment change to other elements
      this.environment = new Environment()
    })
  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}
