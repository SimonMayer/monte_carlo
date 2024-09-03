import {createApp} from 'vue';
import App from '@/App.vue';
import store from '@/store';

const app = createApp(App);

app.use(store);
store.dispatch('simulationInputs/loadFromLocalStorage');
store.dispatch('ensembleGenerator/setSimulationRunCount', 10000);
store.dispatch('ensembleGenerator/setSimulationBatchSize', 200);

app.mount('#app');
