import * as THREE from 'three'
import Controls from './controls.js'
import {buildMoonbaseWorld} from './world'
import Astronaut from './objects/Astronaut'

export class Game {
  constructor ({canvas}) {
    let width = window.innerWidth
    let height = window.innerHeight
    let pixelRatio = window.devicePixelRatio
    let aspect = width / height
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 4096)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({antialias: false, canvas})
    this.renderer.setClearColor(new THREE.Color('rgba(255, 0, 0, 0)'))
    this.renderer.setPixelRatio(pixelRatio)
    this.renderer.setSize(width, height)
    window.addEventListener('resize', this.handleWindowResize.bind(this))
    this.clock = new THREE.Clock()
    this.world = null
  }

  handleWindowResize () {
    const width = window.innerWidth
    const height = window.innerHeight
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  async start () {
    this.clock.start()

    this.world = await buildMoonbaseWorld(this.scene)

    let character = new Astronaut()
    await this.world.addObject(character)
    
    this.world.init(this.scene).then(() => {
      this.controls = new Controls({
        transform: character.object,
        camera: this.camera,
        renderer: this.renderer
      })

      this.loop()
    })
  }

  loop () {
    window.requestAnimationFrame(() => this.loop())
    let delta = this.clock.getDelta()
    this.world.update(delta)
    this.controls.update(delta)
    this.render()
  }

  render () {
    let scene = this.scene
    let camera = this.camera
    let renderer = this.renderer
    renderer.render(scene, camera)
  }
}
