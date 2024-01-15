import EventEmitter from './EventEmitter'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import type { sourcesArray, sourceAttributes } from '../sources'

export default class Resources extends EventEmitter {
  sources: sourcesArray
  items: Map<string, {}>
  toLoad: number

  loaders!: {
    gltfLoader?: GLTFLoader
    textureLoader?: THREE.TextureLoader
    cubeLoader?: THREE.CubeTextureLoader
    DRACOLoader?: DRACOLoader
  }
  constructor(sourcesData: sourcesArray) {
    super()

    //Options
    this.sources = sourcesData
    //Setup
    this.items = new Map()
    this.toLoad = this.sources.length

    this.setLoaders()
    this.startLoading()
  }
  setLoaders() {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.textureLoader = new THREE.TextureLoader()
    this.loaders.cubeLoader = new THREE.CubeTextureLoader()
    this.loaders.DRACOLoader = new DRACOLoader()
    this.loaders.DRACOLoader.setDecoderPath('/draco/')
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.DRACOLoader)
  }
  startLoading() {
    //Load Each Source
    for (const source of this.sources) {
      switch (source.type) {
        case 'dracoModel':
        case 'gltfModel':
          this.loaders.gltfLoader?.load(source.path as string, (file) => {
            this.sourceLoaded(source, file)
          })
          break
        case 'texture':
          this.loaders.textureLoader?.load(source.path as string, (file) => {
            this.sourceLoaded(source, file)
          })
          break
        case 'cubeTexture':
          this.loaders.cubeLoader?.load(source.path as string[], (file) => {
            this.sourceLoaded(source, file)
          })
          break
        default:
          throw new Error('Asset source type not found, check your source.type')
      }
    }
  }

  sourceLoaded(source: sourceAttributes, file: any) {
    this.items.set(source.name, file) // items = {'enviromentMapTexture' : file}

    if (this.items.size === this.toLoad) {
      this.trigger('ready')
    }
  }
}
