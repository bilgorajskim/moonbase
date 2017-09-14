import World from './../engine/World.js'
import Terrain from './../engine/objects/terrain/Terrain.js'
import assets from './assets.js'
import Sky from './objects/Sky'
import Sun from './objects/Sun'
import Earth from './objects/Earth'
import AmbientLight from './objects/AmbientLight'

export async function buildMoonbaseWorld (scene) {
  let terrain = await Terrain.fromImage(assets.terrain.heightMap, {
    texture: assets.terrain.texture,
    normalMap: assets.terrain.normalMap,
    rocks: {
      texture: assets.terrain.rocks.texture,
      normalMap: assets.terrain.rocks.normalMap
    }
  })
  return new World(scene, [
    new Sky(),
    new Earth(),
    new Sun(),
    new AmbientLight({

    }),
    terrain
  ])
}
