import getScaledSize from '@/parry/utils/getScaledSize'


describe('getScaledSize', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it.each([{
        canvas: {
            height: 1080,
            width: 1920,
        },
        img: {
            width: 1280,
            height: 720,
        },
        expected: {
            width: 1920,
            height: 1080,
        },
    }, {
        canvas: {
            height: 1080,
            width: 1920,
        },
        img: {
            width: 400,
            height: 300,
        },
        expected: {
            width: 1920,
            height: 1440,
        },
    }])('should scale img detentions to fit to canvas size %s', (context) => {
        const {
            canvas,
            img,
            expected,
        } = context
        const dimensions = getScaledSize(canvas, img)
        expect(dimensions).toStrictEqual(expected)
    })
})
