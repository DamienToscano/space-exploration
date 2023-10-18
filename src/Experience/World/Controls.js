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
        this.actions.fire = false
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
                    document.getElementById('control-up').classList.add('active')
                    break

                case 'ArrowRight':
                    this.actions.right = true
                    this.trigger('rightStart')
                    document.getElementById('control-right').classList.add('active')
                    break

                case 'ArrowDown':
                    // this.camera.pan.reset()
                    this.actions.down = true
                    this.trigger('downStart')
                    document.getElementById('control-down').classList.add('active')
                    break

                case 'ArrowLeft':
                    this.actions.left = true
                    this.trigger('leftStart')
                    document.getElementById('control-left').classList.add('active')
                    break

                case 's':
                    this.actions.accelerate = true
                    this.trigger('accelerateStart')
                    document.getElementById('control-accelerate').classList.add('active')
                    break

                case 'd':
                    this.actions.fire = true
                    this.trigger('fireStart')
                    document.getElementById('control-fire').classList.add('active')
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
                    document.getElementById('control-up').classList.remove('active')
                    break

                case 'ArrowRight':
                    this.actions.right = false
                    this.trigger('rightEnd')
                    document.getElementById('control-right').classList.remove('active')
                    break

                case 'ArrowDown':
                    this.actions.down = false
                    this.trigger('downEnd')
                    document.getElementById('control-down').classList.remove('active')
                    break

                case 'ArrowLeft':
                    this.actions.left = false
                    this.trigger('leftEnd')
                    document.getElementById('control-left').classList.remove('active')
                    break

                case 's':
                    this.actions.accelerate = false
                    this.trigger('accelerateEnd')
                    document.getElementById('control-accelerate').classList.remove('active')
                    break

                case 'd':
                    this.actions.fire = false
                    this.trigger('fireEnd')
                    document.getElementById('control-fire').classList.remove('active')
                    break
            }
        }

        document.addEventListener('keydown', this.keyboard.events.keyDown)
        document.addEventListener('keyup', this.keyboard.events.keyUp)
    }
}