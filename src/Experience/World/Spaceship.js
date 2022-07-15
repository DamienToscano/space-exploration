import * as THREE from "three"
import Experience from "../Experience.js"
import * as CANNON from 'cannon-es'

export default class Spaceship {
    parameters = {
        width: 2,
        height: 1,
        depth: 4,
        color: '#ffeded',
        cruiseSpeed: 5,
        turboSpeed: 40,
        turbo: 0,
        turboAllowed: false,
        mass: 1,
        position: { x: 0, y: 0, z: 0 },
        rotation: {
            up: - Math.PI / 12, down: Math.PI / 12, left: Math.PI / 12, right: - Math.PI / 12
        },
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
        this.currentSpeed = this.parameters.cruiseSpeed
        this.angles =  {
            x: 0, y: 0
        }
        this.angleVariation = {
            current: 0,
            max: 0.05,
            mode: 'left'
        }
        this.offset = this.camera.offset


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

        /************************
            PHYSICS
        *************************/

        // Increase and decrease speed according to the turbo
        if (this.controls.actions.turbo && this.parameters.turboAllowed == true) {
            // Make speed increase progressively
            if (this.currentSpeed < this.parameters.turboSpeed) {
                this.currentSpeed += 1
            } else {
                this.currentSpeed = this.parameters.turboSpeed
            }
        } else {
            // Make speed decrease progressively
            if (this.currentSpeed > this.parameters.cruiseSpeed) {
                this.currentSpeed -= 1
            } else {
                this.currentSpeed = this.parameters.cruiseSpeed
            }
        }

        // Calculate angleX according to the up / down action
        if (this.controls.actions.up) {
            this.angles.x += 0.01
        } else if (this.controls.actions.down) {
            this.angles.x -= 0.01
        }

        /** TURN LEFT */
        if (this.controls.actions.left) {

            // If turning right before, reset angle variation
            if (this.angleVariation.mode == 'right') {
                this.angleVariation.mode = 'left'
                this.angleVariation.current = 0
            }

            // If angle variation is not at its max, increase it
            if (this.angleVariation.current < this.angleVariation.max) {
                this.angleVariation.current += 0.001
            }

            // Turn left
            this.angles.y += this.angleVariation.current

            /** TURN RIGHT */
        } else if (this.controls.actions.right) {
            
            // If turning left before, reset angle variation
            if (this.angleVariation.mode == 'left') {
                this.angleVariation.mode = 'right'
                this.angleVariation.current = 0
            }

            // If angle variation is not at its max, increase it
            if (this.angleVariation.current < this.angleVariation.max)
            {
                this.angleVariation.current += 0.001
            }

            // Turn right
            this.angles.y -= this.angleVariation.current

            /** NO HORIZONTAL TURN */
        } else {
            // Decreament angle variation
            if (this.angleVariation.current > 0) {

                if (this.angleVariation.mode == 'left') {
                    this.angles.y += this.angleVariation.current
                }

                if (this.angleVariation.mode == 'right') {
                    this.angles.y -= this.angleVariation.current
                }

                this.angleVariation.current -= 0.005
            }
        }

        // Calculate and apply the rotation on the body
        let quatX = new CANNON.Quaternion();
        let quatY = new CANNON.Quaternion();
        quatX.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), this.angles.x);
        quatY.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), this.angles.y);
        let quaternion = quatY.mult(quatX);
        quaternion.normalize();
        this.body.quaternion.copy(quaternion);

        
        // Move the body in direction of the body rotation
        var localVelocity = new CANNON.Vec3(0, 0, this.currentSpeed);
        var worldVelocity = this.body.quaternion.vmult(localVelocity);
        this.body.velocity.copy(worldVelocity);
        
        /************************
            CAMERA
        *************************/
        let offset = this.camera.offset.clone()
        
        // Move camera when boost
        offset.z -= this.currentSpeed * 0.2
        offset.x -= this.currentSpeed * 0.1

        // Update camera offset according to the body horizontal rotation

        // View from side
        offset.applyQuaternion(new THREE.Quaternion(0, this.body.quaternion.y, 0, this.body.quaternion.w))

        // View feom behind
        // offset.applyQuaternion(this.body.quaternion)

        this.camera.instance.position.copy(this.body.position).add(offset)

        // Make the camera look the body position
        this.camera.instance.lookAt(this.mesh.position)
    }
}