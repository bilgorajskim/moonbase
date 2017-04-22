import * as THREE from 'three';
import assets from './../assets.js';

export default class PointLight {

    constructor({position, power = 2, color = 0xffffff}) {
        this.light = null;
        this.position = position;
        this.power = power;
        this.color = color;
    }

    async build() {
        let light = new THREE.PointLight(this.color);
        light.position.x = this.position.x;
        light.position.z = this.position.z;
        light.position.y = this.position.y;
        light.power = this.power;

        this.light = light;
    }

    applyToScene(scene) {
        scene.add(this.light);
    }

    update(delta) {

    }
}