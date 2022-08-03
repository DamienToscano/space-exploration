import Experience from '../Experience.js'
import Environment from "./Environment.js"
import Galaxy from './Galaxy.js'
import Spaceship from './Spaceship.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sources = this.experience.sources

        // Check if the experience has resources
        if (this.experience.object.isEmtpy(this.sources)) {
            // If no resources, directly load the environment
            this.environment = new Environment()
        }
        else {
            // Wait for resources if we have some to load the environment
            this.resources.on('ready', () => {
                this.environment = new Environment()
                this.createGalaxies()
                this.spaceship = new Spaceship()
            })
        }
    }

    createGalaxies() {
        this.galaxies = []       

        for (let i = 0; i < (Math.floor(Math.random() * 40) + 1); i++) {
            let galaxy = new Galaxy(true)
            galaxy.setPosition((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000)
            this.galaxies.push(galaxy)
        }
    }

    update() {
        // Update the galaxies
        if (this.galaxies) {
            for (let galaxy of this.galaxies) {
                galaxy.update()
            }
        }

        if (this.spaceship) {
            this.spaceship.update()
        }
    }
}