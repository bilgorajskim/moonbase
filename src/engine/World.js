import Promise from 'bluebird'
import BasicPhysicsEngine from './physics/BasicPhysicsEngine'

export default class World {
  constructor (scene, objects) {
    this.objects = objects
    this.physics = new BasicPhysicsEngine()
    this.scene = scene
  }

  init () {
    let loadTasks = []
    this.objects.forEach((object) => {
      loadTasks.push(this.addObject(object))
    })
    return Promise.all(loadTasks)
  }

  async addObject (object) {
    await object.build()
    if (object.applyToScene !== undefined) {
      object.applyToScene(this.scene)
    }
    if (object.applyToPhysics !== undefined) {
      object.applyToPhysics(this.physics)
    }
  }

  update (delta) {
    this.objects.forEach((object) => {
      object.update(delta)
    })
    this.physics.compute(delta)
  }
}
