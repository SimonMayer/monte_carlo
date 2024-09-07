import router from '@/router';
import HomePage from '@/components/HomePage.vue';
import ForecastBurnUpPage from '@/components/ForecastBurnUpPage.vue';
import SimulationInputsPage from '@/components/SimulationInputsPage.vue';

describe('Router Configuration', () => {
    it('navigates to the correct component and sets the correct name for each route', async () => {
        for (const {path, name, component} of [
            {path: '/', name: 'Home', component: HomePage},
            {path: '/simulation-inputs', name: 'Simulation inputs', component: SimulationInputsPage},
            {path: '/forecast-burn-up', name: 'Forecast burn-up', component: ForecastBurnUpPage},
        ]) {
            await router.push(path);
            expect(router.currentRoute.value.name).toBe(name);
            expect(router.currentRoute.value.matched[0].components.default).toBe(component);
        }
    });
});

describe('getRouteById', () => {
    it('should return the correct path for a valid route id and null if it is invalid', () => {
        for (const {id, path} of [
            {id: 'invalid-id', path: null},
            {id: 'home', path: '/'},
            {id: 'simulation-inputs', path: '/simulation-inputs'},
            {id: 'forecast-burn-up', path: '/forecast-burn-up'},
        ]) {
            expect(router.getRouteById(id)).toBe(path);
        }
    });
});
