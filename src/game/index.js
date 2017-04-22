import * as THREE from 'three';
import ThirdPersonControls from './controls.js';
import TargetCamera from './TargetCamera.js';
import Terrain from './objects/Terrain';
import Astronaut from './objects/Astronaut';
import Sky from './objects/Sky';
import Sun from './objects/Sun';
import Earth from './objects/Earth';
import World from './World';
import assets from './assets.js';
import PointLight from './objects/PointLight';
import AmbientLight from "./objects/AmbientLight";

let app = null;

class App {
    constructor() {
        // Grab window properties
        let width = window.innerWidth;
        let height = window.innerHeight;
        let pixelRatio = window.devicePixelRatio;
        let aspect = width / height;
        // Setup three.js
        this.camera = new TargetCamera(45, aspect, 0.1, 4096);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialias: false, canvas: document.getElementById('webgl-canvas')});
        this.renderer.setClearColor( new THREE.Color('rgba(255, 0, 0, 0)') );
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(width, height);
        // Catch resize events
        window.onresize = (evt) => {
            this.resize(window.innerWidth, window.innerHeight);
        };
        this.clock = new THREE.Clock();
        this.world = null;
    }

    /* Resize viewport */
    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    async start() {
        this.clock.start();

        let character = new Astronaut();
        let terrain = await Terrain.fromImage(assets.terrain.heightMap);
        this.world = new World([
            new Sky(),
            new Earth(),
            new Sun(),
            new AmbientLight({

            }),
            terrain,
            character
        ]);
        this.world.build(this.scene).then(() => {
            this.controls = new ThirdPersonControls(character.object);
            this.camera.addTarget({
                name: 'character',
                targetObject: character.object,
                cameraPosition: new THREE.Vector3(0, 1, 6),
                fixed: false,
                stiffness: 1,
                matchRotation: true
            });
            this.camera.setTarget( 'character' );

            this.loop();
        });
    }

    loop() {
        requestAnimationFrame(() => this.loop());
        let delta = this.clock.getDelta();
        this.world.update(delta);
        this.controls.update(delta);
        this.render();
    }

    render() {
        let scene = this.scene;
        let camera = this.camera;
        let renderer = this.renderer;
        camera.update();
        renderer.render(scene, camera);
    }
}

export function stop() {
    app = null;
}

export function start() {
    app = new App();
    app.start();
}