import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Object from './Utils/Object.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import Loader from './World/Loader.js'
import sources from './sources.js'
import Physics from './Physics/World.js'
import CannonDebugger from 'cannon-es-debugger'
import Controls from './World/Controls.js'

let instance = null

export default class Experience {
    constructor(_canvas) {
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.object = new Object()
        this.scene = new THREE.Scene()
        this.sources = sources
        this.loader = new Loader()
        this.resources = new Resources(this.sources, this.loader.getLoadingManager())
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.physics = new Physics()
        this.controls = new Controls()

        // Mobile or desktop check
        const mobileAlert = document.getElementById('mobile-alert')
        const launchButton = document.getElementById('launch-button')

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.isMobile = true

            // Display mobile alert
            mobileAlert.classList.remove('hidden')
            launchButton.classList.add('hidden')

        } else {
            this.isMobile = false
            mobileAlert.classList.add('hidden')
            launchButton.classList.remove('hidden')
        }



        // Cannon Debugger
        // this.cannonDebugger = new CannonDebugger(this.scene, this.physics.world)

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        // Only run on desktop
        if (this.isMobile) {
            return
        }

        this.camera.update()

        if (this.world)
            this.world.update()

        if (this.renderer)
            this.renderer.update()

        if (this.physics) {
            this.physics.update()
            // this.cannonDebugger.update()
        }
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active)
            this.debug.ui.destroy()
    }
}