const PERSISTENT_STATE_PROPERTIES = ['simulationBatchSize', 'simulationRunCount'];

const state = {
    simulationBatchSize: null,
    simulationRunCount: null,
    simulationProgressionByPeriod: [],
    sortedSimulationProgressionByPeriod: [],
    milestone: null,
    simulationPeriods: null,
    historicalData: [],
};

const mutations = {
    SET_SIMULATION_RUN_COUNT(state, value) {
        let parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue <= 0) {
            parsedValue = 1;
        }
        state.simulationRunCount = parsedValue;
    },
    SET_SIMULATION_BATCH_SIZE(state, value) {
        let parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue <= 0) {
            parsedValue = 1;
        }
        state.simulationBatchSize = parsedValue;
    },
    RESET_STATE(state) {
        Object.keys(state).forEach(key => {
            if (PERSISTENT_STATE_PROPERTIES.includes(key)) {
                return;
            }
            state[key] = Array.isArray(state[key]) ? [] : null;
        });
    },
    SET_MILESTONE(state, value) {
        let parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue)) {
            parsedValue = 0;
        }
        state.milestone = parsedValue;
    },
    SET_SIMULATION_PERIODS(state, value) {
        let parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue <= 0) {
            parsedValue = 1;
        }
        state.simulationPeriods = parseInt(parsedValue, 10);
    },
    SET_HISTORICAL_DATA(state, value) {
        state.historicalData = Array.isArray(value)
            ? value.map(item => parseInt(item, 10))
            : [];
    },
    CREATE_SIMULATION_PROGRESSION_ARRAYS(state) {
        for (let i = 0; i < state.simulationPeriods; i++) {
            state.simulationProgressionByPeriod[i] = [];
        }
    },
    RECORD_SIMULATED_PERIOD_OUTCOME(state, {periodOutcome, simulationIndex, simulatedPeriod}) {
        const previousPeriodProgression = simulatedPeriod > 0
            ? state.simulationProgressionByPeriod[simulatedPeriod - 1][simulationIndex]
            : 0;

        state.simulationProgressionByPeriod[simulatedPeriod].push(periodOutcome + previousPeriodProgression);
    },
    POPULATE_SORTED_SIMULATION_PROGRESSION_ARRAYS(state) {
        state.sortedSimulationProgressionByPeriod = state.simulationProgressionByPeriod.map(simulationArray =>
            [...simulationArray].sort((a, b) => a - b),
        );
    },
};

const actions = {
    async setSimulationRunCount({commit}, runCount) {
        let parsedRunCount = parseInt(runCount, 10);
        if (isNaN(parsedRunCount) || parsedRunCount <= 0) {
            parsedRunCount = 1;
        }
        commit('SET_SIMULATION_RUN_COUNT', parsedRunCount);
    },
    async setSimulationBatchSize({commit}, simulationBatchSize) {
        let parsedBatchSize = parseInt(simulationBatchSize, 10);
        if (isNaN(parsedBatchSize) || parsedBatchSize <= 0) {
            parsedBatchSize = 1;
        }
        commit('SET_SIMULATION_BATCH_SIZE', parsedBatchSize);
    },
    async createEnsemble({state, commit, dispatch}) {
        if (!state.simulationRunCount || !state.simulationBatchSize) {
            throw new Error('simulation run count and batch size must both be specified');
        }

        dispatch('loading/recordLoadingStart', 'createEnsemble', {root: true});

        setTimeout(() => { // use timeout to force immediate display of loading status
                commit('RESET_STATE');
                dispatch('captureSimulationInputs');
                commit('CREATE_SIMULATION_PROGRESSION_ARRAYS');
                dispatch('runSimulationBatch', 0);
            },
            0,
        );
    },
    async captureSimulationInputs({commit, rootGetters}) {
        commit('SET_HISTORICAL_DATA', rootGetters['simulationInputs/historicalData']);
        commit('SET_MILESTONE', rootGetters['simulationInputs/milestone']);
        commit('SET_SIMULATION_PERIODS', rootGetters['simulationInputs/simulationPeriods']);
    },
    async runSimulationBatch({state, dispatch}, firstInScopeSimulationIndex) {
        if (!state.simulationRunCount || !state.simulationBatchSize) {
            throw new Error('simulation run count and batch size must both be specified');
        }

        const firstOutOfScopeSimulationIndex = Math.min(firstInScopeSimulationIndex + state.simulationBatchSize, state.simulationRunCount);

        for (let i = firstInScopeSimulationIndex; i < firstOutOfScopeSimulationIndex; i++) {
            await dispatch('runSimulation', i);
        }

        if (firstOutOfScopeSimulationIndex < state.simulationRunCount) {
            setTimeout(() => {
                    dispatch('runSimulationBatch', firstOutOfScopeSimulationIndex);
                },
                0,
            );
        } else {
            dispatch('handlePostSimulationEnsembleCreation');
        }
    },
    async handlePostSimulationEnsembleCreation({commit, dispatch}) {
        commit('POPULATE_SORTED_SIMULATION_PROGRESSION_ARRAYS');
        dispatch('loading/recordLoadingEnd', 'createEnsemble', {root: true});
    },
    async runSimulation({state, commit, dispatch}, simulationIndex) {
        if (!state.simulationPeriods || state.simulationPeriods < 1) {
            throw Error('a positive simulation periods value is required in order to run a simulation');
        }

        for (let simulatedPeriod = 0; simulatedPeriod < state.simulationPeriods; simulatedPeriod++) {
            const periodOutcome = await dispatch('runDraw');
            commit('RECORD_SIMULATED_PERIOD_OUTCOME', {periodOutcome, simulatedPeriod, simulationIndex});
        }
    },
    async runDraw({state}) {
        if (!state.historicalData || !state.historicalData.length) {
            throw Error('historical data is required in order to draw');
        }
        return state.historicalData[Math.floor(Math.random() * state.historicalData.length)];
    },
};

const getters = {
    getConservativelyPercentiledProgressionAtPeriod: (state) => (periodIndex, percentileFloat) => {
        const sortedArray = state.sortedSimulationProgressionByPeriod[periodIndex];

        if (!sortedArray || sortedArray.length === 0) {
            return null;
        }

        const index = Math.max(0, Math.floor(percentileFloat * sortedArray.length) - 1);
        return sortedArray[index];
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
