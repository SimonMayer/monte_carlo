import {createApp} from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

const app = createApp(App);

app.use(router);
app.use(store);
store.dispatch('simulationInputs/loadFromLocalStorage');
store.dispatch('ensembleGenerator/loadFromLocalStorage');
store.dispatch('ensembleGenerator/setSimulationRunCount', 25000);
store.dispatch('ensembleGenerator/setSimulationBatchSize', 200);

app.mount('#app');
