import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// Import first person controls
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 1, 2000)
        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        // this.controls = new FirstPersonControls(this.instance, this.canvas)
        // Tester d'implémeter ça https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_terrain.html
        // Ca sera plus facile pour explorer le monde
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}