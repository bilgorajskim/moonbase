import * as THREE from 'three'
import CameraControls from './CameraControls'

// Key constants
const K_ROCKETPACK = 16
const K_FORWARD = 38
const K_BACKWARD = 40
const K_LEFT = 37
const K_RIGHT = 39
const K_FORWARD_ALT = 'W'.charCodeAt(0)
const K_BACKWARD_ALT = 'S'.charCodeAt(0)
const K_LEFT_ALT = 'A'.charCodeAt(0)
const K_RIGHT_ALT = 'D'.charCodeAt(0)

export default class Controls {
  constructor ({
    transform, camera, renderer
  }) {
    this.transform = transform
    this.camera = camera
    this.position = new THREE.Vector3(0, 0, 0)
    this.rotation = new THREE.Vector3(0, 0, 0)
    this.keystate = {}
    this.bindEvents()

    this.cameraControls = new CameraControls(camera, transform)
    this.cameraControls.enableDamping = true
    this.cameraControls.dampingFactor = 0.07
    this.cameraControls.rotateSpeed = 0.04
    this.cameraControls.minDistance = 3
    this.cameraControls.maxDistance = 6
    this.cameraControls.minPolarAngle = Math.PI / 4
    this.cameraControls.maxPolarAngle = Math.PI / 2
    this.cameraControls.enablePan = false

    transform.motion = new THREE.Vector3(0, 0, 0)
    this.moveSpeed = 1.5
  }

  bindEvents () {
    window.addEventListener('keydown', (evt) => {
      this.keystate[evt.which] = true
    }, false)
    window.addEventListener('keyup', (evt) => {
      this.keystate[evt.which] = false
    }, false)
  }

  update (delta) {
    let character = this.transform
    const moveSpeed = delta * this.moveSpeed
    let speed = moveSpeed
    let rotationSpeed = delta * 1.3
    let rotationDelta = 0
    let forwardDelta = 0
    let newMotion = new THREE.Vector3(0, 0, 0)
    if (this.keystate[K_ROCKETPACK]) {
      newMotion.y += delta * 0.11
    }
    if (character.grounded) {
      if (this.keystate[K_FORWARD] || this.keystate[K_FORWARD_ALT]) {
        forwardDelta = -speed
      }
      if (this.keystate[K_BACKWARD] || this.keystate[K_BACKWARD_ALT]) {
        forwardDelta = speed
      }
      newMotion.z += forwardDelta
    }
    if (this.keystate[K_LEFT] || this.keystate[K_LEFT_ALT]) {
      rotationDelta = rotationSpeed
    }
    if (this.keystate[K_RIGHT] || this.keystate[K_RIGHT_ALT]) {
      rotationDelta = -rotationSpeed
    }
    this.rotation.y += rotationDelta
    const transformRotationVector = character.rotation.toVector3()
    transformRotationVector.lerp(this.rotation, 1)
    character.rotation.setFromVector3(transformRotationVector)

    let rotationMatrix = new THREE.Matrix4().makeRotationY(transformRotationVector.y)
    newMotion.applyMatrix4(rotationMatrix)

    if (character.grounded) {
      if (this.keystate[81]) {
        newMotion.x -= moveSpeed * Math.cos(character.rotation.y)
        newMotion.z += moveSpeed * Math.sin(character.rotation.y)
      }

      if (this.keystate[69]) {
        newMotion.x += moveSpeed * Math.cos(character.rotation.y)
        newMotion.z -= moveSpeed * Math.sin(character.rotation.y)
      }
    }

    character.motion.add(newMotion)

    const cameraTargetPosition = character.position.clone()
    cameraTargetPosition.add(new THREE.Vector3(0, 1, 0))
    this.cameraControls.target = cameraTargetPosition
    this.cameraControls.update(delta)
  }
}
