import * as THREE from 'three';
import assets from './../assets.js';

export default class Earth {

    constructor() {
        this.object = null;
    }

    async build() {
        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load(assets.earth.texture);
        texture.repeat.set( 1, 1 );
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        var geometry = new THREE.SphereGeometry( 32, 8, 8 );
        var material = new THREE.MeshLambertMaterial( {
            map: texture
        } );
        var cube = new THREE.Mesh( geometry, material );
        cube.position.x = 768;
        cube.position.z = 1024 + 512;
        cube.position.y = 256;

        this.object = cube;
    }

    applyToScene(scene) {
        scene.add(this.object);
    }

    applyToPhysics(physics) {
        physics.addObject(this.object);
    }

    update(delta) {
        this.object.rotateY(delta * 0.05);
    }
}