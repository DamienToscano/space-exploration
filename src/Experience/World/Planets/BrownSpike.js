import Planet from "../Planet.js"
import * as CANNON from 'cannon-es'
import { threeToCannon, ShapeType } from 'three-to-cannon'

export default class BrownSpike extends Planet {
    parameters = {
        // name: 'brownSpike',
        mass: 0,
        position: { x: 0, y: 0, z: 0 },
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

    setBody() {
        // Convert the THREE.Mesh to a CANNON.Body using three-to-cannon
        const result = threeToCannon(this.planet, {type: ShapeType.SPHERE});
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
}