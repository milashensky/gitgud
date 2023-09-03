import {
    ref,
    onMounted,
    onUnmounted,
    toValue,
} from 'vue'


const useGamepadPress = (callback) => {
    const handleButtonPress = (e) => {
        callback(e)
    }

    const gamepadIndexRef = ref(undefined)
    const loop = () => {
        try {
            const gamepadIndex = toValue(gamepadIndexRef)
            if (gamepadIndex === undefined) {
                return
            }
            const gamepad = navigator.getGamepads()[gamepadIndex]
            if (!gamepad) {
                return
            }
            gamepad.buttons.forEach((button, i) => {
                if (button.pressed || button.touched) {
                    handleButtonPress({
                        keyCode: i,
                        button,
                    })
                }
            })
        }
        finally {
            requestAnimationFrame(loop)
        }
    }
    const handleGamepadConnected = (e) => {
        const { index } = e.gamepad
        const gamepad = navigator.getGamepads()[index]
        if (!gamepad) {
            return
        }
        gamepadIndexRef.value = index
        requestAnimationFrame(loop)
    }

    onMounted(() => {
        window.addEventListener('gamepadconnected', handleGamepadConnected)
        navigator.getGamepads().forEach((gamepad, i) => {
            if (gamepad?.connected) {
                gamepadIndexRef.value = i
            }
        })
        requestAnimationFrame(loop)
    })
    onUnmounted(() => {
        window.removeEventListener('gamepadconnected', handleGamepadConnected)
    })
}

export default useGamepadPress
