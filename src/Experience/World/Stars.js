import * as THREE from "three"
import Experience from "../Experience.js";

export default class Stars
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.size = this.experience.world.parameters.size

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Stars')
        }

        this.setPositions()
        this.setTextures()
        this.setGeometry()
        this.setMaterial()
        this.setPoints()
    }

    setPositions()
    {
        this.particlesCount = this.size * this.size / 100
        this.positions = new Float32Array(this.particlesCount * 3)

        for (let i = 0; i < this.particlesCount; i++) {
            this.positions[i * 3] = (Math.random() - 0.5) * this.size * 2
            this.positions[i * 3 + 1] = (Math.random() - 0.5) * this.size * 2
            this.positions[i * 3 + 2] = (Math.random() - 0.5) * this.size * 2
        }
    }

    setGeometry()
    {
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    }

    setTextures()
    {
        this.textures = {}
        this.textures.color = this.resources.items.starTexture
    }

    setMaterial()
    {
        this.material = new THREE.PointsMaterial({
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            size: 2,
            transparent: true,
            map: this.textures.color,
        })
    }

    setPoints()
    {
        this.points = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.points)
    }
}