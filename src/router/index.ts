import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('~/views/HomeView.vue'),
        },
        {
            path: '/properties',
            name: 'properties',
            component: () => import('~/views/PropertiesView.vue'),
        },
        {
            path: '/products',
            name: 'products',
            component: () => import('~/views/ProductsView.vue'),
        },
    ],
});

export default router;
