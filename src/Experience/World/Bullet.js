import * as THREE from "three"
import Experience from "../Experience.js"
import * as CANNON from 'cannon-es'

export default class Bullet {

    parameters = {
        life_time: 3000,
        color: 0x84B3FF,
        alive: true,
        radius: 0.3,
        mass: 0.1,
        position: { x: 0, y: 0, z: 0 },
    }

    constructor() {
        this.experience = new Experience()
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.physics = this.experience.physics

        this.instanciated_time = this.time.elapsed

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        this.setPhysics()
    }

    setGeometry() {
        /* TODO: Passer ça en instance geometry */
        this.geometry = new THREE.SphereGeometry(this.parameters.radius, 4, 4)
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: this.parameters.color,
        })
    }

    setMesh() {
        console.log('Setting the bullet model')
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        this.scene.add(this.mesh)
    }

    setPhysics() {
        console.log('Setting the bullet physics')
        this.setPhysicsMaterial()
        this.setBody()
    }

    setPosition(x, y, z) {
        this.body.position.set(x, y, z)
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

        this.physics.world.addBody(this.body)

        this.physics.objectsToUpdate.push({
            mesh: this.mesh,
            body: this.body
        })

        // TODO: Apply local impulse to body
    }

    update() {
        if ((this.time.elapsed - this.instanciated_time) > this.parameters.life_time) {
            console.log('Destroying the bullet')
            this.destroy()

        }
    }

    destroy() {
        this.geometry.dispose()
        this.material.dispose()
        this.scene.remove(this.mesh)
        this.parameters.alive = false
    }
}