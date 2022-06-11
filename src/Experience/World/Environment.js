import * as THREE from 'three'
import Experience from '../Experience.js'
import Stars from './Stars.js'
import Loader from './Loader.js'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setStars()
        this.setLoader()
    }

    setStars()
    {
        this.stars = new Stars()
    }

    setLoader()
    {
        this.loader = new Loader()
    }
}