const state = {
    loadingFlags: {},
    loadingMessages: {},
};

const mutations = {
    RECORD_LOADING_START(state, key) {
        state.loadingFlags[key] = true;
    },
    RECORD_LOADING_END(state, key) {
        delete state.loadingFlags[key];
    },
    SET_LOADING_MESSAGE(state, {key, message}) {
        state.loadingMessages[key] = message;
    },
    REMOVE_LOADING_MESSAGE(state, key) {
        delete state.loadingMessages[key];
    },
};

const actions = {
    recordLoadingStart({commit}, key) {
        commit('RECORD_LOADING_START', key);
    },
    recordLoadingEnd({commit}, key) {
        commit('RECORD_LOADING_END', key);
    },
    setLoadingMessage({commit}, {key, message}) {
        commit('SET_LOADING_MESSAGE', {key, message});
    },
    removeLoadingMessage({commit}, key) {
        commit('REMOVE_LOADING_MESSAGE', key);
    },
};

const getters = {
    isLoading(state) {
        return Object.keys(state.loadingFlags).length > 0;
    },
    loadingMessages(state) {
        return Object.keys(state.loadingFlags).reduce(
            (messages, key) => {
                if (state.loadingMessages[key]) {
                    messages[key] = state.loadingMessages[key];
                }
                return messages;
            },
            {},
        );
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
