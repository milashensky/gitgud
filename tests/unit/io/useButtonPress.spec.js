import { shallowMount } from '@vue/test-utils'
import useButtonPress from '@/io/composables/useButtonPress'


describe('useButtonPress', () => {
    const componentClass = {
        props: {
            callback: Function,
        },
        setup(props) {
            return useButtonPress(props.callback)
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

    it('should trigger callback after mount on keypress event', () => {
        const callback = jest.fn()
        createComponent({
            props: {
                callback,
            },
        })
        const event = new Event('keypress')
        window.dispatchEvent(event)
        expect(callback).toBeCalledWith(event)
    })

    it('should reset listeners on destroy', () => {
        const callback = jest.fn()
        const component = createComponent({
            props: {
                callback,
            },
        })
        component.unmount()
        const event = new Event('keypress')
        window.dispatchEvent(event)
        expect(callback).not.toBeCalled()
    })
})
