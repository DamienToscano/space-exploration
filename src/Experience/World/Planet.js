import Experience from "../Experience.js"
import * as CANNON from 'cannon-es'

export default class Planet {
    parameters = {
        // name: 'rings',
        mass: 0,
        position: { x: 0, y: 0, z: 0 },
    }

    constructor(size) {
        this.size = size
        this.experience = new Experience()
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.physics = this.experience.physics
        this.world_size = this.experience.world.parameters.size / 2

        this.setModel()
        this.setPosition()
        this.setPhysics()
    }

    setPosition() {
        this.parameters.position = {
            x: (Math.random() - 0.5) * this.world_size * 2,
            y: (Math.random() - 0.5) * this.world_size * 2,
            z: (Math.random() - 0.5) * this.world_size * 2,
        }
    }

    setModel() {
        // In child class
    }

    setPhysics() {
        this.setMaterial()
        this.setBody()
    }

    setMaterial() {
        this.physics.planetMaterial = new CANNON.Material('planetMaterial')
    }

    setBody() {
        // In child class
    }

    update() {
        // Rotate the body around the y axis
        this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), this.time.elapsed * 0.0001)
        this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), this.time.elapsed * 0.00015)

    }
}