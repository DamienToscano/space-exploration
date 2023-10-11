import * as THREE from "three"
import Experience from "../Experience.js"
import * as CANNON from 'cannon-es'

export default class Asteroid {

    parameters = {
        mass: 1,
        position: { x: 0, y: 0, z: 0 },
    }

    constructor(id) {
        this.asteroid_number = id
        this.experience = new Experience()
        this.time = this.experience.time
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.physics = this.experience.physics
        this.size = this.experience.world.parameters.size / 2
        this.asteroids = this.experience.world.asteroids

        this.setModel()
        this.calculateDimensions()
        this.setMass()
        this.setPosition()
        this.setPhysics()
    }

    setMass() {
        this.parameters.mass = Math.ceil(this.volume / 10)
    }

    setPosition() {
        this.parameters.position = {
            x: (Math.random() - 0.5) * this.size,
            y: (Math.random() - 0.5) * this.size,
            z: (Math.random() - 0.5) * this.size,
        }
    }

    /**
     * Set the model
     * With imported model for first ones
     * And then, just clone them
     */
    setModel() {

        if (this.asteroid_number) {
            this.model = this.resources.items['asteroid' + this.asteroid_number]
            this.asteroid = this.model.scene.children[0]
        } else {
            this.asteroid = this.asteroids[Math.floor(Math.random() * 13)].asteroid.clone()
        }
        
        this.scene.add(this.asteroid)
    }

    calculateDimensions() {
        const box = new THREE.Box3()
        this.asteroid.geometry.computeBoundingBox()
        box.copy(this.asteroid.geometry.boundingBox).applyMatrix4(this.asteroid.matrixWorld)
        this.dimensions = new THREE.Vector3(0, 0, 0)
        box.getSize(this.dimensions)
        // width, height and depth
        this.volume = Math.ceil(this.dimensions.x * this.dimensions.y * this.dimensions.z)
    }

    setPhysics() {
        this.setMaterial()
        this.setBody()
        this.setCollisionListener()
    }

    setMaterial() {
        this.physics.asteroidMaterial = new CANNON.Material('asteroidMaterial')
    }

    setBody() {

        const shape = new CANNON.Box(new CANNON.Vec3(this.dimensions.x / 2, this.dimensions.y / 2, this.dimensions.z / 2))

        this.body = new CANNON.Body({
            mass: this.parameters.mass,
            shape: shape,
            position: this.parameters.position,
            material: this.physics.asteroidMaterial,
        })

        this.body.position.copy(this.parameters.position)
        this.physics.world.addBody(this.body)

        this.physics.objectsToUpdate.push({
            mesh: this.asteroid,
            body: this.body
        })

        // Apply local impulse to body
        this.body.applyLocalImpulse(new CANNON.Vec3(parseInt(Math.random() * 10), parseInt(Math.random() * 10), parseInt(Math.random() * 10)), new CANNON.Vec3(1, 2, 1))

    }

    setCollisionListener() {
        /* Use arrow function to keep context of Bullet as this */
        this.body.addEventListener('collide', (event) => {
            if (event.body.material.name == 'bulletMaterial') {
                this.destroy()
            }
        });
    }

    destroy() {
        this.body.removeEventListener('collide')
        this.asteroid.geometry.dispose()
        this.asteroid.material.dispose()
        this.scene.remove(this.asteroid)
    }
}