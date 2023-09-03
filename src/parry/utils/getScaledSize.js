const getScaledSize = (canvas, img) => {
    const imgAspectRatio = img.width / img.height
    const canvasAspectRatio = canvas.width / canvas.height
    return {
        width: canvas.width,
        height: (canvas.height / imgAspectRatio) * canvasAspectRatio,
    }
}

export default getScaledSize
