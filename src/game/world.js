import World from './../engine/World.js'
import Terrain from './../engine/terrain/Terrain.js'
import assets from './assets.js'
import Astronaut from './objects/Astronaut.js'
import Sky from './objects/Sky'
import Sun from './objects/Sun'
import Earth from './objects/Earth'
import AmbientLight from './objects/AmbientLight'

export async function createMoonbaseWorld () {
  let character = new Astronaut()
  let terrain = await Terrain.fromImage(assets.terrain.heightMap)
  return new World([
    new Sky(),
    new Earth(),
    new Sun(),
    new AmbientLight({

    }),
    terrain,
    character
  ])
}
