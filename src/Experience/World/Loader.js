import * as THREE from "three"
import Experience from "../Experience.js";

export default class Loader {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.launchButton = document.querySelector('.launch-button')

        this.setOverlay()
        this.setLoadingManager()
    }

    setOverlay() {
        // this.overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
        // this.overlayMaterial = new THREE.ShaderMaterial({
        //     transparent: true,
        //     uniforms: {
        //         uAlpha: { value: 1 },
        //     },
        //     vertexShader: `
        //     void main()
        //     {
        //         // We place the plane where we need on the screen by removing the projectionMatrix and modelViewMatrix
        //         gl_Position = vec4(position, 1.0);
        //     }
        //     `,
        //     fragmentShader: `
        //     uniform float uAlpha;

        //     void main()
        //     {
        //         gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        //     }
        //     `
        // })
        // this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial)
        // this.scene.add(this.overlay)

        // Add fix full page div to loader class
    }

    setLoadingManager() {      
        // this.loaderContainer = document.querySelector('.loader')
        // Change color of first span of launch button
        this.launchButton.querySelector('span').style.color = '#65FFDA'
        // TODO: Utiliser ça dynamiquement dans le progress pour allumer une par une les lettres
        

        this.loadingManager = new THREE.LoadingManager(
            // Loaded
            () => {
                // Fade out loader screen
                // this.loaderContainer.style.opacity = 0
                console.log('Loader loaded')

                window.setTimeout(() => {
                    // Destroy the loader
                    // this.destroy()
                }, 500)
            },
            // Progress
            (itemUrl, itemsLoaded, itemsTotal) => {
                // Update the loading bar, with the item loaded and the item total number to load
                const progressRatio = itemsLoaded / itemsTotal
                // this.loaderContainer.html = progressRatio
                console.log(`${itemUrl} ${itemsLoaded}/${itemsTotal}`)
                console.log(progressRatio)

                // TODO: Faire le changement de couleur de lettres ici
            }
        )
    }

    getLoadingManager() {
        return this.loadingManager
    }

    destroy() {
        // Remove .loader from DOM
        this.loaderContainer.remove()
    }
}