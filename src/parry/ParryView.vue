<template>
    <div class="container">
        <h2 class="helper">
            {{ parryStateStr }}
        </h2>
        <canvas
            ref="canvasRef"
            class="canvas"
            @click="handleParryPress"
        />
    </div>
</template>
<script setup>
import {
    ref,
    onMounted,
    toValue,
} from 'vue'
import useCanvas from '@/parry/composables/useCanvas'
import useParry from '@/parry/composables/useParry'
import useButtonPress from '@/io/composables/useButtonPress'
import useGamepadPress from '@/io/composables/useGamepadPress'
import framesData from '@/assets/frames'


const canvasRef = ref(null)
const attackFramesRef = ref(null)
const parryFramesRef = ref(null)
const {
    renderFrame,
    loadImage,
} = useCanvas(canvasRef)

const {
    resetParryState,
    getParryFrameIndex,
    setParryStart,
    parryStateStr,
} = useParry(framesData)

const loadAllFrames = async () => {
    const attackFrameImgsPromises = framesData.attack.map((imgUrl) => loadImage(imgUrl))
    const parryFrameImgsPromises = framesData.parry.map((imgUrl) => loadImage(imgUrl))
    attackFramesRef.value = await Promise.all(attackFrameImgsPromises)
    parryFramesRef.value = await Promise.all(parryFrameImgsPromises)
}

let start = new Date() - 0
const getFrameIndex = () => {
    const time = new Date() - 0
    const timePassedSec = (time - start) / 1000
    const currentFrame = Math.ceil(timePassedSec * framesData.fps)
    return currentFrame
}

const handleParryPress = () => {
    const index = getFrameIndex()
    setParryStart(index)
}

useButtonPress((e) => {
    if (
        e.code === 'Space'
        || e.keyCode === 32
    ) {
        handleParryPress()
    }
})

useGamepadPress((e) => {
    // TODO: button lookup table
    if (e.keyCode === 6) {
        handleParryPress()
    }
})

onMounted(async () => {
    if (!toValue(parryFramesRef) || !toValue(attackFramesRef)) {
        await loadAllFrames()
    }
    let frame = null
    let rc = 0
    let r = 0
    const logElapsed = () => {
        const done = new Date() - 0
        const timeTakenSec = (done - start) / 1000
        console.debug('timeTaken', timeTakenSec)
        console.debug('frames rendered', timeTakenSec * framesData.fps)
        console.debug('render cycles', rc)
        console.debug('renders', r)
    }
    const getFrame = (frameIndex) => {
        const parryFrameIndex = getParryFrameIndex(frameIndex)
        if (parryFrameIndex !== undefined) {
            return toValue(parryFramesRef)[parryFrameIndex]
        }
        return toValue(attackFramesRef)[frameIndex]
    }
    const renderNext = () => {
        rc += 1
        const index = getFrameIndex()
        const newFrame = getFrame(index)
        if (newFrame?.src !== frame?.src) {
            r += 1
            frame = newFrame
            renderFrame(frame)
        }
        if (!frame) {
            console.info('exit')
            logElapsed()
            start = new Date() - 0
            rc = 0
            r = 0
            resetParryState()
        }
        requestAnimationFrame(renderNext)
    }
    renderNext()
})
</script>
<style lang="scss" scoped>
.container {
    position: relative;

    .helper {
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        color: white;
    }

    .canvas {
        width: 100%;
        height: 100%;
    }
}
</style>
