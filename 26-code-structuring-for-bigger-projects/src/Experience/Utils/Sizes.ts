import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter {
  width: number
  height: number
  pixelRatio: number

  constructor() {
    super()

    this.setSizes()

    window.addEventListener('resize', () => {
      this.setSizes()
      this.trigger('resize')
    })
  }

  setSizes() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
  }
}
