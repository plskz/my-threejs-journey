import * as dat from 'lil-gui'

export default class Debug {
  active: boolean
  ui: any

  constructor() {
    this.active = window.location.hash === '#debug'

    if (this.active) {
      this.ui = new dat.GUI()
    }
  }

  destroy() {
    this.ui.destroy()
  }
}
