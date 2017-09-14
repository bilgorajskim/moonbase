import * as THREE from 'three'
import {random} from 'lodash'

function buildRock (terrain, x, z, radius) {
  let geometry = new THREE.SphereGeometry(radius, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2)
  let height = (terrain.getHeightAt(x, z) * terrain.mesh.scale.y) - radius / 1.8
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(x, height, z))

  return geometry
}

export function buildRocks (options) {
  const terrain = options.terrain
  const textureLoader = new THREE.TextureLoader()
  let texture = textureLoader.load(options.texture)
  let mapHeight = textureLoader.load(options.normalMap)
  mapHeight.repeat.set(4, 4)
  mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping

  let material = new THREE.MeshPhongMaterial({
    shininess: 10,
    normalMap: mapHeight,
    normalScale: new THREE.Vector2(0.2, -0.2),
    map: texture
  })

  const rocksPerSquareKilometer = 100
  const rockCount = Math.round(
    Math.sqrt((terrain.width * terrain.height)) * rocksPerSquareKilometer / 1000
  )

  let mergeGeometry = new THREE.Geometry()

  function fixateCoord (a) {
    return random(0, a)
  }

  for (let x = 0; x < rockCount; x++) {
    let rock = buildRock(
      terrain,
      fixateCoord(terrain.width - 1),
      fixateCoord(terrain.height - 1),
      random(4, 15)
    )
    mergeGeometry.merge(rock, rock.matrix, 0)
  }

  return new THREE.Mesh(mergeGeometry, material)
}