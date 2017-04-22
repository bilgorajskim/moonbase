import * as THREE from 'three';

export default class AmbientLight {

    constructor({intensity = 0.2, color = 0xffffff}) {
        this.light = null;
        this.intensity = intensity;
        this.color = color;
    }

    async build() {
        let light = new THREE.AmbientLight(this.color, this.intensity);

        this.light = light;
    }

    applyToScene(scene) {
        scene.add(this.light);
    }

    update(delta) {

    }
}