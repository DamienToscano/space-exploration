import Experience from '../Experience.js'
import Asteroid from './Asteroid.js'
import Environment from "./Environment.js"
import Galaxy from './Galaxy.js'
import Spaceship from './Spaceship.js'
import Planet from './Planet.js'
import PlanetsData from '../Data/Planets.js'
/* import BlueRocky from './Planets/BlueRocky.js'
import BrownSpike from './Planets/BrownSpike.js'
import Browny from './Planets/Browny.js'
import Earth from './Planets/Earth.js'
import GreenSpike from './Planets/GreenSpike.js'
import Ice from './Planets/Ice.js'
import Lava from './Planets/Lava.js'
import Moon from './Planets/Moon.js'
import Purple from './Planets/Purple.js'
import Red from './Planets/Red.js'
import Rings from './Planets/Rings.js' */



export default class World {
    parameters = {
        size: 1000,
    }

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sources = this.experience.sources
        this.planets_data_handler = new PlanetsData()

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
                this.createPlanets()
                this.createAsteroids()
                this.spaceship = new Spaceship()
                this.physics = this.experience.physics

                // Set contacts after everything is loaded
                this.physics.setContacts()
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

    createPlanets() {
        this.planets = []

        for (let planet of this.planets_data_handler.getPlanets()) {
            this.createPlanet(planet.name, planet.size)
        }
    }

    createPlanet(name, size) {
        let class_name = name.charAt(0).toUpperCase() + name.slice(1)
        import(`./Planets/${class_name}.js`)
            .then((module) => {
                let planet = new module.default(size)
                this.planets.push(planet)
            })  

        // let planet = new Planet(name, size)

        // Create planet class according to name
        // this.planets.push(planet)
    }

    createAsteroids() {
        this.asteroids = []

        // Create first ones , one for each different models
        for (let i = 1; i <= 13; i++) {
            this.createAsteroid(i)
        }

        // Then just clone existing ones
        for (let i = 1; i <= 300; i++) {
            this.createAsteroid()
        }
    }

    createAsteroid(id = null) {
        let asteroid = new Asteroid(id)
        this.asteroids.push(asteroid)
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

        // Update the planets
        if (this.planets) {
            for (let planet of this.planets) {
                planet.update()
            }
        }
    }
}