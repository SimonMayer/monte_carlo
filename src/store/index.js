import {createStore} from 'vuex';
import simulationInputs from '@/store/modules/simulationInputs';

const store = createStore({
    modules: {
        simulationInputs,
    },
});

export default store;
