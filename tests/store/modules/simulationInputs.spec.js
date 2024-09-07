import storeModule from '@/store/modules/simulationInputs';
import {getLocalStorage, setLocalStorage} from '@/utils/localStorage';
import {
    inputsCastAsArrayItemsCastAsPositiveIntegerDefaultsToEmptyIfInvalid,
    inputsCastAsInteger,
    inputsCastAsPositiveInteger,
} from '../../testUtils/dataProviders';

jest.mock('@/utils/localStorage', () => ({
    setLocalStorage: jest.fn(),
    getLocalStorage: jest.fn(),
}));

expect.extend({
    toBeCalledBefore(received, nextCall) {
        const pass = received < nextCall;
        const passMessage = `expected call order ${received} not to be before ${nextCall}`;
        const failMessage = `expected call order ${received} to be before ${nextCall}, but it wasn't`;

        if (pass) {
            return {message: () => passMessage, pass: true};
        } else {
            return {message: () => failMessage, pass: false};
        }
    },
});

describe('simulation inputs store module', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('sets milestone as integer through mutation', () => {
        const state = {milestone: null};
        for (const {input, expected} of inputsCastAsInteger) {
            storeModule.mutations.SET_MILESTONE(state, input);
            expect(state.milestone).toBe(expected);
        }
    });

    it('sets simulation periods as positive integer through mutation', () => {
        const state = {simulationPeriods: null};

        for (const {input, expected} of inputsCastAsPositiveInteger) {
            storeModule.mutations.SET_SIMULATION_PERIODS(state, input);
            expect(state.simulationPeriods).toBe(expected);
        }
    });

    it('sets historical data input method correctly through mutation', () => {
        const state = {isHistoricalDataInputManually: false};

        for (const {input, expected} of [
            {input: 'manual', expected: true},
            {input: 'bulk', expected: false},
            {input: 'someOldNonsense', expected: false}, // check it sets to false, when previously false
            {input: 'manual', expected: true},
            {input: 'someOldNonsense', expected: false}, // check it sets to false, when previously true
            {input: 32, expected: false},
            {input: true, expected: false},
        ]) {
            storeModule.mutations.SET_HISTORICAL_DATA_INPUT_METHOD(state, input);
            expect(state.isHistoricalDataInputManually).toBe(expected);
        }
    });

    it('sets historical data either as an array of positive integers or empty array through mutation', () => {
        const state = {historicalData: []};

        for (const {input, expected} of inputsCastAsArrayItemsCastAsPositiveIntegerDefaultsToEmptyIfInvalid) {
            storeModule.mutations.SET_HISTORICAL_DATA(state, input);
            expect(state.historicalData).toStrictEqual(expected);
        }
    });

    it('sets historical data length correctly through mutation', () => {
        const state = {
            historicalData: [100, 90, 80, 70, 60],
        };

        for (const {input, expected} of [
            {input: 5, expected: [100, 90, 80, 70, 60]},
            {input: 7, expected: [100, 90, 80, 70, 60, 0, 0]},
            {input: 4, expected: [100, 90, 80, 70]},
            {input: 5, expected: [100, 90, 80, 70, 0]},
            {input: 0, expected: []},
            {input: 1, expected: [0]},
        ]) {
            storeModule.mutations.SET_HISTORICAL_DATA_LENGTH(state, input);
            expect(state.historicalData).toStrictEqual(expected);
        }
    });

    it('loads from local storage and sets mutations correctly through action', () => {
        const commit = jest.fn();

        for (const [index, {localStorage, passedValues}] of [
            {
                localStorage: {
                    milestone: 10,
                    simulationPeriods: 11,
                    historicalDataInputMethod: 'manual',
                    historicalData: [9, 0, 2],
                },
                passedValues: {
                    milestone: 10,
                    simulationPeriods: 11,
                    historicalDataInputMethod: 'manual',
                    historicalData: [9, 0, 2],
                },
            },
            {
                localStorage: {
                    milestone: undefined,
                    simulationPeriods: undefined,
                    historicalDataInputMethod: undefined,
                    historicalData: undefined,
                },
                passedValues: {
                    milestone: 0,
                    simulationPeriods: 1,
                    historicalDataInputMethod: null,
                    historicalData: [],
                },
            },
        ].entries()) {
            getLocalStorage.mockImplementation((argument) => {
                const key = argument.replace(/^simulationInputs\//, '');
                return localStorage[key];
            });
            storeModule.actions.loadFromLocalStorage({commit});
            expect(getLocalStorage).toHaveBeenNthCalledWith((4 * index) + 1, 'simulationInputs/milestone');
            expect(getLocalStorage).toHaveBeenNthCalledWith((4 * index) + 2, 'simulationInputs/simulationPeriods');
            expect(getLocalStorage)
                .toHaveBeenNthCalledWith((4 * index) + 3, 'simulationInputs/historicalDataInputMethod');
            expect(getLocalStorage).toHaveBeenNthCalledWith((4 * index) + 4, 'simulationInputs/historicalData');

            expect(commit).toHaveBeenNthCalledWith((4 * index) + 1, 'SET_MILESTONE', passedValues.milestone);
            expect(commit).toHaveBeenNthCalledWith(
                (4 * index) + 2,
                'SET_SIMULATION_PERIODS',
                passedValues.simulationPeriods,
            );
            expect(commit).toHaveBeenNthCalledWith(
                (4 * index) + 3,
                'SET_HISTORICAL_DATA_INPUT_METHOD',
                passedValues.historicalDataInputMethod,
            );
            expect(commit).toHaveBeenNthCalledWith(
                (4 * index) + 4,
                'SET_HISTORICAL_DATA',
                passedValues.historicalData,
            );
        }
    });

    it('sets milestone mutation and local storage as integer through action', () => {
        const commit = jest.fn();

        for (const [index, {input, expected}] of inputsCastAsInteger.entries()) {
            storeModule.actions.setMilestone({commit}, input);
            expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_MILESTONE', expected);
            expect(setLocalStorage).toHaveBeenNthCalledWith(index + 1, 'simulationInputs/milestone', expected);
        }
    });

    it('sets simulation periods mutation and local storage as positive integer through action', () => {
        const commit = jest.fn();

        for (const [index, {input, expected}] of inputsCastAsPositiveInteger.entries()) {
            storeModule.actions.setSimulationPeriods({commit}, input);
            expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_SIMULATION_PERIODS', expected);
            expect(setLocalStorage).toHaveBeenNthCalledWith(index + 1, 'simulationInputs/simulationPeriods', expected);
        }
    });

    it('sets historical data input method and local storage correctly through action', () => {
        const commit = jest.fn();

        for (const [index, {input, expected}] of [
            {input: 67, expected: '67'},
            {input: 'bulk', expected: 'bulk'},
            {input: 'manual', expected: 'manual'},
        ].entries()) {
            storeModule.actions.setHistoricalDataInputMethod({commit}, input);
            expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_HISTORICAL_DATA_INPUT_METHOD', expected);
            expect(setLocalStorage)
                .toHaveBeenNthCalledWith(index + 1, 'simulationInputs/historicalDataInputMethod', expected);
        }
    });

    it('sets historical data and local storage correctly through action', () => {
        const commit = jest.fn();

        for (const [index, {input, expected}] of [
            {input: null, expected: []},
            {input: undefined, expected: []},
            {input: 'someOldNonsense', expected: []},
            {input: [], expected: []},
            {input: [1, 7, 3, -4, 0, 0, 3], expected: [1, 7, 3, -4, 0, 0, 3]},
            {input: [1, 7.2, '9', -4], expected: [1, 7, 9, -4]},
        ].entries()) {
            storeModule.actions.setHistoricalData({commit}, input);
            expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_HISTORICAL_DATA', expected);
            expect(setLocalStorage).toHaveBeenNthCalledWith(index + 1, 'simulationInputs/historicalData', expected);
        }
    });

    it('sets historical data from text correctly through action by handing off to sibling action', () => {
        const dispatch = jest.fn();
        const state = {
            historicalData: [100, 90, 80, 70, 60],
        };

        let callIndex = 0;
        for (const {input, expectsDispatch, expected} of [
            {input: '100, 90, 80, 70, 60', expectsDispatch: false},
            {input: '100, 90, 80, 70, 60,', expectsDispatch: false},
            {input: '100,,e43, 90, 80, 70, 60', expectsDispatch: false},
            {input: '', expectsDispatch: true, expected: []},
            {input: ',', expectsDispatch: true, expected: []},
            {input: '0', expectsDispatch: true, expected: [0]},
            {input: '1,7,8', expectsDispatch: true, expected: [1, 7, 8]},
            {input: '1;4;8', expectsDispatch: true, expected: [1, 4, 8]},
            {input: '3 6 5', expectsDispatch: true, expected: [3, 6, 5]},
            {input: 'a3 6 5', expectsDispatch: true, expected: [6, 5]},
            {input: '1;_4;8', expectsDispatch: true, expected: [1, 8]},
            {input: '7.2 2.7', expectsDispatch: true, expected: [7, 2]},
            {input: '4 -3 ,  sda ,  0  ; e10 9', expectsDispatch: true, expected: [4, -3, 0, 9]},
        ]) {
            storeModule.actions.setHistoricalDataFromText({dispatch, state}, input);
            if (expectsDispatch) {
                callIndex++;
                expect(dispatch).toHaveBeenNthCalledWith(callIndex, 'setHistoricalData', expected);
            }
        }
    });

    it('sets historical data length mutation and local storage correctly through action', () => {
        const commit = jest.fn();

        for (const [index, {input, expectedLength}] of [
            {input: 3, expectedLength: 3},
            {input: '4', expectedLength: 4},
            {input: 1, expectedLength: 1},
            {input: 0, expectedLength: 0},
            {input: -1, expectedLength: 0},
        ].entries()) {
            const stateValue = [17, 10];
            const state = {historicalData: stateValue};

            storeModule.actions.setHistoricalRecordCount({state, commit}, input);
            expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_HISTORICAL_DATA_LENGTH', expectedLength);
            expect(setLocalStorage).toHaveBeenNthCalledWith(index + 1, 'simulationInputs/historicalData', stateValue);

            const callIndexCommit = commit.mock.invocationCallOrder[index];
            const callIndexSetLocalStorage = setLocalStorage.mock.invocationCallOrder[index];
            expect(callIndexCommit).toBeCalledBefore(callIndexSetLocalStorage);
        }
    });

    it('returns milestone', () => {
        const state = {milestone: 756};
        const result = storeModule.getters.milestone(state);
        expect(result).toBe(756);
    });

    it('returns simulation periods', () => {
        const state = {simulationPeriods: 890};
        const result = storeModule.getters.simulationPeriods(state);
        expect(result).toBe(890);
    });

    it('returns whether historical data is being input manually', () => {
        for (const {stateValue, expected} of [
            {stateValue: true, expected: true},
            {stateValue: false, expected: false},
        ]) {
            const state = {isHistoricalDataInputManually: stateValue};
            const result = storeModule.getters.isHistoricalDataInputManually(state);
            expect(result).toBe(expected);
        }
    });

    it('returns historical data', () => {
        for (const {stateValue, expected} of [
            {stateValue: undefined, expected: []},
            {stateValue: null, expected: []},
            {stateValue: [], expected: []},
            {stateValue: [0, 9, 9, 0, 7], expected: [0, 9, 9, 0, 7]},
        ]) {
            const state = {historicalData: stateValue};
            const result = storeModule.getters.historicalData(state);
            expect(result).toStrictEqual(expected);
        }
    });

    it('returns historical data as text', () => {
        for (const {stateValue, expected} of [
            {stateValue: undefined, expected: ''},
            {stateValue: null, expected: ''},
            {stateValue: [], expected: ''},
            {stateValue: [0, 9, 9, 0, 7], expected: '0, 9, 9, 0, 7'},
        ]) {
            const state = {historicalData: stateValue};
            const result = storeModule.getters.historicalDataAsText(state);
            expect(result).toStrictEqual(expected);
        }
    });

    it('returns historical record count', () => {
        for (const {stateValue, expected} of [
            {stateValue: undefined, expected: 0},
            {stateValue: null, expected: 0},
            {stateValue: [], expected: 0},
            {stateValue: [0, 9, 9, 0, 7], expected: 5},
        ]) {
            const state = {historicalData: stateValue};
            const result = storeModule.getters.historicalRecordCount(state);
            expect(result).toStrictEqual(expected);
        }
    });
});
