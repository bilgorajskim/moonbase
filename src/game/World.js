import Promise from 'bluebird';
import BasicPhysicsEngine from "./physics/BasicPhysicsEngine";

export default class World {

    constructor(objects) {
        this.objects = objects;
        this.physics = new BasicPhysicsEngine();
    }

    build(scene)
    {
        let loadTasks = [];
        this.objects.forEach((object) => {
            loadTasks.push(new Promise((resolve) => {
                object.build().then(() => {
                    console.log(object);
                    if (object.applyToScene !== undefined){
                        object.applyToScene(scene);
                    }
                    if (object.applyToPhysics !== undefined){
                        object.applyToPhysics(this.physics);
                    }
                    resolve();
                });
            }));
        });
        return Promise.all(loadTasks);
    }

    update(delta)
    {
        this.objects.forEach((object) => {
            object.update(delta);
        });
        this.physics.compute(delta);
    }
}