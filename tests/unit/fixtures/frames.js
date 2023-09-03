const FPS = 30
export default {
    attack: [...Array(FPS * 2)].map((_, i) => `a_${i}.png`),
    parry: [...Array(FPS * 1)].map((_, i) => `p_${i}.png`),
    fps: FPS,
    impactFrame: FPS,
    startupFrames: 10,
    parryFrames: 5,
}
