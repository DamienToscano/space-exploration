import * as THREE from "three"
import Experience from "../Experience.js";

export default class Galaxy
{
    parameters = {
        count: 40000,
        size: 0.05,
        radius: 20,
        radiusPower: 4,
        branches: 3,
        spin: 0.2,
        randomnessPower: 2.5,
        insideColor: '#ff6030',
        outsideColor: '#1b3984',
        rotation: 0.2,
        oscillation: 0.3,
        height: 0.4,
        colors: [
            '#ff6030',
            '#1b3984',
            '#46B022',
            '#F1DD1A',
            '#1A7FF1',
            '#C141E1',
            '#5CF5EE',
        ]
    }

    constructor(random = false)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Stars')
        }

        if (random)
        {
            this.randomizeParameters()
        }

        this.setPositionsAndColors()
        this.setTextures()
        this.setGeometry()
        this.setMaterial()
        this.setPoints()
        this.setRotation()
    }

    randomizeParameters()
    {
        // Between 5000 and 55000
        this.parameters.count = Math.floor(Math.random() * 50000) + 5000
        // Between 100 and 120
        this.parameters.radius = Math.floor(Math.random() * 20) + 100
        // Between 2 and 12
        this.parameters.branches = Math.floor(Math.random() * 10) + 2
        // Bewteen 0.01 and 0.11
        this.parameters.spin = 0.01 + Math.random() * 0.1
        this.parameters.insideColor = this.parameters.colors[Math.floor(Math.random() * this.parameters.colors.length)]
        this.parameters.outsideColor = this.parameters.colors[Math.floor(Math.random() * this.parameters.colors.length)]
    }

    setPositionsAndColors()
    {
        // Configuring position attributes
        this.positions = new Float32Array(this.parameters.count * 3)

        // Configuring color attributes
        this.colors = new Float32Array(this.parameters.count * 3)

        // Instantiate the colors
        const insideColor = new THREE.Color(this.parameters.insideColor)
        const outsideColor = new THREE.Color(this.parameters.outsideColor)

        for (let i = 0; i < this.parameters.count; i++) {
            const i3 = i * 3

            // Dispose points on a galaxy shapes
            // Particles repartition along the branch according to radius power
            const radius = Math.pow(Math.random(), this.parameters.radiusPower) * this.parameters.radius
            // Calculate spin angle for this particle
            const spinAngle = radius * this.parameters.spin

            // Dispatch points on separate branches
            // Divided by branches number to have a value between 0 and 1
            // * by PI * 2 to have circle angles
            const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2

            // Setting randomness on the particles
            // Use pow to get exponential effect, more particles on low distances, and more on center of the branches
            const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
            const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? this.parameters.height : -this.parameters.height)
            const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

            this.positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
            this.positions[i3 + 1] = randomY + (Math.random() < 0.4 ? randomY * 0.2 : 0)
            this.positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

            // Color
            // Lerp (Converge from one value to another) a clone of the colorInside value (A clone to avoid changing the original value)
            const mixedColor = insideColor.clone().lerp(outsideColor, radius / this.parameters.radius)

            // Working only by lowering the value
            this.colors[i3] = mixedColor.r * 0.1
            this.colors[i3 + 1] = mixedColor.g * 0.1
            this.colors[i3 + 2] = mixedColor.b * 0.1
        }
    }

    setGeometry()
    {
        this.geometry = new THREE.BufferGeometry()
        // Add attribute position
        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(this.positions, 3)
        )

        // Add attribute color
        this.geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(this.colors, 3)
        )
    }

    setTextures()
    {
        this.textures = {}
        this.textures.color = this.resources.items.starTexture
    }

    setMaterial()
    {
        this.material = new THREE.PointsMaterial({
            size: this.parameters.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            // Activate colors
            vertexColors: true,
            // Texture
            transparent: true,
            alphaMap: this.textures.color,
        })
    }

    setPoints()
    {
        this.points = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.points)
    }

    setPosition(x, y, z)
    {
        this.points.position.set(x, y, z)
    }

    setRotation()
    {
        this.points.rotation.z = Math.random() * Math.PI * 2
    }

    update()
    {
        this.points.rotation.y = this.time.elapsed * 0.001 * this.parameters.rotation
    }
}