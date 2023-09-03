import { flushPromises, shallowMount } from '@vue/test-utils'
import ParryView from '@/parry/ParryView.vue'
import * as useParryComposable from '@/parry/composables/useParry'
import * as useCanvasComposable from '@/parry/composables/useCanvas'
import * as useGamepadComposable from '@/io/composables/useGamepadPress'
import * as useKeypressComposable from '@/io/composables/useButtonPress'
import mockFramesData from '@/tests/unit/fixtures/frames'


const MOCK_FPS = mockFramesData.fps
const mockAttackFrames = mockFramesData.attack
const mockParryFrames = mockFramesData.parry

jest.mock('@/assets/frames', () => ({
    ...jest.requireActual('@/tests/unit/fixtures/frames').default,
}))

describe('ParryView.vue', () => {
    const rafTimeout = 10

    const mockRAF = () => {
        const mock = jest.fn((listener) => {
            setTimeout(listener, rafTimeout)
        })
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation(mock)
    }

    const rafNextFrame = () => {
        jest.advanceTimersByTime(rafTimeout)
    }

    const createComponent = (overwrites = {}) => {
        const component = shallowMount(ParryView, {
            ...overwrites,
            props: {
                ...overwrites.props,
            },
        })
        // not sure why global mock doesn't work
        // I assume vue polyfills it in
        mockRAF()
        return component
    }

    const mockGamepad = () => {
        const listeners = []
        const trigger = (e) => listeners.forEach((listener) => listener(e))
        jest.spyOn(useGamepadComposable, 'default').mockImplementation((listener) => listeners.push(listener))
        return trigger
    }

    const mockKeypress = () => {
        const listeners = []
        const trigger = (e) => listeners.forEach((listener) => listener(e))
        jest.spyOn(useKeypressComposable, 'default').mockImplementation((listener) => listeners.push(listener))
        return trigger
    }

    const mockImage = (src) => ({ src })

    const mockCanvas = () => {
        const canvasMock = {
            renderFrame: jest.fn(),
            loadImage: jest.fn((url) => Promise.resolve(mockImage(url))),
        }
        jest.spyOn(useCanvasComposable, 'default').mockReturnValue(canvasMock)
        return canvasMock
    }

    const mockParry = () => {
        const parryMock = {
            setParryStart: jest.fn(),
            resetParryState: jest.fn(),
            getParryFrameIndex: jest.fn(),
            parryStateStr: 'somebody once told me',
        }
        jest.spyOn(useParryComposable, 'default').mockReturnValue(parryMock)
        return parryMock
    }

    beforeEach(() => {
        mockGamepad()
        mockKeypress()
        mockCanvas()
        jest.useFakeTimers()
    })

    afterEach(() => {
        // jest.restoreAllMocks()
        jest.useRealTimers()
    })

    it('should call setParryStart on gamepad button press', () => {
        jest.setSystemTime(new Date('2023-10-10T12:00:00'))
        const trigger = mockGamepad()
        const parryMock = mockParry()
        createComponent()
        trigger({ keyCode: 6 })
        expect(parryMock.setParryStart).toBeCalledWith(0)
        jest.setSystemTime(new Date('2023-10-10T12:00:01'))
        trigger({ keyCode: 6 })
        expect(parryMock.setParryStart).toBeCalledWith(1 * MOCK_FPS)
    })

    it('should call setParryStart on spacebar button press', () => {
        jest.setSystemTime(new Date('2023-10-10T12:00:00'))
        const trigger = mockKeypress()
        const parryMock = mockParry()
        createComponent()
        jest.setSystemTime(new Date('2023-10-10T12:00:01'))
        trigger({ keyCode: 32 })
        expect(parryMock.setParryStart).toBeCalledWith(1 * MOCK_FPS)
    })

    it('should call loadImage for every parry and animation frame on mount', () => {
        const {
            renderFrame,
            loadImage,
        } = mockCanvas()
        createComponent()
        expect(loadImage).toBeCalledTimes(mockAttackFrames.length + mockParryFrames.length)
        const allFrames = [...mockAttackFrames, ...mockParryFrames]
        allFrames.forEach((frame) => expect(loadImage).toBeCalledWith(frame))
        expect(renderFrame).not.toBeCalled()
    })

    it('should render frame with animation frame if no parry frame', async () => {
        const {
            renderFrame,
        } = mockCanvas()
        jest.setSystemTime(new Date('2023-10-10T12:00:00'))
        const component = createComponent()
        await flushPromises()
        expect(renderFrame).toBeCalledTimes(1)
        expect(renderFrame).toBeCalledWith(mockImage(mockAttackFrames[0]))
        // ensuring floats and ceil combined return the consistent value
        jest.setSystemTime(new Date('2023-10-10T12:00:01.001'))
        const frameIndex = 1 * MOCK_FPS + 1
        rafNextFrame()
        await component.vm.$nextTick()
        expect(renderFrame).toBeCalledTimes(2)
        expect(renderFrame).toBeCalledWith(mockImage(mockAttackFrames[frameIndex]))
    })

    it('should render frame with parry frame if is parry set', async () => {
        const parryMock = mockParry()
        const {
            renderFrame,
        } = mockCanvas()
        jest.setSystemTime(new Date('2023-10-10T12:00:00'))
        const component = createComponent()
        await flushPromises()
        // ensuring floats and ceil combined return the consistent value
        jest.setSystemTime(new Date('2023-10-10T12:00:01.001'))
        const parryIndex = 1
        parryMock.getParryFrameIndex.mockReturnValue(parryIndex)
        renderFrame.mockClear()
        rafNextFrame()
        await component.vm.$nextTick()
        expect(renderFrame).toBeCalledWith(mockImage(mockParryFrames[parryIndex]))
    })
})
