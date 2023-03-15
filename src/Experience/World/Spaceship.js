import * as THREE from "three"
import Experience from "../Experience.js"
import * as CANNON from 'cannon-es'
import { threeToCannon, ShapeType } from 'three-to-cannon';
import { apply } from "file-loader";

export default class Spaceship {
    parameters = {
        cruiseSpeed: 0,
        turboSpeed: 40,
        turbo: 0,
        turboAllowed: false,
        mass: 1,
        position: { x: 0, y: 0, z: 0 },
        rotation: {
            up: - Math.PI / 12, down: Math.PI / 12, left: Math.PI / 12, right: - Math.PI / 12
        },
        // Force applied to the spaceship
        force: { x: 0, y: 0, z: 0 },
        // Axis of the force
        forceAxis: { x: 0, y: 0, z: 0 },
        accelerationForce: 10,
        horizontalRotationForce: 0.1,
        verticalRotationForce: 0.1,
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
        this.dom.turboJauge = document.querySelectorAll('.turbo-jauge-unit')
        this.dom.speedValue = document.querySelector('#speed-value')
        this.currentSpeed = this.parameters.cruiseSpeed
        this.angles = {
            x: 0, y: 0, z: 0
        }
        this.anglesMax = {
            x: 1,
            z: 0.3
        }
        this.angleVariation = {
            current: 0,
            max: 0.05,
            mode: 'left'
        },
            this.tiltVariation = {
                current: 0,
                max: 0.5,
                mode: 'left',
            },
            this.offset = this.camera.offset

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Stars')
        }

        this.setModel()
        this.setPhysics()
        this.setControls()

    }

    setModel() {
        this.model = this.resources.items.spaceship
        this.spaceship = this.model.scene.children[0]
        this.spaceship.position.copy(this.parameters.position)
        this.scene.add(this.spaceship)
    }

    setPhysics() {
        this.setMaterial()
        this.setBody()
    }

    setMaterial() {
        this.physics.spaceshipMaterial = new CANNON.Material('spaceshipMaterial')
    }

    setBody() {
        // Convert the THREE.Mesh to a CANNON.Body using three-to-cannon
        const result = threeToCannon(this.spaceship, { type: ShapeType.HULL });
        this.body = new CANNON.Body({
            mass: this.parameters.mass,
            shape: result.shape,
            position: this.parameters.position,
            material: this.physics.planetMaterial,
            // Avoid the spaceship to be asleep
            allowSleep: false,
            // Make the spaceship decelerate faster than normal
            linearDamping: 0.1,
        })
        this.physics.world.addBody(this.body)

        this.physics.objectsToUpdate.push({
            mesh: this.spaceship,
            body: this.body
        })
    }

    setControls() {

        // Unactive turbo when space key is released
        this.controls.on('turboEnd', () => {
            this.parameters.turboAllowed = false
        })

        // Acceleration
        this.controls.on('accelerateStart', () => {
            this.parameters.force.z = this.parameters.accelerationForce
        })

        this.controls.on('accelerateEnd', () => {
            this.parameters.force.z = 0
        })

        // Horizontal rotation
        this.controls.on('leftStart', () => {
            this.parameters.forceAxis.x = - this.parameters.horizontalRotationForce
        })

        this.controls.on('leftEnd', () => {
            this.parameters.forceAxis.x = 0
        })

        this.controls.on('rightStart', () => {
            this.parameters.forceAxis.x = this.parameters.horizontalRotationForce
        })

        this.controls.on('rightEnd', () => {
            this.parameters.forceAxis.x = 0
        })

        // Vertical rotation
        this.controls.on('upStart', () => {
            this.parameters.forceAxis.y = this.parameters.verticalRotationForce
        })

        this.controls.on('upEnd', () => {
            this.parameters.forceAxis.y = 0
        })

        this.controls.on('downStart', () => {
            this.parameters.forceAxis.y = - this.parameters.verticalRotationForce
        })

        this.controls.on('downEnd', () => {
            this.parameters.forceAxis.y = 0
        })
    }

    updateSpaceship() {

        // TODO: Ne pas appliquer la condition sur la vélocité, mais plutôt changer la valeur de la force en fonction de la vélocité

        if (this.body.velocity.z < 10) {
            this.body.applyLocalForce(this.parameters.force, this.parameters.forceAxis)
        }

        // console.log(this.body.velocity.z, this.body.force.z)
        
        // console.log(this.body.force, this.body.velocity)
        
        
    }

    dataManagement() {
        /************************
            SPEED DATA MANAGEMENT
        *************************/
        this.dom.speedValue.textContent = this.currentSpeed

        /************************
            TURBO DATA MANAGEMENT
        *************************/

        // If pressing turbo and turbo is allowed, decrease turbo if possible
        if (this.controls.actions.turbo && this.parameters.turboAllowed) {
            if (this.parameters.turbo > 0) {
                // If we still have turbo, lower the jauge
                this.parameters.turbo -= 2
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

        let backgroundColor = ''

        if (this.parameters.turboAllowed == true) {
            backgroundColor = '#b3e6b3'
        } else {
            backgroundColor = '#ff9999'
        }

        // Fill turbo jauge
        let fillValue = Math.floor(this.parameters.turbo / 10)

        for (let i = 0; i < this.dom.turboJauge.length; i++) {
            if (i < fillValue) {
                this.dom.turboJauge[i].style.backgroundColor = backgroundColor
            } else {
                this.dom.turboJauge[i].style.backgroundColor = '#0E2241'
            }
        }
    }

    update() {

        // TODO: Fix spaceship rotation when it collides with an asteroid and spaceship controls

        this.dataManagement()

        /************************
            PHYSICS
        *************************/

        this.updateSpaceship()

        /************************
            CAMERA
        *************************/
        let offset = this.camera.offset.clone()

        // Move camera when boost
        offset.z -= this.currentSpeed * 0.2

        // Update camera offset according to the body horizontal rotation

        // View from side
        // TODO: Fix camera rotation according to spaceship
        offset.applyQuaternion(new THREE.Quaternion(this.body.quaternion.x, this.body.quaternion.y, 0, this.body.quaternion.w))
        // console.log(this.body.quaternion)

        this.camera.instance.position.copy(this.body.position).add(offset)

        // Make the camera look the body position
        this.camera.instance.lookAt(this.spaceship.position)
    }
}