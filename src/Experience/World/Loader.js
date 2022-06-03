import * as THREE from "three"
import Experience from "../Experience.js";

export default class Loader {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setOverlay()
    }

    setOverlay() {
        this.overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: { value: 1 },
            },
            vertexShader: `
            void main()
            {
                // We place the plane where we need on the screen by removing the projectionMatrix and modelViewMatrix
                gl_Position = vec4(position, 1.0);
            }
            `,
            fragmentShader: `
            uniform float uAlpha;
        
            void main()
            {
                gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
            }
            `
        })
        this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial)
        this.scene.add(this.overlay)
    }
}