import * as THREE from "three"
import Experience from "../Experience.js"
import * as CANNON from 'cannon-es'

export default class Spaceship {
    parameters = {
        width: 2,
        height: 1,
        depth: 4,
        color: '#ffeded',
        cruiseSpeed: 2,
        turboSpeed: 20,
        turbo: 100,
        turboAllowed: true,
        mass: 1,
        position: { x: 0, y: 0, z: 0 },
    }

    dom = {}

    constructor() {
        this.experience = new Experience()
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.physics = this.experience.physics
        this.controls = this.experience.controls
        this.dom.turbo = document.querySelector('.turbo-value')

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Stars')
        }

        this.setSpaceship()
        this.setPhysics()
        this.setControls()

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

    setMaterial() {
        // Add spaceship material to the physic world
        this.physics.spaceshipMaterial = new CANNON.Material('spaceshipMaterial')
    }

    setBody() {
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

    setControls() {

        // Unactive turbo when space key is released
        this.controls.on('turboEnd', () => {
            this.parameters.turboAllowed = false
        })
    }

    update() {

        // Monter

        // Descendre

        // Droite

        // Gauche

        /************************
            TURBO DATA MANAGEMENT
        *************************/

        // If pressing turbo and turbo is allowed, decrease turbo if possible
        if (this.controls.actions.turbo && this.parameters.turboAllowed) {
            if (this.parameters.turbo > 0) {
                // If we still have turbo, lower the jauge
                this.parameters.turbo -= 1
            } else if (this.parameters.turbo == 0) {
                // If we don't have turbo anymore, disable it
                this.parameters.turboAllowed = false
            }
        }

        // If not pressing turbo or tubo not allowed, increase turbo if possible
        if (!this.controls.actions.turbo || !this.parameters.turboAllowed) {
            if (this.parameters.turbo < 100) {
                // If turbo jauge is not full, fill it
                this.parameters.turbo += 0.5
            } else {
                // If turbo jauge is full, allow turbo again
                this.parameters.turboAllowed = true
            }
        }

        if (this.parameters.turboAllowed == true) {
            this.dom.turbo.style.color = '#b3e6b3'
        } else {
            this.dom.turbo.style.color = '#ff9999'
        }

        this.dom.turbo.innerHTML = this.parameters.turbo

        /************************
            PHYSICS
        *************************/

        // Increase and decrease speed according to the turbo
        if (this.controls.actions.turbo && this.parameters.turboAllowed == true) {
            // Make speed increase progressively
            if (this.body.velocity.z < this.parameters.turboSpeed) {
                this.body.velocity.z += 1
            } else {
                this.body.velocity.z = this.parameters.turboSpeed
            }
        } else {
            // Make speed decrease progressively
            if (this.body.velocity.z > this.parameters.cruiseSpeed) {
                this.body.velocity.z -= 1
            } else {
                this.body.velocity.z = this.parameters.cruiseSpeed
            }
        }

        /************************
            CAMERA
        *************************/
        this.camera.instance.position.copy(this.body.position).add(this.camera.offset)
        this.camera.instance.lookAt(this.mesh.position)
    }
}