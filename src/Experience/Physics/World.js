import * as CANNON from 'cannon-es'

export default class World {
    constructor()
    {
        this.setWorld()
    }

    setWorld()
    {
        this.world = new CANNON.World()

        // Update broadphase to have better performance
        this.world.broadphase = new CANNON.SAPBroadphase(this.world)

        // Allow sleep on objects to avoid comparing not moving objects
        this.world.allowSleep = true

        // Add some gravity to test
        this.world.gravity.set(0, -9.82, 0)
    }
}