import {createRouter, createWebHistory} from 'vue-router';
import ForecastBurnUpPage from '@/components/ForecastBurnUpPage.vue';
import HomePage from '@/components/HomePage.vue';
import MilestoneCumulativePage from '@/components/MilestoneCumulativePage.vue';
import MilestoneDistributionPage from '@/components/MilestoneDistributionPage.vue';
import SimulationInputsPage from '@/components/SimulationInputsPage.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
        meta: {id: 'home'},
    },
    {
        path: '/simulation-inputs',
        name: 'Simulation inputs',
        component: SimulationInputsPage,
        meta: {id: 'simulation-inputs'},
    },
    {
        path: '/forecast-burn-up',
        name: 'Forecast burn-up',
        component: ForecastBurnUpPage,
        meta: {id: 'forecast-burn-up'},
    },
    {
        path: '/milestone-cumulative',
        name: 'Cumulative milestone achievement likelihood',
        component: MilestoneCumulativePage,
        meta: {id: 'milestone-cumulative'},
    },
    {
        path: '/milestone-distribution',
        name: 'Milestone achievement distribution',
        component: MilestoneDistributionPage,
        meta: {id: 'milestone-distribution'},
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.getRouteById = function (id) {
    const route = this.options.routes.find(route => route.meta && route.meta.id === id);
    return route ? route.path : null;
};

export default router;
