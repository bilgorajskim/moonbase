import * as THREE from 'three'
import assets from './../assets.js'

export default class Sky {
  constructor () {
    this.object = null
  }

  async build () {
    var textureLoader = new THREE.TextureLoader()
    var texture = textureLoader.load(assets.sky.texture)
    texture.repeat.set(10, 10)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    var geometry = new THREE.SphereGeometry(2048, 8, 8)
    var material = new THREE.MeshBasicMaterial({ map: texture,
      side: THREE.BackSide
    })
    var cube = new THREE.Mesh(geometry, material)
    cube.position.x = 1024 / 2
    cube.position.z = 1024 / 2

    this.object = cube
  }

  update (delta) {
    this.object.rotateY(delta * 0.01)
    this.object.rotateX(delta * 0.005)
  }

  applyToScene (scene) {
    scene.add(this.object)
  }
}
