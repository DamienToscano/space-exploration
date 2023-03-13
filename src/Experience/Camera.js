import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.offset = new THREE.Vector3(0, 10, -50)

        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 1, 2000)
        this.instance.position.set(this.offset.x, this.offset.y, this.offset.z)
        this.scene.add(this.instance)
    }

    setControls()
    {
        // this.controls = new OrbitControls(this.instance, this.canvas)
        // this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        // this.controls.update()
    }
}