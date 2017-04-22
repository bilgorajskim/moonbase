import * as THREE from 'three';
import {loader as textureLoader} from './../Textures.js';
import assets from './../assets.js';

export default class Astronaut {

    constructor() {
        this.object = null;
    }

    build() {
        return new Promise((resolve, reject) => {
            var modelLoader = new THREE.JSONLoader();
            modelLoader.load(assets.astronaut.mesh, (geometry, materials) => {
                var cube = new THREE.Mesh( geometry,  new THREE.MeshLambertMaterial({
                    map: textureLoader.load(assets.astronaut.texture)
                }) );
                cube.name = 'character';
                cube.position.x = 512;
                cube.position.z = 512;
                cube.position.y = 32;
                this.object = cube;
                resolve();
            }, undefined, (error) => {
                console.error(error);
            });
        });
    }

    applyToScene(scene) {
        console.log('added astronaut');
        scene.add(this.object);
    }

    applyToPhysics(physics) {
        physics.setCharacter(this);
    }

    update() {

    }
}