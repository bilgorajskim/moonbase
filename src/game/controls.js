import * as THREE from 'three';

// Key constants
const K_ROCKETPACK = 16;
const K_FORWARD = 38;
const K_BACKWARD = 40;
const K_LEFT = 37;
const K_RIGHT = 39;
const K_FORWARD_ALT = 'W'.charCodeAt(0);
const K_BACKWARD_ALT = 'S'.charCodeAt(0);
const K_LEFT_ALT = 'A'.charCodeAt(0);
const K_RIGHT_ALT = 'D'.charCodeAt(0);

export default class {

    constructor(transform) {
        this.transform = transform;
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Vector3(0, 0, 0);
        this.keystate = {};
        this.bindEvents();
    }

    bindEvents() {
        // You can only request pointer lock from a user triggered event
        let el = document.querySelector('canvas');
        document.body.addEventListener('mousedown', function () {
            if (!el.requestPointerLock) {
                el.requestPointerLock = el.mozRequestPointerLock;
            }
            el.requestPointerLock();
        }, false);

        // Update rotation from mouse motion
        document.body.addEventListener('mousemove', (evt) => {
            let sensitivity = 0.002;
            this.rotation.x -= evt.movementY * sensitivity;
            this.rotation.y -= evt.movementX * sensitivity;
            // Constrain viewing angle
            if (this.rotation.x < -Math.PI / 2) {
                this.rotation.x = -Math.PI / 2;
            }
            if (this.rotation.x > Math.PI / 2) {
                this.rotation.x = Math.PI / 2;
            }
        }, false);

        // Update keystate from down/up events
        window.addEventListener('keydown', (evt) => {
            this.keystate[evt.which] = true;
        }, false);
        window.addEventListener('keyup', (evt) => {
            this.keystate[evt.which] = false;
        }, false);

    }

    update(delta) {

        let character = this.transform;

        let speed = delta * 30;
        let rotationSpeed = delta * 2;
        character.motion = new THREE.Vector3(0, 0, 0);
        let motion = character.motion;

        if (this.keystate[K_ROCKETPACK]) {
            motion.y += delta * 20;
        }
        if (this.keystate[K_FORWARD] || this.keystate[K_FORWARD_ALT]) {
            motion.z -= speed;
        }
        if (this.keystate[K_BACKWARD] || this.keystate[K_BACKWARD_ALT]) {
            motion.z += speed;
        }
        if (this.keystate[K_LEFT] || this.keystate[K_LEFT_ALT]) {
            character.rotation.y += rotationSpeed;
        }
        if (this.keystate[K_RIGHT] || this.keystate[K_RIGHT_ALT]) {
            character.rotation.y -= rotationSpeed;
        }

        let rotation = new THREE.Matrix4().makeRotationY(character.rotation.y);
        character.motion.applyMatrix4(rotation);

        character.motion = motion;

    }

}