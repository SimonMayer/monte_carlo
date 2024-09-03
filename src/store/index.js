import {createStore} from 'vuex';
import loading from '@/store/modules/loading';
import simulationInputs from '@/store/modules/simulationInputs';
import ensembleGenerator from '@/store/modules/ensembleGenerator';

const store = createStore({
    modules: {
        simulationInputs,
        loading,
        ensembleGenerator,
    },
});

export default store;
