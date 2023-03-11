import * as THREE from "three"
import Experience from "../../Experience.js"
import Planet from "../Planet.js"
import * as CANNON from 'cannon-es'
import { threeToCannon, ShapeType } from 'three-to-cannon';

export default class BrownSpike extends Planet {
    parameters = {
        // name: 'brownSpike',
        mass: 0,
        position: { x: 0, y: 0, z: 0 },
        dimensions: new THREE.Vector3(0, 0, 0),
    }

    constructor(size) {
        super(size)
    }

    setModel() {
        this.model = this.resources.items.brownSpikePlanet
        this.planet = this.model.scene.children[0]
        this.planet.scale.set(this.size, this.size, this.size)
        this.planet.position.copy(this.parameters.position)
        this.scene.add(this.planet)
    }

    // calculateDimensions() {
    //     const box = new THREE.Box3()
    //     box.setFromObject(this.planet)
    //     box.getSize(this.parameters.dimensions)
    // }

    // setPhysics() {
    //     this.setMaterial()
    //     this.setBody()
    // }

    // setMaterial() {
    //     this.physics.planetMaterial = new CANNON.Material('planetMaterial')
    // }

    setBody() {
        // Convert the THREE.Mesh to a CANNON.Body using three-to-cannon
        const result = threeToCannon(this.planet, {type: ShapeType.HULL});
        this.body = new CANNON.Body({
            mass: this.parameters.mass,
            shape: result.shape,
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