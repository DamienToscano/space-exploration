import Experience from '../Experience.js'
import Asteroid from './Asteroid.js'
import Environment from "./Environment.js"
import Galaxy from './Galaxy.js'
import Spaceship from './Spaceship.js'
import PlanetsData from '../Data/Planets.js'

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

        // Put the galaxies in random positions but outside the spaceship zone
        for (let i = 0; i < 15; i++) {
            let galaxy = new Galaxy(true)
            let coordinates = this.randomPoint()
            galaxy.setPosition(coordinates.x, coordinates.y, coordinates.z)
            this.galaxies.push(galaxy)
        }
    }

    randomPoint() {
        let x, y, z, distance;
        do {
          x = (Math.random() * this.parameters.size * 3) - this.parameters.size * 1.5;
          y = (Math.random() * this.parameters.size * 3) - this.parameters.size * 1.5;
          z = (Math.random() * this.parameters.size * 3) - this.parameters.size * 1.5;
          distance = Math.sqrt(x*x + y*y + z*z);
        } while (distance < 1000);
        return {x: x, y: y, z: z};
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
    }

    createAsteroids() {
        this.asteroids = []

        // Create first ones , one for each different models
        for (let i = 1; i <= 13; i++) {
            this.createAsteroid(i)
        }

        // Then just clone existing ones
        for (let i = 1; i <= 100; i++) {
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