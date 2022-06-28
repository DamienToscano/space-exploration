import EventEmitter from '../Utils/EventEmitter.js'

export default class Controls extends EventEmitter
{
    constructor()
    {
        super()

        // this.experience = new Experience()
        // this.camera = this.experience.camera
        // this.sizes = this.experience.sizes
        // this.time = this.experience.time

        this.setActions()
        this.setKeyboard()
    }

    setActions()
    {
        this.actions = {}
        this.actions.up = false
        this.actions.right = false
        this.actions.down = false
        this.actions.left = false
        this.actions.turbo = false
    }

    setKeyboard()
    {
        this.keyboard = {}
        this.keyboard.events = {}

        this.keyboard.events.keyDown = (_event) =>
        {
            switch(_event.key)
            {
                case 'ArrowUp':
                    // this.camera.pan.reset()
                    this.actions.up = true
                    break

                case 'ArrowRight':
                    this.actions.right = true
                    break

                case 'ArrowDown':
                    // this.camera.pan.reset()
                    this.actions.down = true
                    break

                case 'ArrowLeft':
                    this.actions.left = true
                    break

                case ' ':
                    this.actions.turbo = true
                    break

            }
        }

        this.keyboard.events.keyUp = (_event) =>
        {
            switch(_event.key)
            {
                case 'ArrowUp':
                    this.actions.up = false
                    break

                case 'ArrowRight':
                    this.actions.right = false
                    break

                case 'ArrowDown':
                    this.actions.down = false
                    break

                case 'ArrowLeft':
                    this.actions.left = false
                    break

                case ' ':
                    this.actions.turbo = false
                    // Emit event for turbo end
                    this.trigger('turboEnd')
                    break
            }
        }

        document.addEventListener('keydown', this.keyboard.events.keyDown)
        document.addEventListener('keyup', this.keyboard.events.keyUp)
    }

    // TODO: Make setTouch for mobile
}