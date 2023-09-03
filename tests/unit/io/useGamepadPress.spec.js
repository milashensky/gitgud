import { shallowMount } from '@vue/test-utils'
import useGamepadPress from '@/io/composables/useGamepadPress'


const waitRAF = () => new Promise((resolve) => requestAnimationFrame(resolve))

describe('useGamepadPress', () => {
    const componentClass = {
        props: {
            callback: Function,
        },
        setup(props) {
            return useGamepadPress(props.callback)
        },
        template: '<div />',
    }

    const createComponent = (overwrites = {}) => {
        const component = shallowMount(componentClass, {
            ...overwrites,
            props: {
                ...overwrites.props,
            },
        })
        return component
    }

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should trigger callback if gamepad button is pressed', async () => {
        const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame')
        const pressedButton = {
            pressed: true,
        }
        const gamepad = {
            connected: true,
            buttons: [
                {
                    pressed: false,
                },
                pressedButton,
            ],
        }
        const gamepadsMock = [
            gamepad,
            null,
            null,
        ]
        navigator.getGamepads = () => gamepadsMock
        const callback = jest.fn()
        createComponent({
            props: {
                callback,
            },
        })
        await waitRAF()
        expect(requestAnimationFrameSpy).toBeCalled()
        expect(callback).toBeCalledWith({
            keyCode: 1,
            button: pressedButton,
        })
    })

    it('should not trigger callback if no gamepads', async () => {
        const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame')
        const gamepadsMock = [
            null,
            null,
        ]
        navigator.getGamepads = () => gamepadsMock
        const callback = jest.fn()
        createComponent({
            props: {
                callback,
            },
        })
        await waitRAF()
        expect(requestAnimationFrameSpy).toBeCalled()
        expect(callback).not.toBeCalled()
    })

    it('should not trigger callback if gamepad button is pressed', async () => {
        const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame')
        const gamepad = {
            connected: true,
            buttons: [
                {
                    pressed: false,
                },
            ],
        }
        const gamepadsMock = [
            gamepad,
            null,
            null,
        ]
        navigator.getGamepads = () => gamepadsMock
        const callback = jest.fn()
        createComponent({
            props: {
                callback,
            },
        })
        await waitRAF()
        expect(requestAnimationFrameSpy).toBeCalled()
        expect(callback).not.toBeCalled()
    })
})
