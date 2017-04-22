import * as THREE from 'three';
const characterRadius = 10;
const characterHeight = 1.7;

export default class Physics {

    constructor() {
        this.gravity = 5;
        this.raycaster = new THREE.Raycaster();
        this.character = null;
        this.terrain = null;
        this.objects = [];
    }

    setTerrain(newTerrain)
    {
        this.terrain = newTerrain;
    }

    addObject(newObject)
    {
        this.objects.push(newObject);
    }

    setCharacter(newCharacter)
    {
        this.character = newCharacter;
    }

    compute(delta)
    {
        let character = this.character.object;
        if (character.motion === undefined)
        {
            character.motion = new THREE.Vector3(0, 0, 0);
        }

        let nextPosition = character.position.clone();
        nextPosition.add(character.motion);

        let terrainHeight = 0;

        if (
            (nextPosition.x < 0 || nextPosition.x >= this.terrain.width) ||
            (nextPosition.z < 0 || nextPosition.z >= this.terrain.height)
        ) {

        }
        else
        {
            terrainHeight = (this.terrain.getHeightAt(nextPosition.x, nextPosition.z)*this.terrain.mesh.scale.y) + (characterHeight/2);
        }

        let rayPos = nextPosition.clone();
        rayPos.y += 2;
        this.raycaster.set(rayPos, new THREE.Vector3(0, -1, 0));
        let collisions = this.raycaster.intersectObjects(this.objects);

        let highestSolidGround = 0;

        if (collisions.length) {
            let collisionHeight = collisions[0].point.y + (characterHeight/2);
            if (collisionHeight > terrainHeight)
            {
                highestSolidGround = collisionHeight;
            }
            else
            {
                highestSolidGround = terrainHeight;
            }
        }
        else
        {
            highestSolidGround = terrainHeight;
        }
        nextPosition.y -= this.gravity * delta;

        if (nextPosition.y < highestSolidGround)
        {
            nextPosition.y = highestSolidGround;
        }

        character.position.copy(nextPosition);
    }
}