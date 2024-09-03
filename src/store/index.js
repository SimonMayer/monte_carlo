import {createStore} from 'vuex';
import loading from '@/store/modules/loading';
import simulationInputs from '@/store/modules/simulationInputs';

const store = createStore({
    modules: {
        simulationInputs,
        loading,
    },
});

export default store;
