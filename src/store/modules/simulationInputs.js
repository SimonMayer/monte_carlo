import {getLocalStorage, setLocalStorage} from '@/utils/localStorage';

const state = {
    milestone: null,
    simulationPeriods: null,
    isHistoricalDataInputManually: false,
    historicalData: [],
};

const mutations = {
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
    SET_HISTORICAL_DATA_INPUT_METHOD(state, value) {
        state.isHistoricalDataInputManually = value === 'manual';
    },
    SET_HISTORICAL_DATA(state, value) {
        state.historicalData = Array.isArray(value)
            ? value.map(item => parseInt(item, 10))
            : [];
    },
    SET_HISTORICAL_DATA_LENGTH(state, value) {
        if (value > state.historicalData.length) {
            while (state.historicalData.length < value) {
                state.historicalData.push(0);
            }
        } else if (value < state.historicalData.length) {
            state.historicalData.length = value;
        }
    },
};

const actions = {
    loadFromLocalStorage({commit}) {
        const milestone = getLocalStorage('milestone') || 0;
        const simulationPeriods = getLocalStorage('simulationPeriods') || 1;
        const historicalDataInputMethod = getLocalStorage('historicalDataInputMethod') || null;
        const historicalData = getLocalStorage('historicalData') || [];

        commit('SET_MILESTONE', milestone);
        commit('SET_SIMULATION_PERIODS', simulationPeriods);
        commit('SET_HISTORICAL_DATA_INPUT_METHOD', historicalDataInputMethod);
        commit('SET_HISTORICAL_DATA', historicalData);
    },
    setMilestone({commit}, milestone) {
        let parsedMilestone = parseInt(milestone, 10);
        if (isNaN(parsedMilestone)) {
            parsedMilestone = 0;
        }
        commit('SET_MILESTONE', parsedMilestone);
        setLocalStorage('milestone', parsedMilestone);
    },
    setSimulationPeriods({commit}, simulationPeriods) {
        let parsedSimulationPeriods = parseInt(simulationPeriods, 10);
        if (isNaN(parsedSimulationPeriods) || parsedSimulationPeriods <= 0) {
            parsedSimulationPeriods = 1;
        }
        commit('SET_SIMULATION_PERIODS', parsedSimulationPeriods);
        setLocalStorage('simulationPeriods', parsedSimulationPeriods);
    },
    setHistoricalDataInputMethod({commit}, historicalDataInputMethod) {
        const parsedHistoricalDataInputMethod = String(historicalDataInputMethod);
        commit('SET_HISTORICAL_DATA_INPUT_METHOD', parsedHistoricalDataInputMethod);
        setLocalStorage('historicalDataInputMethod', parsedHistoricalDataInputMethod);
    },
    setHistoricalData({commit}, rawHistoricalData) {
        const parsedHistoricalData = Array.isArray(rawHistoricalData)
            ? rawHistoricalData.map(item => parseInt(item, 10))
            : [];
        commit('SET_HISTORICAL_DATA', parsedHistoricalData);
        setLocalStorage('historicalData', parsedHistoricalData);
    },
    setHistoricalDataFromText({dispatch, state}, historicalDataAsText) {
        const historicalDataAsArray = historicalDataAsText
            .split(/[\s,;]+/)
            .filter(n => n !== '')
            .map(Number)
            .filter(n => !isNaN(n))
            .map(n => Math.floor(n));
        const isDataModified = JSON.stringify(historicalDataAsArray) !== JSON.stringify(state.historicalData);

        if (!isDataModified) {
            return;
        }

        dispatch('setHistoricalData', historicalDataAsArray);
    },
    setHistoricalRecordCount({state, commit}, historicalRecordCount) {
        let parsedHistoricalRecordCount = parseInt(historicalRecordCount, 10);
        if (parsedHistoricalRecordCount < 0) {
            parsedHistoricalRecordCount = 0;
        }
        commit('SET_HISTORICAL_DATA_LENGTH', parsedHistoricalRecordCount);
        setLocalStorage('historicalData', state.historicalData);
    },
};

const getters = {
    milestone: (state) => state.milestone,
    simulationPeriods: (state) => state.simulationPeriods,
    isHistoricalDataInputManually: (state) => state.isHistoricalDataInputManually,
    historicalData: (state) => state.historicalData || [],
    historicalDataAsText: (state) => state.historicalData?.join(', ') || '',
    historicalRecordCount: (state) => state.historicalData?.length || 0,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
