import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

export default createRouter({
    routes,
    history: createWebHistory(),
    scrollBehavior() {
        return { top: 0 }
    }
})