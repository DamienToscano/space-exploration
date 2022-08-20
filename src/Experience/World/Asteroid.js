import * as THREE from "three"
import Experience from "../Experience.js"
import vertexShader from "../../../static/shaders/asteroid/vertex.glsl"
import fragmentShader from "../../../static/shaders/asteroid/fragment.glsl"
import * as Random from "../Utils/Random.js"


export default class Asteroid {

    parameters = {
        planeSize: 512,
        planeSegments: 400,
    }

    constructor() {

        this.experience = new Experience()
        this.camera = this.experience.camera
        this.scene = this.experience.scene

        this.setMaterial()
        this.setGeometry()
        this.setMesh()

    }

    setMaterial() {
        const data = this.setUniforms()

        this.uniforms = {
            uNoiseFrequency: data.uNoiseFrequency,
            uOctaves: data.uOctaves,
            uLacunarity: data.uLacunarity,
            uGain: data.uGain,
            uSecondLayer: data.uSecondLayer,
            uThirdLayer: data.uThirdLayer,
            uHeight: data.uHeight,
            uResolution: { value: new THREE.Vector2(this.parameters.planeSegments, this.parameters.planeSegments) },
            uRandOffset: { value: Random.num(0, 512) },
        }

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: this.uniforms,
        })
    }

    setGeometry() {
        this.geometry = new THREE.PlaneBufferGeometry(this.parameters.planeSize, this.parameters.planeSize, this.parameters.planeSegments, this.parameters.planeSegments)
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        // Temporary rotation and position for test
        this.mesh.rotateX(-Math.PI / 2.)
        this.mesh.position.y = -100
        this.mesh.position.z = 500
        this.scene.add(this.mesh)
    }

    setUniforms() {
        // TODO: Refactor that.
        const layerCount = Random.bool(0.2) ? 1 : Random.int(2, 3);

        let uNoiseFrequency, uOctaves, uLacunarity, uGain, uHeight, uSecondLayer, uThirdLayer;

        if (layerCount == 1) {

            uNoiseFrequency = { value: new THREE.Vector3(Random.num(2.5, 10.0), 0., 0.) };
            uOctaves = { value: new THREE.Vector3(Random.int(2, 8), 0, 0) };
            uLacunarity = { value: new THREE.Vector3(uNoiseFrequency.value.x < 5 ? Random.num(4., 6.) : Random.num(2., 4.), 0., 0.) };
            uGain = { value: new THREE.Vector3(uLacunarity.value.x > 8. ? Random.num(0.03, 0.1) : Random.num(0.05, 0.3), 0., 0.) };

            uSecondLayer = { value: false };
            uThirdLayer = { value: false };

            uHeight = { value: Random.num(150, 300) };

        } else if (layerCount == 2) {

            let variant = Random.int(1, 3);

            if (variant == 1) {
                let x = Random.num(0.5, 2.);
                uNoiseFrequency = { value: new THREE.Vector3(x, Random.num(10., 15.), 0.) };
                uOctaves = { value: new THREE.Vector3(Random.int(2, 6), Random.int(2, 6), 0) };
                uLacunarity = { value: new THREE.Vector3(Random.num(4., 16.), uNoiseFrequency.value.x < 1.5 ? Random.num(4., 6.) : Random.num(0., 4.), 0.) };
                uGain = { value: new THREE.Vector3(uLacunarity.value.x > 8. ? Random.num(0.05, 0.1) : Random.num(0.1, 0.2), uLacunarity.value.y > 2. ? Random.num(0.1, 0.2) : Random.num(0.2, 0.5), 0.) };
            }

            else if (variant == 2) {
                let x = Random.num(2., 10.);
                uNoiseFrequency = { value: new THREE.Vector3(x, Random.num(1., 7.), 0.) };
                uOctaves = { value: new THREE.Vector3(Random.int(2, 6), Random.int(3, 6), 0) };
                uLacunarity = { value: new THREE.Vector3(Random.num(4., 16.), uNoiseFrequency.value.x < 4.5 ? Random.num(4., 8.) : Random.num(0., 4.), 0.) };
                uGain = { value: new THREE.Vector3(uLacunarity.value.x > 8. ? Random.num(0.05, 0.1) : Random.num(0.1, 0.2), uLacunarity.value.y > 2. ? Random.num(0.1, 0.2) : Random.num(0.2, 0.5), 0.) };
            } else {
                let x = Random.num(1., 4.);
                uNoiseFrequency = { value: new THREE.Vector3(x, Random.num(5., 15.), 0.) };
                uOctaves = { value: new THREE.Vector3(Random.int(2, 6), Random.int(3, 7), 0) };
                uLacunarity = { value: new THREE.Vector3(Random.num(4., 16.), uNoiseFrequency.value.x < 1. ? Random.num(5., 10.) : Random.num(2., 5.), 0.) };
                uGain = { value: new THREE.Vector3(uLacunarity.value.x > 5. ? Random.num(0.05, 0.1) : Random.num(0.1, 0.2), uLacunarity.value.y > 2. ? Random.num(0.1, 0.2) : Random.num(0.2, 0.5), 0.) };
            }

            uSecondLayer = { value: true };
            uThirdLayer = { value: false };

            uHeight = { value: Random.num(100, 350) };

        } else {
            let x = Random.num(3.0, 6.);
            let y = Random.num(3.0, 7.);

            uNoiseFrequency = { value: new THREE.Vector3(x, y, y > 5. ? Random.num(2., 3.) : Random.num(3., 5.)) };
            uOctaves = { value: new THREE.Vector3(Random.int(3, 5), Random.int(3, 5), Random.int(3, 5)) };
            uLacunarity = { value: new THREE.Vector3(uNoiseFrequency.value.x < 2.5 ? Random.num(4., 5.) : Random.num(2., 4.), uNoiseFrequency.value.x < 2.5 ? Random.num(3., 5.) : Random.num(1., 3.), Random.num(2., 10.)) };
            uGain = { value: new THREE.Vector3(uLacunarity.value.x > 4. ? Random.num(0.05, 0.1) : Random.num(0.1, 0.2), uLacunarity.value.y > 4. ? Random.num(0.15, 0.2) : Random.num(0.1, 0.4), uLacunarity.value.z > 4. ? Random.num(0.1, 0.2) : uNoiseFrequency.value.z > 5. ? Random.num(0.1, 0.15) : Random.num(0.2, 0.5)) };

            uSecondLayer = { value: true };
            uThirdLayer = { value: true };

            uHeight = { value: Random.num(200, 350) };
        }
        return { uNoiseFrequency, uOctaves, uLacunarity, uGain, uHeight, uSecondLayer, uThirdLayer };
    }

    // TODO: Modify the geometry to have a sphere
}