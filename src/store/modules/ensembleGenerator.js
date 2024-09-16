import {getLocalStorage, setLocalStorage} from '@/utils/localStorage';

const PERSISTENT_STATE_PROPERTIES = ['simulationBatchSize', 'simulationRunCount'];

const state = {
    generatedTimestamp: null,
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
        if (isNaN(parsedValue) || parsedValue <= 0) {
            parsedValue = 1;
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
            ? value.map(item => parseInt(item, 10)).filter(item => item >= 0)
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
    RECORD_GENERATED_TIMESTAMP(state) {
        state.generatedTimestamp = Date.now();
    },
    SET_GENERATED_TIMESTAMP(state, value) {
        state.generatedTimestamp = Number.isInteger(value) ? value : null;
    },
    SET_SIMULATION_PROGRESS_BY_PERIOD(state, value) {
        const isValid = Array.isArray(value) &&
            value.every(
                arr => Array.isArray(arr) && arr.every(item => Number.isInteger(item)),
            );
        state.simulationProgressionByPeriod = isValid ? value : [];
    },
    SET_SORTED_SIMULATION_PROGRESS_BY_PERIOD(state, value) {
        const isValid = Array.isArray(value) &&
            value.every(
                arr => Array.isArray(arr) && arr.every(item => Number.isInteger(item)),
            );
        state.sortedSimulationProgressionByPeriod = isValid ? value : [];
    },
};

const actions = {
    loadFromLocalStorage({commit}) {
        const milestone = getLocalStorage('ensembleGenerator/milestone') || null;
        const simulationPeriods = getLocalStorage('ensembleGenerator/simulationPeriods') || null;
        const historicalData = getLocalStorage('ensembleGenerator/historicalData') || null;
        const simulationProgressionByPeriod = getLocalStorage('ensembleGenerator/simulationProgressionByPeriod') || null;
        const sortedSimulationProgressionByPeriod = getLocalStorage('ensembleGenerator/sortedSimulationProgressionByPeriod') || null;
        const generatedTimestamp = getLocalStorage('ensembleGenerator/generatedTimestamp') || null;

        if (milestone) {
            commit('SET_MILESTONE', milestone);
        }
        if (simulationPeriods) {
            commit('SET_SIMULATION_PERIODS', simulationPeriods);
        }
        if (historicalData) {
            commit('SET_HISTORICAL_DATA', historicalData);
        }
        if (simulationProgressionByPeriod) {
            commit('SET_SIMULATION_PROGRESS_BY_PERIOD', simulationProgressionByPeriod);
        }
        if (sortedSimulationProgressionByPeriod) {
            commit('SET_SORTED_SIMULATION_PROGRESS_BY_PERIOD', sortedSimulationProgressionByPeriod);
        }
        if (generatedTimestamp) {
            commit('SET_GENERATED_TIMESTAMP', generatedTimestamp);
        }
    },
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
    async clearEnsemble({commit}) {
        commit('RESET_STATE');
        setLocalStorage('ensembleGenerator/milestone', null);
        setLocalStorage('ensembleGenerator/simulationPeriods', null);
        setLocalStorage('ensembleGenerator/historicalData', null);
        setLocalStorage('ensembleGenerator/simulationProgressionByPeriod', null);
        setLocalStorage('ensembleGenerator/sortedSimulationProgressionByPeriod', null);
        setLocalStorage('ensembleGenerator/generatedTimestamp', null);
    },
    async generateEnsemble({state, commit, dispatch}) {
        if (!state.simulationRunCount || !state.simulationBatchSize) {
            throw new Error('simulation run count and batch size must both be specified');
        }

        dispatch('loading/recordLoadingStart', 'generateEnsemble', {root: true});

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

        const doneSimulationCount = state.simulationProgressionByPeriod[0].length;
        await dispatch(
            'loading/setLoadingMessage',
            {
                key: 'generateEnsemble',
                message: `Generating ensemble: ${doneSimulationCount} of ${state.simulationRunCount} simulations complete.`,
            },
            {root: true},
        );

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
        commit('RECORD_GENERATED_TIMESTAMP');
        dispatch('persistEnsembleToLocalStorage');
        dispatch('loading/recordLoadingEnd', 'generateEnsemble', {root: true});
    },
    async persistEnsembleToLocalStorage({state}) {
        setLocalStorage('ensembleGenerator/milestone', state.milestone);
        setLocalStorage('ensembleGenerator/simulationPeriods', state.simulationPeriods);
        setLocalStorage('ensembleGenerator/historicalData', state.historicalData);
        setLocalStorage('ensembleGenerator/simulationProgressionByPeriod', state.simulationProgressionByPeriod);
        setLocalStorage('ensembleGenerator/sortedSimulationProgressionByPeriod', state.sortedSimulationProgressionByPeriod);
        setLocalStorage('ensembleGenerator/generatedTimestamp', state.generatedTimestamp);
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
    generatedTimestamp: (state) => state.generatedTimestamp,
    milestone: (state) => state.milestone,
    simulationPeriods: (state) => state.simulationPeriods,
    isGenerated: (state) => {
        return state.generatedTimestamp !== null;
    },
    completedSimulationCount: (state) => {
        if (
            !Array.isArray(state.simulationProgressionByPeriod) ||
            state.simulationProgressionByPeriod.length === 0 ||
            !Array.isArray(state.simulationProgressionByPeriod[0])
        ) {
            return 0;
        }

        return state.simulationProgressionByPeriod[0].length;
    },
    getConservativelyPercentiledProgressionAtPeriod: (state) => (periodIndex, percentileFloat) => {
        const sortedArray = state.sortedSimulationProgressionByPeriod[periodIndex];

        if (!sortedArray || sortedArray.length === 0) {
            return null;
        }

        const index = Math.max(0, Math.floor(percentileFloat * sortedArray.length) - 1);
        return sortedArray[index];
    },
    getChanceOfAchievingMilestoneByPeriod: (state) => (periodIndex) => {
        const sortedArray = state.sortedSimulationProgressionByPeriod[periodIndex];

        if (!sortedArray || sortedArray.length === 0 || state.milestone === null) {
            return null;
        }

        const index = sortedArray.findIndex((value) => value >= state.milestone);

        return (index === -1)
            ? 0
            : ((sortedArray.length - index) / sortedArray.length);
    },
    isMilestoneAchievementSimulated: (state) => {
        if (
            state.sortedSimulationProgressionByPeriod.length === 0 ||
            state.sortedSimulationProgressionByPeriod.at(-1).length === 0
        ) {
            return false;
        }
        const lastPeriodSortedProgress = state.sortedSimulationProgressionByPeriod.at(-1);
        const highestValue = lastPeriodSortedProgress.at(-1);

        return highestValue >= state.milestone;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
