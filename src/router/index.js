import { createRouter, createWebHistory } from 'vue-router'
import ParryView from '@/parry/ParryView.vue'


const routes = [
    {
        path: '/',
        redirect: 'parry',
    },
    {
        path: '/parry',
        name: 'parry',
        component: ParryView,
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/',
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
