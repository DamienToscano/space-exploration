import EventEmitter from '../Utils/EventEmitter.js'

export default class Controls extends EventEmitter
{
    constructor()
    {
        super()
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
        this.actions.accelerate = false
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
                    this.trigger('upStart')
                    break

                case 'ArrowRight':
                    this.actions.right = true
                    this.trigger('rightStart')
                    break

                case 'ArrowDown':
                    // this.camera.pan.reset()
                    this.actions.down = true
                    this.trigger('downStart')
                    break

                case 'ArrowLeft':
                    this.actions.left = true
                    this.trigger('leftStart')
                    break

                case 'Shift':
                    this.actions.accelerate = true
                    this.trigger('accelerateStart')
                    break

                case ' ':
                    this.actions.turbo = true
                    this.trigger('turboStart')
                    break

            }
        }

        this.keyboard.events.keyUp = (_event) =>
        {
            switch(_event.key)
            {
                case 'ArrowUp':
                    this.actions.up = false
                    this.trigger('upEnd')
                    break

                case 'ArrowRight':
                    this.actions.right = false
                    this.trigger('rightEnd')
                    break

                case 'ArrowDown':
                    this.actions.down = false
                    this.trigger('downEnd')
                    break

                case 'ArrowLeft':
                    this.actions.left = false
                    this.trigger('leftEnd')
                    break

                case 'Shift':
                    this.actions.accelerate = false
                    this.trigger('accelerateEnd')
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