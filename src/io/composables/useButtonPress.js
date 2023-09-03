import { onMounted, onUnmounted } from 'vue'


const useButtonPress = (callback) => {
    const handleButtonPress = (e) => {
        callback(e)
    }
    onMounted(() => {
        window.addEventListener('keypress', handleButtonPress)
    })
    onUnmounted(() => {
        window.removeEventListener('keypress', handleButtonPress)
    })
}

export default useButtonPress
