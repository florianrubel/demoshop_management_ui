import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('~/views/HomeView.vue'),
        },
        {
            path: '/',
            name: 'properties',
            component: () => import('~/views/PropertiesView.vue'),
        },
    ],
});

export default router;
