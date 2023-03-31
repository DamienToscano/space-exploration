import * as THREE from "three"
import Experience from "../Experience.js"
import * as CANNON from 'cannon-es'
import { threeToCannon, ShapeType } from 'three-to-cannon';

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
        horizontalRotationAxis: 0.05,
        horizontalRotationForce: 1.5,
        verticalRotationAxis: 0.01,
        verticalRotationForce: 0.25,
        velocityLimit: 10,
        angularVelocityLimitX: 0.05,
        angularVelocityLimitY: 0.05,
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
        // this.dom.turboJauge = document.querySelectorAll('.turbo-jauge-unit')
        this.dom.speedValue = document.querySelector('#speedometer')
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

        this.camera.instance.position.set(0, 5, - 50)
        // Rotate the camera 180° on the X axis to match the spaceship
        this.camera.instance.rotation.y = Math.PI
        this.spaceship.add(this.camera.instance)
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
            material: this.physics.spaceshipMaterial,
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
            this.parameters.forceAxis.x = - this.parameters.horizontalRotationAxis
            this.parameters.force.x = this.parameters.horizontalRotationForce
        })

        this.controls.on('leftEnd', () => {
            this.parameters.forceAxis.x = 0
            this.parameters.force.x = 0
        })

        this.controls.on('rightStart', () => {
            this.parameters.forceAxis.x = this.parameters.horizontalRotationAxis
            this.parameters.force.x = - this.parameters.horizontalRotationForce
        })

        this.controls.on('rightEnd', () => {
            this.parameters.forceAxis.x = 0
            this.parameters.force.x = 0
        })

        // Vertical rotation
        this.controls.on('upStart', () => {
            this.parameters.forceAxis.y = this.parameters.verticalRotationAxis
            this.parameters.force.y = - this.parameters.verticalRotationForce
        })

        this.controls.on('upEnd', () => {
            this.parameters.forceAxis.y = 0
            this.parameters.force.y = 0
        })

        this.controls.on('downStart', () => {
            this.parameters.forceAxis.y = - this.parameters.verticalRotationAxis
            this.parameters.force.y = this.parameters.verticalRotationForce
        })

        this.controls.on('downEnd', () => {
            this.parameters.forceAxis.y = 0
            this.parameters.force.y = 0
        })
    }

    updateSpaceship() {

        this.current_force = {
            x: 0,
            y: 0,
            z: 0
        }

        if (this.body.velocity.z < this.parameters.velocityLimit) {
            this.current_force.z = this.parameters.force.z
        }
        if (Math.abs(this.body.angularVelocity.y) < this.parameters.angularVelocityLimitY) {
            this.current_force.y = this.parameters.force.y
        }
        if (Math.abs(this.body.angularVelocity.x) < this.parameters.angularVelocityLimitX && Math.abs(this.body.angularVelocity.z) < this.parameters.angularVelocityLimitX) {
            this.current_force.x = this.parameters.force.x
        }

        this.body.applyLocalForce(this.current_force, new CANNON.Vec3(0, 0, 1))

        // Limit angular velocity when we hit something and the spaceship is rotating crazy
        if (this.body.angularVelocity.x > this.parameters.angularVelocityLimitX) {
            this.body.angularVelocity.x -= 0.01
        }

        if (this.body.angularVelocity.x < - this.parameters.angularVelocityLimitX) {
            this.body.angularVelocity.x += 0.01
        }

        if (this.body.angularVelocity.y > this.parameters.angularVelocityLimitY) {
            this.body.angularVelocity.y -= 0.01
        }

        if (this.body.angularVelocity.y < - this.parameters.angularVelocityLimitY) {
            this.body.angularVelocity.y += 0.01
        }

        if (this.body.angularVelocity.z > this.parameters.angularVelocityLimitY) {
            this.body.angularVelocity.z -= 0.01
        }

        if (this.body.angularVelocity.z < - this.parameters.angularVelocityLimitY) {
            this.body.angularVelocity.z += 0.01
        }

        // TODO: Rotate the body when we move the spaceship
    }

    dataManagement() {
        /************************
            SPEED DATA MANAGEMENT
        *************************/
        this.dom.speedValue.textContent = Math.abs(this.body.velocity.z.toFixed(0))

        /************************
            TURBO DATA MANAGEMENT
        *************************/

        // If pressing turbo and turbo is allowed, decrease turbo if possible
        /* if (this.controls.actions.turbo && this.parameters.turboAllowed) {
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
        } */
    }

    updateCamera() {

        /* TODO: See how to smooth stuff when we reach the limit */
        let x_offset = 0 + Math.round(this.body.angularVelocity.y * 10 * 100) / 100
        let y_offset = 5 + Math.round(this.body.angularVelocity.x * 10 * 100) / 100
        let z_offset = - 50 - this.body.velocity.z

        this.camera.instance.position.set(
            x_offset,
            y_offset,
            z_offset
        )

        // console.log(this.camera.instance.position)

    }

    update() {

        this.dataManagement()

        /************************
            PHYSICS
        *************************/

        this.updateSpaceship()

        /************************
            CAMERA
        *************************/

        this.updateCamera()
    }
}