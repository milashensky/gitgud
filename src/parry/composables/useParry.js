import { ref, toValue, computed } from 'vue'


const PARRY_FRAME_NOT_SET = undefined

const useParry = (parryData) => {
    const parryStartedFrame = ref(PARRY_FRAME_NOT_SET)

    const setParryStart = (frameIndex) => {
        if (toValue(parryStartedFrame) !== PARRY_FRAME_NOT_SET) {
            return
        }
        parryStartedFrame.value = frameIndex
    }

    const resetParryState = () => {
        parryStartedFrame.value = PARRY_FRAME_NOT_SET
    }

    const isParried = computed(() => {
        const parryStart = toValue(parryStartedFrame)
        if (parryStart === PARRY_FRAME_NOT_SET) {
            return false
        }
        const {
            startupFrames,
            parryFrames,
            impactFrame,
        } = toValue(parryData)
        const parryWindowStart = parryStart + startupFrames
        const parryWindowEnd = parryWindowStart + parryFrames
        return Boolean(
            impactFrame >= parryWindowStart
            && impactFrame <= parryWindowEnd,
        )
    })

    const parryStateStr = computed(() => {
        const parryStart = toValue(parryStartedFrame)
        if (parryStart === PARRY_FRAME_NOT_SET) {
            return '-'
        }
        if (toValue(isParried)) {
            return 'Parried!'
        }
        const {
            startupFrames,
            impactFrame,
        } = toValue(parryData)
        const parryWindowStart = parryStart + startupFrames
        if (impactFrame < parryWindowStart) {
            return 'Too late'
        }
        return 'Too early'
    })

    const getParryFrameIndex = (frameIndex) => {
        const parryStart = toValue(parryStartedFrame)
        if (parryStart === PARRY_FRAME_NOT_SET) {
            return undefined
        }
        // TODO: add layers
        // const {
        //     impactFrame,
        // } = toValue(parryData)
        // if (!toValue(isParried) && frameIndex >= impactFrame) {
        //     return undefined
        // }
        if (!toValue(isParried)) {
            return undefined
        }
        const parryFrameIndex = frameIndex - parryStart
        return parryFrameIndex
    }

    return {
        setParryStart,
        resetParryState,
        getParryFrameIndex,
        parryStateStr,
    }
}

export default useParry
