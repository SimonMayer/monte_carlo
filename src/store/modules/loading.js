const state = {
    loadingFlags: {},
};

const mutations = {
    RECORD_LOADING_START(state, key) {
        state.loadingFlags[key] = true;
    },
    RECORD_LOADING_END(state, key) {
        delete state.loadingFlags[key];
    },
};

const actions = {
    recordLoadingStart({commit}, key) {
        commit('RECORD_LOADING_START', key);
    },
    recordLoadingEnd({commit}, key) {
        commit('RECORD_LOADING_END', key);
    },
};

const getters = {
    isLoading(state) {
        return Object.keys(state.loadingFlags).length > 0;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
