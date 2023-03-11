import * as THREE from "three"
import Experience from "../Experience.js"
import * as CANNON from 'cannon-es'

export default class Planet {
    parameters = {
        // name: 'rings',
        mass: 0,
        position: { x: 0, y: 0, z: 0 },
        dimensions: new THREE.Vector3(0, 0, 0),
    }

    constructor(size) {
        this.size = size
        this.experience = new Experience()
        this.time = this.experience.time
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.physics = this.experience.physics
        this.world_size = this.experience.world.parameters.size / 2

        this.setModel()
        this.calculateDimensions()
        this.setPosition()
        this.setPhysics()
    }

    setPosition() {
        this.parameters.position = {
            x: (Math.random() - 0.5) * this.world_size,
            y: (Math.random() - 0.5) * this.world_size,
            z: (Math.random() - 0.5) * this.world_size,
        }
    }

    // setModel() {
    //     this.model = this.resources.items[this.parameters.name + 'Planet']
    //     this.planet = this.model.scene.children[0]
    //     this.planet.scale.set(this.size, this.size, this.size)
    //     this.planet.position.copy(this.parameters.position)
    //     this.scene.add(this.planet)
    // }

    calculateDimensions() {
        const box = new THREE.Box3()
        box.setFromObject(this.planet)
        box.getSize(this.parameters.dimensions)
    }

    setPhysics() {
        this.setMaterial()
        this.setBody()
    }

    setMaterial() {
        this.physics.planetMaterial = new CANNON.Material('planetMaterial')
    }

    setBody() {
        const shape = new CANNON.Sphere(this.parameters.dimensions.x / 2)
        this.body = new CANNON.Body({
            mass: this.parameters.mass,
            shape: shape,
            position: this.parameters.position,
            material: this.physics.planetMaterial,
        })

        this.physics.world.addBody(this.body)

        this.physics.objectsToUpdate.push({
            mesh: this.planet,
            body: this.body,
        })
    }

    update() {
        // Rotate the body around the y axis
        this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), this.time.elapsed * 0.0001)
        this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), this.time.elapsed * 0.0001)

    }
}