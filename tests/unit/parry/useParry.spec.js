import useParry from '@/parry/composables/useParry'


describe('useParry', () => {
    const EMPTY_STATE = '-'
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should set parry start frame in setParryStart', () => {
        const {
            parryStateStr,
            setParryStart,
        } = useParry({
            impactFrame: 50,
            startupFrames: 10,
            parryFrames: 5,
        })
        setParryStart(10)
        expect(parryStateStr.value).not.toStrictEqual(EMPTY_STATE)
    })

    it('should reset parry start frame in resetParryState', () => {
        const {
            resetParryState,
            parryStateStr,
            setParryStart,
        } = useParry({
            impactFrame: 50,
            startupFrames: 10,
            parryFrames: 5,
        })
        setParryStart(10)
        resetParryState()
        expect(parryStateStr.value).toStrictEqual(EMPTY_STATE)
    })

    it.each([
        {
            start: 10,
            expected: 'Too early',
        },
        {
            start: 50,
            expected: 'Too late',
        },
        {
            start: 38,
            expected: 'Parried!',
        },
    ])('should return parry state based on relation of start frame to impact frame $#', (context) => {
        const {
            start,
            expected,
        } = context
        const {
            parryStateStr,
            setParryStart,
        } = useParry({
            impactFrame: 50,
            startupFrames: 10,
            parryFrames: 5,
        })
        setParryStart(start)
        expect(parryStateStr.value).toStrictEqual(expected)
    })

    it.each([
        {
            start: 10,
            frame: 50,
            expected: undefined,
        },
        {
            start: 50,
            frame: 50,
            expected: undefined,
        },
        {
            start: 38,
            frame: 50,
            expected: 50 - 38,
        },
    ])('should return parry animation frame index as frame - started if parried $#', (context) => {
        const {
            start,
            expected,
            frame,
        } = context
        const {
            setParryStart,
            getParryFrameIndex,
        } = useParry({
            impactFrame: 50,
            startupFrames: 10,
            parryFrames: 5,
        })
        setParryStart(start)
        expect(getParryFrameIndex(frame)).toStrictEqual(expected)
    })
})
