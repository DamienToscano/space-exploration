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

        this.setEnvironmentMap()
        this.setAmbientLight()
        this.setDirectionalLight()
        this.setStars()
        this.setLoader()
    }

    setEnvironmentMap() {
        this.environmentMap = this.resources.items.environmentMap
        // this.environmentMap.mapping = THREE.EquirectangularReflectionMapping
        this.environmentMap.encoding = THREE.sRGBEncoding
        this.scene.background = this.environmentMap
        this.scene.environment = this.environmentMap
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1)
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