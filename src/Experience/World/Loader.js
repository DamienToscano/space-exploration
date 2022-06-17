import * as THREE from "three"
import Experience from "../Experience.js";

export default class Loader {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.launchButton = document.querySelector('.launch-button')
        this.copyright = document.querySelector('.copyright')

        this.setOverlay()
        this.setLoadingManager()
    }

    setOverlay() {
        // Add fix full page div to loader class
    }

    setLoadingManager() {
        this.loaderContainer = document.querySelector('.loader')
        // Change color of first span of launch button
        const launchLetters = this.launchButton.querySelectorAll('span')
        const lettersNumber = launchLetters.length

        // Add event to listen to click on launch button
        this.launchButton.addEventListener('click', this.removeLoader.bind(this))

        // Restore copyright text after loading
        const copyrightText = this.copyright.innerHTML


        this.loadingManager = new THREE.LoadingManager(
            // Loaded
            () => {

                window.setTimeout(() => {

                    this.copyright.innerHTML = copyrightText
                    this.launchButton.style.cursor = 'pointer'
                    this.launchButton.classList.add('ready')
                }, 500)
            },
            // Progress
            (itemUrl, itemsLoaded, itemsTotal) => {
                // Update the loading bar, with the item loaded and the item total number to load
                const progressRatio = itemsLoaded / itemsTotal

                // Remove inactve class for letters below progress

                // Calculate ratio per letter
                const ratioPerLetter = 1 / lettersNumber

                for (let i = 1; i <= lettersNumber; i++) {
                    // Check if progress is above the ratio of the letter
                    if (progressRatio >= ratioPerLetter * i) {
                            if (launchLetters[i - 1].classList.contains('inactive')) {
                                launchLetters[i - 1].classList.remove('inactive')
                            }
                    }
                    else {
                        break
                    }
                }

                // Change text in copyright div for each item loaded
                this.copyright.innerHTML = `${itemUrl}`
            }
        )
    }

    getLoadingManager() {
        return this.loadingManager
    }

    removeLoader(e) {
        // Remove loader on click if launch is ready
        if (e.target.classList.contains('ready')) {
            // Fade out loader screen
            this.loaderContainer.style.opacity = 0

            window.setTimeout(() => {
                // Destroy the loader
                this.destroy()
            }, 500)
        }
    }

    destroy() {
        // Remove .loader from DOM
        this.loaderContainer.remove()
        // Remove event listener
        this.launchButton.removeEventListener('click', this.removeLoader.bind(this))
    }
}