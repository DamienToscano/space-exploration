import * as THREE from 'three'
import Experience from '../Experience.js'
import Stars from './Stars.js'
import Loader from './Loader.js'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setAmbientLight()
        this.setDirectionalLight()
        this.setStars()
        this.setLoader()
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(this.ambientLight)
    }

    setDirectionalLight() {
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        this.directionalLight.position.set(0, 0, 1)
        this.directionalLight.castShadow = true
        this.scene.add(this.directionalLight)
    }

    setStars() {
        this.stars = new Stars()
    }

    setLoader() {
        this.loader = new Loader()
    }
}