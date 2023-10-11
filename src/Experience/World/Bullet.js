import * as THREE from "three"
import Experience from "../Experience.js"
import * as CANNON from 'cannon-es'

export default class Bullet {

    parameters = {
        life_time: 3000,
        color: 0x84B3FF,
        alive: true,
        radius: 0.2,
        mass: 0.1,
        position: { x: 0, y: 0, z: 0 },
        force_power: 100,
    }

    constructor(origin, velocity, quaternion) {
        this.experience = new Experience()
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.physics = this.experience.physics
        this.spaceship_position = origin
        this.spaceship_velocity = velocity
        this.spaceship_quaternion = quaternion

        this.instanciated_time = this.time.elapsed

        this.setGeometry()
        this.setMaterial()
        this.setPosition()
        this.setMesh()
        this.setPhysics()
    }

    setGeometry() {
        this.geometry = new THREE.SphereGeometry(this.parameters.radius, 4, 4)
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: this.parameters.color,
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    setPhysics() {
        this.setPhysicsMaterial()
        this.setBody()
        this.setCollisionListener()
    }

    setPosition() {
        this.parameters.position = {
            x: this.spaceship_position.x,
            y: this.spaceship_position.y,
            z: this.spaceship_position.z
        }
    }

    setPhysicsMaterial() {
        this.physics.bulletMaterial = new CANNON.Material('bulletMaterial')
    }

    setBody() {
        const shape = new CANNON.Sphere(this.parameters.radius / 2)

        this.body = new CANNON.Body({
            mass: this.parameters.mass,
            shape: shape,
            material: this.physics.bulletMaterial,
        })

        // Set the original position
        this.body.position.set(this.parameters.position.x, this.parameters.position.y, this.parameters.position.z)
        // Set the velocity
        this.body.velocity.set(this.spaceship_velocity.x, this.spaceship_velocity.y, this.spaceship_velocity.z)

        // Fint the vector direction of the spaceship to calculate the force
        const forward_vector = new CANNON.Vec3(0, 0, 1)
        const rotated_direction_vector = new CANNON.Vec3()
        this.spaceship_quaternion.vmult(forward_vector, rotated_direction_vector)

        const bullet_force = new CANNON.Vec3(
            rotated_direction_vector.x * this.parameters.force_power,
            rotated_direction_vector.y * this.parameters.force_power,
            rotated_direction_vector.z * this.parameters.force_power
        );

        // Apply the force to the bullet
        this.body.applyForce(bullet_force, this.body.position)

        this.physics.world.addBody(this.body)

        this.physics.objectsToUpdate.push({
            mesh: this.mesh,
            body: this.body
        })
    }

    setCollisionListener() {
        /* Use arrow function to keep context of Bullet as this */
        this.body.addEventListener('collide', (event) => {
            if (event.body.material.name == 'asteroidMaterial') {
                this.destroy()
            }
        });
    }

    update() {
        if ((this.time.elapsed - this.instanciated_time) > this.parameters.life_time) {
            this.destroy()
        }
    }

    destroy() {
        this.body.removeEventListener('collide')
        this.geometry.dispose()
        this.material.dispose()
        this.scene.remove(this.mesh)
        this.parameters.alive = false
    }
}