import './style.css'

import Experience from './Experience/Experience'

const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!
const experience = new Experience(canvas)
