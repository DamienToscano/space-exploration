import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from "./EventEmitter.js"

export default class Resources extends EventEmitter
{
    constructor(sources, loadingManager)
    {
        super()
        
        // Options
        this.sources = sources
        this.loadingManager = loadingManager
        
        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    // Set the different loaders we will need in the project
    setLoaders()
    {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader(this.loadingManager)
        this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager)
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager)
        this.loaders.audioLoader = new THREE.AudioLoader(this.loadingManager)
    }

    startLoading()
    {
        // Load each source
        for (const source of this.sources)
        {
            // Manage different loader according to source types
            switch (source.type) {
                case 'gltfModel':
                    this.loaders.gltfLoader.load(
                        source.path,
                        (file) =>
                        {
                            this.sourceLoaded(source, file)
                        }
                    )
                    break;
                case 'texture':
                    this.loaders.textureLoader.load(
                        source.path,
                        (file) =>
                        {
                            this.sourceLoaded(source, file)
                        }
                    )
                    break;
                case 'cubeTexture':
                    this.loaders.cubeTextureLoader.load(
                        source.path,
                        (file) =>
                        {
                            this.sourceLoaded(source, file)
                        }
                    )
                case 'audio':
                    this.loaders.audioLoader.load(
                        source.path,
                        (file) =>
                        {
                            this.sourceLoaded(source, file)
                        }
                    )
                    break;
            }
        }
    }

    // Load sources and send an event when all is loaded
    sourceLoaded(source, file)
    {
        // Save the loaded source
        this.items[source.name] = file

        this.loaded++

        if (this.loaded === this.toLoad)
        {
            this.trigger('ready')
        }
    }
}