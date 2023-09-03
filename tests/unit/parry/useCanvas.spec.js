import useCanvas from '@/parry/composables/useCanvas'
import * as getScaledSizeUtil from '@/parry/utils/getScaledSize'


describe('useCanvas', () => {
    const generateCanvasMock = () => {
        const contextMock = {
            drawImage: jest.fn(),
        }
        const getContext = jest.fn().mockReturnValue(contextMock)
        return {
            getContext,
            width: 0,
            height: 0,
            contextMock,
        }
    }

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should init context and request frame render in renderFrame', () => {
        const height = 100
        const width = 200
        const getSizeSpy = jest.spyOn(getScaledSizeUtil, 'default').mockReturnValue({
            height,
            width,
        })
        const canvas = generateCanvasMock()
        const { renderFrame } = useCanvas(canvas)
        const frameMock = jest.fn()
        renderFrame(frameMock)
        expect(canvas.getContext).toBeCalledTimes(1)
        expect(canvas.getContext).toBeCalledWith('2d')
        expect(getSizeSpy).toBeCalledWith(canvas, frameMock)
        expect(canvas.contextMock.drawImage).toBeCalledWith(frameMock, 0, 0, width, height)
        const frameMock2 = jest.fn()
        renderFrame(frameMock2)
        expect(canvas.getContext).toBeCalledTimes(1)
    })

    it('should return promise in loadImage, resolved after img is loaded', async () => {
        jest.useFakeTimers()
        global.Image = class {
            constructor() {
                setTimeout(() => {
                    this.onload()
                }, 100)
            }
        }

        const canvas = generateCanvasMock()
        const { loadImage } = useCanvas(canvas)
        const url = 'somebody/once/told.me'
        const promise = loadImage(url)
        jest.advanceTimersByTime(100)
        const result = await promise
        expect(result.src).toBe(url)
        jest.useRealTimers()
    })
})
