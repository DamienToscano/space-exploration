import * as CANNON from 'cannon-es'
import Experience from "../Experience.js";

export default class World {

    objectsToUpdate = []

    constructor() {
        this.experience = new Experience()
        this.time = this.experience.time
        this.setWorld()
    }

    setWorld() {
        this.world = new CANNON.World()

        // Update broadphase to have better performance
        this.world.broadphase = new CANNON.SAPBroadphase(this.world)

        // Allow sleep on objects to avoid comparing not moving objects
        this.world.allowSleep = true

        // Add some gravity to test
        // this.world.gravity.set(0, -2.0, 0)
    }

    update() {

        // Fixing framerate
        this.world.step(1 / 60, this.time.delta, 3)

        for (const object of this.objectsToUpdate) {
            // Update the position
            object.mesh.position.copy(object.body.position)
            // Update the rotation (quaternion)
            object.mesh.quaternion.copy(object.body.quaternion)
        }
    }
}