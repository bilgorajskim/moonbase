import * as THREE from 'three';
import CANNON from 'cannon';

import mesh2shape from 'three-to-cannon';

const characterRadius = 10;
const characterHeight = 1.7;

export default class CannonPhysicsEngine {

    constructor() {
        this.gravity = 8;
        this.character = null;
        this.terrain = null;
        this.objects = [];

       this.world = new CANNON.World();
        this.world.gravity.set(0, 0, -1.62519); // m/s²

        this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
        this.world.defaultContactMaterial.contactEquationRelaxation = 4;

        let groundMaterial = new CANNON.Material();
        groundMaterial.friction = 10;


        let radius = 1; // m
        this.sphereBody = new CANNON.Body({
            mass: 80, // kg
            position: new CANNON.Vec3(10, 10, 10), // m
            shape: new CANNON.Sphere(radius)
        });
        //this.sphereBody.linearDamping = 0.99;
        this.world.addBody(this.sphereBody);

        let groundBody = new CANNON.Body({
            mass: 0 // mass == 0 makes the body static
        });
        let groundShape = new CANNON.Plane();
        groundBody.addShape(groundShape);
        this.world.addBody(groundBody);


    }

    setTerrain(newTerrain)
    {
        this.terrain = newTerrain;
        let groundShape = mesh2shape(newTerrain.mesh, {type: mesh2shape.HULL});
        console.log('physics terrain', groundShape);
        let groundBody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(0, 0, 0),
            shape: groundShape
        });
        //this.world.addBody(groundBody);
    }

    addObject(newObject)
    {
        this.objects.push(newObject);
        let groundShape = mesh2shape(newObject);
        console.log('physics object', groundShape);
        let groundBody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(0, 0, 0),
            shape: groundShape
        });
        this.world.addBody(groundBody);
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

        this.sphereBody.velocity.x += character.motion.x;
        this.sphereBody.velocity.y += character.motion.z;
        this.sphereBody.velocity.z += character.motion.y;

        this.sphereBody.velocity.x *= 0.9;
        this.sphereBody.velocity.y *= 0.9;

        let fixedTimeStep = 1.0 / 60.0; // seconds
        let maxSubSteps = 3;
        this.world.step(fixedTimeStep, delta, maxSubSteps);

        this.character.object.position.x = this.sphereBody.position.x;
        this.character.object.position.y = this.sphereBody.position.z;
        this.character.object.position.z = this.sphereBody.position.y;

        // this.sphereBody.velocity.x += character.motion.x;
        // this.sphereBody.velocity.y += character.motion.z;
        // this.sphereBody.velocity.z += character.motion.y;

        //this.character.object.quaternion.copy(this.sphereBody.quaternion);
        //
        // let character = this.character.object;
        // if (character.motion === undefined)
        // {
        //     character.motion = new THREE.Vector3(0, 0, 0);
        // }
        //
        // let nextPosition = character.position.clone();
        // nextPosition.add(character.motion);
        //
        // let terrainHeight = 0;
        //
        // if (
        //     (nextPosition.x < 0 || nextPosition.x >= this.terrain.width) ||
        //     (nextPosition.z < 0 || nextPosition.z >= this.terrain.height)
        // ) {
        //
        // }
        // else
        // {
        //     terrainHeight = (this.terrain.getHeightAt(nextPosition.x, nextPosition.z)*this.terrain.mesh.scale.y) + (characterHeight/2);
        // }
        //
        // let normalizedMotionVector = character.motion.normalize();
        //
        // let rays = [
        //     normalizedMotionVector
        // ];
        //
        // let collided = false;
        //
        // rays.forEach((ray, rayId) => {
        //     if (collided) return;
        //     this.raycaster.set(nextPosition, ray);
        //     // Test if we intersect with any obstacle mesh
        //     let collisions = this.raycaster.intersectObjects(this.objects);
        //
        //     // And disable that direction if we do
        //     if (collisions.length === 0)
        //     {
        //         return;
        //     }
        //     let col = collisions.forEach((col) => {
        //         if (col.distance <= characterRadius && col.object.name != 'character') {
        //             collided = true;
        //         }
        //     });
        // });
        // this.raycaster.set(nextPosition, new THREE.Vector3(0, -1, 0));
        // let collisions = this.raycaster.intersectObjects(this.objects);
        //
        // let highestSolidGround = 0;
        //
        // if (collisions.length) {
        //     let collisionHeight = collisions[0].point.y + (characterHeight/2);
        //     if (collisionHeight > terrainHeight)
        //     {
        //         highestSolidGround = collisionHeight;
        //     }
        //     else
        //     {
        //         highestSolidGround = terrainHeight;
        //     }
        // }
        // else
        // {
        //     highestSolidGround = terrainHeight;
        // }
        // nextPosition.y -= this.gravity * delta;
        //
        // if (nextPosition.y < highestSolidGround)
        // {
        //     nextPosition.y = highestSolidGround;
        // }
        //
        // character.position.copy(nextPosition);
    }
}