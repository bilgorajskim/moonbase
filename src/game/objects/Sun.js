import * as THREE from 'three'
import assets from './../assets.js'

export default class Sun {
  constructor () {
    this.object = null
    this.light = null
  }

  async build () {
    var textureLoader = new THREE.TextureLoader()
    var texture = textureLoader.load(assets.sun.texture)
    texture.repeat.set(1, 1)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    var geometry = new THREE.SphereGeometry(64, 8, 8)
    var material = new THREE.MeshBasicMaterial({
      map: texture
    })

    var cube = new THREE.Mesh(geometry, material)
    cube.position.x = 1024 + 512
    cube.position.z = 1024 + 256
    cube.position.y = 386
    let light = new THREE.PointLight(0xfffaec)
    light.position.copy(cube.position)
    light.position.y = 128
    light.power = 25

    this.object = cube
    this.light = light
  }

  applyToScene (scene) {
    scene.add(this.light)
    scene.add(this.object)
  }

  update (delta) {
    this.object.rotateY(delta * 0.05)
  }
}
