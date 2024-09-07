import storeModule from '@/store/modules/loading';

describe('loading store module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('records the start of a loading effort for specified flags, through mutation', () => {
        for (const {inputState, keys, expectedState} of [
            {
                inputState: {loadingFlags: {}},
                keys: ['theKey'],
                expectedState: {loadingFlags: {'theKey': true}},
            },
            {
                inputState: {loadingFlags: {}},
                keys: ['someKey', 'someOtherKey'],
                expectedState: {loadingFlags: {'someKey': true, 'someOtherKey': true}},
            },
            {
                inputState: {loadingFlags: {'previousKey': true}},
                keys: ['someKey'],
                expectedState: {loadingFlags: {'previousKey': true, 'someKey': true}},
            },
        ]) {
            for (const key of keys) {
                storeModule.mutations.RECORD_LOADING_START(inputState, key);
            }
            expect(inputState).toStrictEqual(expectedState);
        }
    });

    it('removes the record of a loading effort for specified flags, through mutation', () => {
        for (const {inputState, keys, expectedState} of [
            {
                inputState: {loadingFlags: {}},
                keys: ['neverThereKey'],
                expectedState: {loadingFlags: {}},
            },
            {
                inputState: {loadingFlags: {'unaffectedKey': true}},
                keys: ['neverThereKey'],
                expectedState: {loadingFlags: {'unaffectedKey': true}},
            },
            {
                inputState: {loadingFlags: {'theKey': true}},
                keys: ['theKey'],
                expectedState: {loadingFlags: {}},
            },
            {
                inputState: {loadingFlags: {'someKey': true, 'someOtherKey': true}},
                keys: ['someKey', 'someOtherKey'],
                expectedState: {loadingFlags: {}},
            },
            {
                inputState: {loadingFlags: {'key1': true, 'key2': true, 'key3': true}},
                keys: ['key2'],
                expectedState: {loadingFlags: {'key1': true, 'key3': true}},
            },
        ]) {
            for (const key of keys) {
                storeModule.mutations.RECORD_LOADING_END(inputState, key);
            }
            expect(inputState).toStrictEqual(expectedState);
        }
    });

    it('sets a loading message for specified flags, through mutation', () => {
        for (const {inputState, messages, expectedState} of [
            {
                inputState: {loadingMessages: {}},
                messages: [{key: 'theKey', message: 'the message'}],
                expectedState: {loadingMessages: {theKey: 'the message'}},
            },
            {
                inputState: {loadingMessages: {}},
                messages: [
                    {key: 'theKey', message: 'theMessage'},
                    {key: 'someOtherKey', message: 'someOtherMessage'},
                ],
                expectedState: {loadingMessages: {theKey: 'theMessage', someOtherKey: 'someOtherMessage'}},
            },
            {
                inputState: {loadingMessages: {existingKey: 'existingMessage'}},
                messages: [{key: 'someOtherKey', message: 'someOther Message'}],
                expectedState: {loadingMessages: {existingKey: 'existingMessage', someOtherKey: 'someOther Message'}},
            },
        ]) {
            for (const {key, message} of messages) {
                storeModule.mutations.SET_LOADING_MESSAGE(inputState, {key, message});
            }
            expect(inputState).toStrictEqual(expectedState);
        }
    });

    it('removes the loading message for specified flags, through mutation', () => {
        for (const {inputState, keys, expectedState} of [
            {
                inputState: {loadingMessages: {}},
                keys: ['neverThereKey'],
                expectedState: {loadingMessages: {}},
            },
            {
                inputState: {loadingMessages: {unaffectedKey: 'unaffected message'}},
                keys: ['neverThereKey'],
                expectedState: {loadingMessages: {unaffectedKey: 'unaffected message'}},
            },
            {
                inputState: {loadingMessages: {messageToRemoveKey: 'this message will go'}},
                keys: ['messageToRemoveKey'],
                expectedState: {loadingMessages: {}},
            },
            {
                inputState: {
                    loadingMessages: {'key1': 'msg1', 'key2': 'msg2', 'key3': 'msg3', 'key4': 'msg 4', 'key5': 'msg 5'},
                },
                keys: ['key2', 'key3'],
                expectedState: {loadingMessages: {'key1': 'msg1', 'key4': 'msg 4', 'key5': 'msg 5'}},
            },
        ]) {
            for (const key of keys) {
                storeModule.mutations.REMOVE_LOADING_MESSAGE(inputState, key);
            }
            expect(inputState).toStrictEqual(expectedState);
        }
    });

    it('records loading start, through action', () => {
        const commit = jest.fn();
        const key = 'theKey';

        storeModule.actions.recordLoadingStart({commit}, key);
        expect(commit).toHaveBeenNthCalledWith(1, 'RECORD_LOADING_START', key);
    });

    it('records loading end, through action', () => {
        const commit = jest.fn();
        const key = 'theKey';

        storeModule.actions.recordLoadingEnd({commit}, key);
        expect(commit).toHaveBeenNthCalledWith(1, 'RECORD_LOADING_END', key);
    });

    it('sets loading message, through action', () => {
        const commit = jest.fn();
        const key = 'theKey';
        const message = 'the message';

        storeModule.actions.setLoadingMessage({commit}, {key, message});
        expect(commit).toHaveBeenNthCalledWith(1, 'SET_LOADING_MESSAGE', {key, message});
    });

    it('removes loading message, through action', () => {
        const commit = jest.fn();
        const key = 'theKey';

        storeModule.actions.removeLoadingMessage({commit}, key);
        expect(commit).toHaveBeenNthCalledWith(1, 'REMOVE_LOADING_MESSAGE', key);
    });

    it('returns boolean from isLoading getter; true if there are loading flags', () => {
        for (const {loadingFlags, expected} of [
            {loadingFlags: {}, expected: false},
            {loadingFlags: {'aKey': true}, expected: true},
            {loadingFlags: {'aKey': true, 'anyOtherKey': true}, expected: true},
        ]) {
            const state = {loadingFlags};
            const result = storeModule.getters.isLoading(state);
            expect(result).toBe(expected);
        }
    });

    it('returns loading messages where keys exist in loadingFlags through getter', () => {
        for (const {state, expected} of [
            {state: {loadingFlags: {}, loadingMessages: {key1: 'msg1'}}, expected: {}},
            {state: {loadingFlags: {'key1': true}, loadingMessages: {}}, expected: {}},
            {state: {loadingFlags: {'key1': true}, loadingMessages: {key1: 'msg1'}}, expected: {key1: 'msg1'}},
            {
                state: {
                    loadingFlags: {'key1': true, 'key2': true, 'key4': true},
                    loadingMessages: {key1: 'msg1', key3: 'msg3', key4: 'msg 4'},
                },
                expected: {key1: 'msg1', key4: 'msg 4'},
            },
        ]) {
            const result = storeModule.getters.loadingMessages(state);
            expect(result).toStrictEqual(expected);
        }
    });
});
