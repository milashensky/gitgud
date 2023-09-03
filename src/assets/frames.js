const loadFrame = (path, index) => {
    const frameName = `${index}`.padStart(3, '0')
    return require(`@/assets/frames/${path}/${frameName}.png`)
}

const getFrames = (count, fps) => count * (fps / 30)

const fps = 60

export default {
    attack: [...Array(114)].map((_, i) => loadFrame('attack', i + 1)),
    parry: [...Array(107)].map((_, i) => loadFrame('parry', i + 146)),
    fps,
    impactFrame: 53,
    startupFrames: getFrames(4, fps),
    parryFrames: getFrames(6, fps),
    // saber
    // startupFrames: getFrames(6, fps),
    // parryFrames: getFrames(2, fps),
    width: 1280,
    height: 720,
}
