import { ref, toValue } from 'vue'
import getScaledSize from '@/parry/utils/getScaledSize'


const useCanvas = (canvasRef) => {
    const ctx = ref(null)

    const init2d = () => {
        const canvas = toValue(canvasRef)
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx.value = canvas.getContext('2d')
    }

    const renderFrame = (img) => {
        if (!toValue(ctx)) {
            init2d()
        }
        if (!img) {
            console.error('no frame img to render')
            return
        }
        const { width, height } = getScaledSize(toValue(canvasRef), img)
        toValue(ctx).drawImage(img, 0, 0, width, height)
    }
    const loadImage = async (url) => new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.src = url
    })

    return {
        renderFrame,
        loadImage,
    }
}

export default useCanvas
