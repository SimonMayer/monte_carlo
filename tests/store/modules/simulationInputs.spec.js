import simulationInputs from '@/store/modules/simulationInputs';
import {getLocalStorage, setLocalStorage} from '@/utils/localStorage';

jest.mock('@/utils/localStorage', () => ({
    setLocalStorage: jest.fn(),
    getLocalStorage: jest.fn(),
}));

describe('simulationInputs Store', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('sets milestone correctly through mutation', () => {
        const state = {
            milestone: null,
        };

        [
            {input: 99, expected: 99},
            {input: '767', expected: 767},
            {input: -8, expected: -8},
        ].forEach(
            ({input, expected}) => {
                simulationInputs.mutations.SET_MILESTONE(state, input);
                expect(state.milestone).toBe(expected);
            },
        );
    });

    it('sets simulation periods correctly through mutation', () => {
        const state = {
            simulationPeriods: null,
        };

        [
            {input: 99, expected: 99},
            {input: '767', expected: 767},
            {input: 0, expected: 1},
            {input: -8, expected: 1},
        ].forEach(
            ({input, expected}) => {
                simulationInputs.mutations.SET_SIMULATION_PERIODS(state, input);
                expect(state.simulationPeriods).toBe(expected);
            },
        );
    });

    it('sets historical data input method correctly through mutation', () => {
        const state = {
            isHistoricalDataInputManually: false,
        };

        [
            {input: 'manual', expected: true},
            {input: 'bulk', expected: false},
            {input: 'someOldNonsense', expected: false}, // check it sets to false, when previously false
            {input: 'manual', expected: true},
            {input: 'someOldNonsense', expected: false}, // check it sets to false, when previously true
            {input: 32, expected: false},
            {input: true, expected: false},
        ].forEach(
            ({input, expected}) => {
                simulationInputs.mutations.SET_HISTORICAL_DATA_INPUT_METHOD(state, input);
                expect(state.isHistoricalDataInputManually).toBe(expected);
            },
        );
    });

    it('sets historical data correctly through mutation', () => {
        const state = {
            historicalData: [],
        };

        [
            {input: null, expected: []},
            {input: undefined, expected: []},
            {input: 'someOldNonsense', expected: []},
            {input: [], expected: []},
            {input: [1, 7, 3, -4, 0, 0, 3], expected: [1, 7, 3, -4, 0, 0, 3]},
            {input: [1, 7.2, '9', -4], expected: [1, 7, 9, -4]},
        ].forEach(
            ({input, expected}) => {
                simulationInputs.mutations.SET_HISTORICAL_DATA(state, input);
                expect(state.historicalData).toStrictEqual(expected);
            },
        );
    });

    it('sets historical data length correctly through mutation', () => {
        const state = {
            historicalData: [100, 90, 80, 70, 60],
        };

        [
            {input: 5, expected: [100, 90, 80, 70, 60]},
            {input: 7, expected: [100, 90, 80, 70, 60, 0, 0]},
            {input: 4, expected: [100, 90, 80, 70]},
            {input: 5, expected: [100, 90, 80, 70, 0]},
            {input: 0, expected: []},
            {input: 1, expected: [0]},
        ].forEach(
            ({input, expected}) => {
                simulationInputs.mutations.SET_HISTORICAL_DATA_LENGTH(state, input);
                expect(state.historicalData).toStrictEqual(expected);
            },
        );
    });

    it('loads from local storage and sets mutations correctly through action', () => {
        const commit = jest.fn();

        [
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
        ].forEach(
            ({localStorage, passedValues}, index) => {

                getLocalStorage.mockImplementation((key) => localStorage[key]);
                simulationInputs.actions.loadFromLocalStorage({commit});
                expect(getLocalStorage).toHaveBeenNthCalledWith((4 * index) + 1, 'milestone');
                expect(getLocalStorage).toHaveBeenNthCalledWith((4 * index) + 2, 'simulationPeriods');
                expect(getLocalStorage).toHaveBeenNthCalledWith((4 * index) + 3, 'historicalDataInputMethod');
                expect(getLocalStorage).toHaveBeenNthCalledWith((4 * index) + 4, 'historicalData');

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
            },
        );
    });

    it('sets milestone mutation and local storage correctly through action', () => {
        const commit = jest.fn();

        [
            {input: 417, expected: 417},
            {input: '53', expected: 53},
        ].forEach(
            ({input, expected}, index) => {
                simulationInputs.actions.setMilestone({commit}, input);
                expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_MILESTONE', expected);
                expect(setLocalStorage).toHaveBeenNthCalledWith(index + 1, 'milestone', expected);
            },
        );
    });

    it('sets simulation periods mutation and local storage correctly through action', () => {
        const commit = jest.fn();

        [
            {input: 67, expected: 67},
            {input: '253', expected: 253},
        ].forEach(
            ({input, expected}, index) => {
                simulationInputs.actions.setSimulationPeriods({commit}, input);
                expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_SIMULATION_PERIODS', expected);
                expect(setLocalStorage).toHaveBeenNthCalledWith(index + 1, 'simulationPeriods', expected);
            },
        );
    });

    it('sets historical data input method and local storage correctly through action', () => {
        const commit = jest.fn();

        [
            {input: 67, expected: '67'},
            {input: 'bulk', expected: 'bulk'},
            {input: 'manual', expected: 'manual'},
        ].forEach(
            ({input, expected}, index) => {
                simulationInputs.actions.setHistoricalDataInputMethod({commit}, input);
                expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_HISTORICAL_DATA_INPUT_METHOD', expected);
                expect(setLocalStorage).toHaveBeenNthCalledWith(index + 1, 'historicalDataInputMethod', expected);
            },
        );
    });

    it('sets historical data and local storage correctly through action', () => {
        const commit = jest.fn();

        [
            {input: null, expected: []},
            {input: undefined, expected: []},
            {input: 'someOldNonsense', expected: []},
            {input: [], expected: []},
            {input: [1, 7, 3, -4, 0, 0, 3], expected: [1, 7, 3, -4, 0, 0, 3]},
            {input: [1, 7.2, '9', -4], expected: [1, 7, 9, -4]},
        ].forEach(
            ({input, expected}, index) => {
                simulationInputs.actions.setHistoricalData({commit}, input);
                expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_HISTORICAL_DATA', expected);
                expect(setLocalStorage).toHaveBeenNthCalledWith(index + 1, 'historicalData', expected);
            },
        );
    });

    it('sets historical data from text correctly through action by handing off to sibling action', () => {
        const dispatch = jest.fn();
        const state = {
            historicalData: [100, 90, 80, 70, 60],
        };

        let callIndex = 0;
        [
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
        ].forEach(
            ({input, expectsDispatch, expected}) => {
                simulationInputs.actions.setHistoricalDataFromText({dispatch, state}, input);
                if (expectsDispatch) {
                    callIndex++;
                    expect(dispatch).toHaveBeenNthCalledWith(callIndex, 'setHistoricalData', expected);
                }
            },
        );
    });

    it('sets historical data length mutation and local storage correctly through action', () => {
        const commit = jest.fn();

        [
            {input: 307, expected: 307},
            {input: '24', expected: 24},
            {input: 0, expected: 0},
            {input: -1, expected: 0},
        ].forEach(
            ({input, expected}, index) => {
                simulationInputs.actions.setHistoricalRecordCount({commit}, input);
                expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_HISTORICAL_DATA_LENGTH', expected);
            },
        );
    });

    it('returns milestone', () => {
        const state = {
            milestone: 756,
        };
        const result = simulationInputs.getters.milestone(state);
        expect(result).toBe(756);
    });

    it('returns simulation periods', () => {
        const state = {
            simulationPeriods: 890,
        };
        const result = simulationInputs.getters.simulationPeriods(state);
        expect(result).toBe(890);
    });

    it('returns whether historical data is being input manually', () => {

        [
            {stateValue: true, expected: true},
            {stateValue: false, expected: false},
        ].forEach(
            ({stateValue, expected}) => {
                const state = {
                    isHistoricalDataInputManually: stateValue,
                };
                const result = simulationInputs.getters.isHistoricalDataInputManually(state);
                expect(result).toBe(expected);
            },
        );
    });

    it('returns historical data', () => {

        [
            {stateValue: undefined, expected: []},
            {stateValue: null, expected: []},
            {stateValue: [], expected: []},
            {stateValue: [0, 9, 9, 0, 7], expected: [0, 9, 9, 0, 7]},
        ].forEach(
            ({stateValue, expected}) => {
                const state = {
                    historicalData: stateValue,
                };
                const result = simulationInputs.getters.historicalData(state);
                expect(result).toStrictEqual(expected);
            },
        );
    });

    it('returns historical data as text', () => {

        [
            {stateValue: undefined, expected: ''},
            {stateValue: null, expected: ''},
            {stateValue: [], expected: ''},
            {stateValue: [0, 9, 9, 0, 7], expected: '0, 9, 9, 0, 7'},
        ].forEach(
            ({stateValue, expected}) => {
                const state = {
                    historicalData: stateValue,
                };
                const result = simulationInputs.getters.historicalDataAsText(state);
                expect(result).toStrictEqual(expected);
            },
        );
    });

    it('returns historical record count', () => {

        [
            {stateValue: undefined, expected: 0},
            {stateValue: null, expected: 0},
            {stateValue: [], expected: 0},
            {stateValue: [0, 9, 9, 0, 7], expected: 5},
        ].forEach(
            ({stateValue, expected}) => {
                const state = {
                    historicalData: stateValue,
                };
                const result = simulationInputs.getters.historicalRecordCount(state);
                expect(result).toStrictEqual(expected);
            },
        );
    });
});
