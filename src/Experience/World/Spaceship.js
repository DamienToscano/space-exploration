import * as THREE from "three"
import Experience from "../Experience.js"
import * as CANNON from 'cannon-es'

export default class Spaceship {
    parameters = {
        width: 2,
        height: 1,
        depth: 4,
        color: '#ffeded',
        cruiseSpeed: 1,
        maxSpeed: 20,
        speed: 1,
        turbo: 100,
        turboMode: false,
        turboAllowed: true,
        mass: 2,
        position : {x: 0, y: 0, z: 0},
    }

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.physics = this.experience.physics

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Stars')
        }
        
        this.setSpaceship()
        this.setPhysics()

    }

    setSpaceship() {
        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.BoxBufferGeometry(1, 1, 1)
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            color: this.parameters.color,
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.mesh)
        this.mesh.scale.set(this.parameters.width, this.parameters.height, this.parameters.depth)
        this.mesh.position.copy(this.parameters.position)
        this.scene.add(this.mesh)
    }

    setPhysics() {
        this.setMaterial()
        this.setBody()
    }

    setMaterial()
    {
        // Add spaceship material to the physic world
        this.physics.spaceshipMaterial = new CANNON.Material('spaceshipMaterial')
    }

    setBody()
    {
        // Create rectangle test body
        // TODO: Adapt body form when the spaceship model is used

        // For boxes in cannon, we have to divide the dimensions by 2
        const shape = new CANNON.Box(new CANNON.Vec3(this.parameters.width / 2, this.parameters.height / 2, this.parameters.depth / 2))

        this.body = new CANNON.Body({
            mass: this.parameters.mass,
            shape: shape,
            position: this.parameters.position,
            material: this.physics.spaceshipMaterial,
        })
        this.body.position.copy(this.parameters.position)
        this.physics.world.addBody(this.body)

        this.physics.objectsToUpdate.push({
            mesh: this.mesh,
            body: this.body
        })

    }

    // TODO: Continue here with controls
    update()
    {
        // console.log(this.body.position)

    }
}