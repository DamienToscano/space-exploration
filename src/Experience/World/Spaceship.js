import * as THREE from "three"
import Experience from "../Experience.js"
import * as CANNON from 'cannon-es'
import { threeToCannon, ShapeType } from 'three-to-cannon';
import Bullet from "./Bullet.js";

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
        angularVelocityLimitY: 0.10,
        lock_force_y: false,
        lock_force_x: false,
        horizontal_offset: 0,
        vertical_offset: 0,
        horizontal_offset_limit: 1,
        vertical_offset_limit: 1,
        firing_delay: 150,
        cannons: {
            up_left: {x: 2.04, y: 1.64, z: 0.5},
            up_right: {x: -2.04, y: 1.64, z: 0.5},
            down_left: {x: 2.04, y: 1.33, z: 0.33},
            down_right: {x: -2.04, y: 1.33, z: 0.33},
        },
    }

    dom = {}

    constructor() {
        this.experience = new Experience()
        this.time = this.experience.time
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.physics = this.experience.physics
        this.controls = this.experience.controls
        this.world = this.experience.world
        this.dom.speedValue = document.querySelector('#speedometer')
        this.dom.warning = document.querySelector('#warning-container')
        this.warning_alert = false
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

        /* LASERS */
        /* TODO: Add lasers : https://gitlab.com/LunakepioFR/flightsim */
        this.firing = false
        this.bullets = []
        this.last_fire_time = 0

        this.setAudio()
        this.setModel()
        this.setCannons()
        this.setPhysics()
        this.setControls()


    }

    setModel() {
        this.model = this.resources.items.spaceship
        this.spaceship = this.model.scene.children[0]
        /* Allow future opacity change */
        this.spaceship.material.transparent = true
        this.spaceship.position.copy(this.parameters.position)
        this.scene.add(this.spaceship)

        this.camera.instance.position.set(0, 5, - 50)
        // Rotate the camera 180° on the X axis to match the spaceship
        this.camera.instance.rotation.y = Math.PI
        this.spaceship.add(this.camera.instance)
    }

    setCannons() {
        const geometry = new THREE.SphereGeometry(0.1, 4, 4)
        const material = new THREE.MeshStandardMaterial({
            color: 0x6E6E6E,
        })

        this.up_left_cannon = new THREE.Mesh(geometry, material)
        this.up_right_cannon = new THREE.Mesh(geometry, material)
        this.down_left_cannon = new THREE.Mesh(geometry, material)
        this.down_right_cannon = new THREE.Mesh(geometry, material)

        this.up_left_cannon.position.set(this.parameters.cannons.up_left.x, this.parameters.cannons.up_left.y, this.parameters.cannons.up_left.z)
        this.up_right_cannon.position.set(this.parameters.cannons.up_right.x, this.parameters.cannons.up_right.y, this.parameters.cannons.up_right.z)
        this.down_left_cannon.position.set(this.parameters.cannons.down_left.x, this.parameters.cannons.down_left.y, this.parameters.cannons.down_left.z)
        this.down_right_cannon.position.set(this.parameters.cannons.down_right.x, this.parameters.cannons.down_right.y, this.parameters.cannons.down_right.z)

        this.spaceship.add(this.up_left_cannon, this.up_right_cannon, this.down_left_cannon, this.down_right_cannon)
    }

    setPhysics() {
        this.setMaterial()
        this.setBody()
    }

    setMaterial() {
        this.physics.spaceshipMaterial = new CANNON.Material('spaceshipMaterial')
    }

    setAudio() {
        this.camera.sound.setBuffer(this.resources.items.pew)
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

    playFireSound() {
        this.camera.sound.isPlaying = false
        this.camera.sound.play()
    }

    fire() {
        // Calculate up left fire position

        // TODO: Le calcul ne fonctionn pas, voir pourquoi le getWorldPosition ne fonctionne pas sur le mesh ? 
        let fire_position = new THREE.Vector3()
        fire_position.copy(this.spaceship.position)
        let cannon_offset = this.up_left_cannon.position
        fire_position.add(cannon_offset)

        // Create the bullet
        let bullet = new Bullet(fire_position, this.body.velocity, this.body.quaternion)

        // TODO: Continue for the three others bullets

        this.bullets.push(bullet)

        // Play audio
        this.playFireSound()
    }

    setControls() {

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

        /* Lasers */
        this.controls.on('fireStart', () => {
            this.firing = true
        })

        this.controls.on('fireEnd', () => {
            this.firing = false
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
        if (Math.abs(this.body.angularVelocity.y) < this.parameters.angularVelocityLimitY && !this.lock_force_y) {
            this.current_force.y = this.parameters.force.y
        }
        else {
            this.lock_force_y = true
            // Wait 1 second before unlocking the force
            setTimeout(() => {
                this.lock_force_y = false
            }, 1000)
        }

        if (Math.abs(this.body.angularVelocity.x) < this.parameters.angularVelocityLimitX && Math.abs(this.body.angularVelocity.z) < this.parameters.angularVelocityLimitX && !this.lock_force_x) {
            this.current_force.x = this.parameters.force.x
        }
        else {
            this.lock_force_x = true
            // Wait 1 second before unlocking the force
            setTimeout(() => {
                this.lock_force_x = false
            }, 1000)
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

        /* Manage transparency when reset position after scene limit reached */
        if (this.spaceship.material.opacity < 1) {
            this.spaceship.material.opacity += 0.005
        }
    }

    dataManagement() {
        /************************
            SPEED DATA MANAGEMENT
        *************************/
        this.dom.speedValue.textContent = Math.abs(this.body.velocity.z.toFixed(0))
        this.dom.speedValue.style.opacity = Math.abs(this.body.velocity.z.toFixed(0)) / 10 + 0.1

        /************************
            DISTANCE MANAGEMENT
        *************************/

        // Distance between the spaceship and origin
        let distance = Math.sqrt(Math.pow(this.body.position.x, 2) + Math.pow(this.body.position.y, 2) + Math.pow(this.body.position.z, 2))

        // If the spaceship is too far, we display a warning
        if (distance > this.world.parameters.size) {
            this.dom.warning.style.display = 'flex'
            this.warning_alert = true

            // If the spaceship is way too far, we reset the position
            if (distance > this.world.parameters.size * 1.2) {
                this.body.position.x = 0
                this.body.position.y = 0
                this.body.position.z = 0

                /* Make it transparent */
                this.spaceship.material.opacity = 0.1
            }
        } else if (this.warning_alert) {
            this.dom.warning.style.display = 'none'
            this.warning_alert = false
        }

    }

    updateCamera() {

        if (this.controls.actions.left) {
            if (this.parameters.horizontal_offset < this.parameters.horizontal_offset_limit) {
                this.parameters.horizontal_offset += 0.01
            }
        }
        else if (this.controls.actions.right) {
            if (this.parameters.horizontal_offset > - this.parameters.horizontal_offset_limit) {
                this.parameters.horizontal_offset -= 0.01
            }
        }
        else {
            if (this.parameters.horizontal_offset > 0) {
                this.parameters.horizontal_offset -= 0.01
            }
            else if (this.parameters.horizontal_offset < 0) {
                this.parameters.horizontal_offset += 0.01
            }
        }

        if (this.controls.actions.up) {
            if (this.parameters.vertical_offset > - this.parameters.vertical_offset_limit) {
                this.parameters.vertical_offset -= 0.01
            }
        }
        else if (this.controls.actions.down) {
            if (this.parameters.vertical_offset < this.parameters.vertical_offset_limit) {
                this.parameters.vertical_offset += 0.01
            }
        }
        else {
            if (this.parameters.vertical_offset > 0) {
                this.parameters.vertical_offset -= 0.01
            }
            else if (this.parameters.vertical_offset < 0) {
                this.parameters.vertical_offset += 0.01
            }
        }

        let x_offset = 0 + this.parameters.horizontal_offset
        let y_offset = 5 + this.parameters.vertical_offset
        let z_offset = - 50 - this.body.velocity.z

        this.camera.instance.position.set(
            x_offset,
            y_offset,
            z_offset
        )
    }

    fireManagement() {
        if (this.firing) {

            // Regulate the shoot ratio
            if (this.time.elapsed - this.last_fire_time > this.parameters.firing_delay) {
                this.fire()
                this.last_fire_time = this.time.elapsed;
            }
        }

        // Update the bullets
        this.bullets.forEach((element, index) => {
            /* If not alive, remove it from the bullets list */
            if (! element.parameters.alive) {
                this.bullets.splice(index, 1)
            }
        });
    }



    update() {

        this.dataManagement()

        /************************
            PHYSICS
        *************************/

        this.updateSpaceship()

        this.fireManagement()

        /************************
            CAMERA
        *************************/

        this.updateCamera()

        if (this.bullets) {
            for (let bullet of this.bullets) {
                bullet.update()
            }
        }
    }
}