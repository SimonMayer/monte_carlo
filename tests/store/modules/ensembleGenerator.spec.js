import storeModule from '@/store/modules/ensembleGenerator';
import {
    arrayOfIntegerArraysEachSortedAscendingly,
    inputsAsValidIntegerOrNull,
    inputsCastAsArrayItemsCastAsPositiveIntegerDefaultsToEmptyIfInvalid,
    inputsCastAsPositiveInteger,
    inputsCastToEmptyArrayIfNotArrayOfArraysOfIntegers,
} from '../../testUtils/dataProviders';
import {getLocalStorage, setLocalStorage} from '@/utils/localStorage';

jest.mock('@/utils/localStorage', () => ({
    setLocalStorage: jest.fn(),
    getLocalStorage: jest.fn(),
}));

describe('ensemble generator store module', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('sets simulation run count as positive integer through mutation', () => {
        const state = {simulationRunCount: null};

        for (const {input, expected} of inputsCastAsPositiveInteger) {
            storeModule.mutations.SET_SIMULATION_RUN_COUNT(state, input);
            expect(state.simulationRunCount).toBe(expected);
        }
    });

    it('sets simulation batch size as positive integer through mutation', () => {
        const state = {simulationBatchSize: null};

        for (const {input, expected} of inputsCastAsPositiveInteger) {
            storeModule.mutations.SET_SIMULATION_BATCH_SIZE(state, input);
            expect(state.simulationBatchSize).toBe(expected);
        }
    });

    it('resets state properties through mutation, except those for simulation run count and batch size', () => {
        const state = {
            simulationBatchSize: 123,
            simulationRunCount: 184,
            literallyAnyIntegerProperty: 987,
            literallyAnyArrayProperty: [22, 45, [3, 17]],
        };

        storeModule.mutations.RESET_STATE(state);
        expect(state.simulationBatchSize).toBe(123);
        expect(state.simulationRunCount).toBe(184);
        expect(state.literallyAnyIntegerProperty).toBe(null);
        expect(state.literallyAnyArrayProperty).toStrictEqual([]);
    });

    it('sets milestone as positive integer through mutation', () => {
        const state = {milestone: null};

        for (const {input, expected} of inputsCastAsPositiveInteger) {
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

    it('sets historical data either as an array of positive integers or empty array through mutation', () => {
        const state = {historicalData: []};

        for (const {input, expected} of inputsCastAsArrayItemsCastAsPositiveIntegerDefaultsToEmptyIfInvalid) {
            storeModule.mutations.SET_HISTORICAL_DATA(state, input);
            expect(state.historicalData).toStrictEqual(expected);
        }
    });

    it('prepares simulation progression by period state, according to the simulation periods, through mutation', () => {
        const state = {
            simulationPeriods: 4,
            simulationProgressionByPeriod: [],
        };

        storeModule.mutations.CREATE_SIMULATION_PROGRESSION_ARRAYS(state);
        expect(state.simulationProgressionByPeriod).toStrictEqual([[], [], [], []]);
    });

    it('records simulated period outcomes cumulatively per simulation, through mutation', () => {
        const state = {
            simulationProgressionByPeriod: [[], [], []],
        };

        storeModule.mutations.RECORD_SIMULATED_PERIOD_OUTCOME(
            state,
            {periodOutcome: 10, simulationIndex: 0, simulatedPeriod: 0},
        );
        expect(state.simulationProgressionByPeriod).toStrictEqual([[10], [], []]);
        storeModule.mutations.RECORD_SIMULATED_PERIOD_OUTCOME(
            state,
            {periodOutcome: 20, simulationIndex: 0, simulatedPeriod: 1},
        );
        expect(state.simulationProgressionByPeriod).toStrictEqual([[10], [30], []]);
        storeModule.mutations.RECORD_SIMULATED_PERIOD_OUTCOME(
            state,
            {periodOutcome: 7, simulationIndex: 0, simulatedPeriod: 2},
        );
        expect(state.simulationProgressionByPeriod).toStrictEqual([[10], [30], [37]]);
        storeModule.mutations.RECORD_SIMULATED_PERIOD_OUTCOME(
            state,
            {periodOutcome: 16, simulationIndex: 1, simulatedPeriod: 0},
        );
        expect(state.simulationProgressionByPeriod).toStrictEqual([[10, 16], [30], [37]]);
        storeModule.mutations.RECORD_SIMULATED_PERIOD_OUTCOME(
            state,
            {periodOutcome: 3, simulationIndex: 1, simulatedPeriod: 1},
        );
        expect(state.simulationProgressionByPeriod).toStrictEqual([[10, 16], [30, 19], [37]]);
    });

    it('populates sorted simulation progression arrays, ascendingly per period, without changing the original, through mutation', () => {
        for (const {input, expected} of arrayOfIntegerArraysEachSortedAscendingly) {
            const state = {
                simulationProgressionByPeriod: input,
                sortedSimulationProgressionByPeriod: [],
            };
            storeModule.mutations.POPULATE_SORTED_SIMULATION_PROGRESSION_ARRAYS(state);
            expect(state.simulationProgressionByPeriod).toStrictEqual(input);
            expect(state.sortedSimulationProgressionByPeriod).toStrictEqual(expected);
        }
    });

    it('records generated timestamp as the current timestamp through mutation', () => {
        const currentTimestamp = 1487076708017;
        Date.now = jest.fn(() => currentTimestamp);
        const state = {generatedTimestamp: null};

        storeModule.mutations.RECORD_GENERATED_TIMESTAMP(state);
        expect(state.generatedTimestamp).toStrictEqual(currentTimestamp);
    });

    it('sets generated timestamp as the provided timestamp through mutation', () => {
        for (const {input, expected} of inputsAsValidIntegerOrNull) {
            const state = {generatedTimestamp: null};
            storeModule.mutations.SET_GENERATED_TIMESTAMP(state, input);
            expect(state.generatedTimestamp).toStrictEqual(expected);
        }
    });

    it('sets simulation progress by period as an array of arrays of integers or empty array through mutation', () => {
        const state = {simulationProgressionByPeriod: []};

        for (const {input, expected} of inputsCastToEmptyArrayIfNotArrayOfArraysOfIntegers) {
            storeModule.mutations.SET_SIMULATION_PROGRESS_BY_PERIOD(state, input);
            expect(state.simulationProgressionByPeriod).toStrictEqual(expected);
        }
    });

    it('sets sorted simulation progress by period as an array of arrays of integers or empty array through mutation', () => {
        const state = {sortedSimulationProgressionByPeriod: []};

        for (const {input, expected} of inputsCastToEmptyArrayIfNotArrayOfArraysOfIntegers) {
            storeModule.mutations.SET_SORTED_SIMULATION_PROGRESS_BY_PERIOD(state, input);
            expect(state.sortedSimulationProgressionByPeriod).toStrictEqual(expected);
        }
    });

    it('loads from local storage and sets mutations correctly through action', () => {
        const commit = jest.fn();
        let commitCallIndex = 1;
        let getLocalStorageCallIndex = 1;

        for (const {localStorage, expectedMutations} of [
            {
                localStorage: {
                    milestone: 10,
                    simulationPeriods: 11,
                    historicalData: [9, 0, 2],
                    simulationProgressionByPeriod: [[1, 4, 1], [3, 5, 2]],
                    sortedSimulationProgressionByPeriod: [[1, 1, 3], [2, 4, 4]],
                    generatedTimestamp: 7188,
                },
                expectedMutations: [
                    {key: 'SET_MILESTONE', value: 10},
                    {key: 'SET_SIMULATION_PERIODS', value: 11},
                    {key: 'SET_HISTORICAL_DATA', value: [9, 0, 2]},
                    {key: 'SET_SIMULATION_PROGRESS_BY_PERIOD', value: [[1, 4, 1], [3, 5, 2]]},
                    {key: 'SET_SORTED_SIMULATION_PROGRESS_BY_PERIOD', value: [[1, 1, 3], [2, 4, 4]]},
                    {key: 'SET_GENERATED_TIMESTAMP', value: 7188},
                ],
            },
            {
                localStorage: {
                    milestone: undefined,
                    simulationPeriods: undefined,
                    historicalData: undefined,
                    simulationProgressionByPeriod: undefined,
                    sortedSimulationProgressionByPeriod: undefined,
                    generatedTimestamp: undefined,
                },
                expectedMutations: [],
            },
            {
                localStorage: {
                    milestone: 9,
                    historicalData: [19, 10, 12],
                    sortedSimulationProgressionByPeriod: [[17, 19]],
                    generatedTimestamp: 1877073967717,
                },
                expectedMutations: [
                    {key: 'SET_MILESTONE', value: 9},
                    {key: 'SET_HISTORICAL_DATA', value: [19, 10, 12]},
                    {key: 'SET_SORTED_SIMULATION_PROGRESS_BY_PERIOD', value: [[17, 19]]},
                    {key: 'SET_GENERATED_TIMESTAMP', value: 1877073967717},
                ],
            },
            {
                localStorage: {
                    simulationPeriods: 15,
                    simulationProgressionByPeriod: [[4, 18]],
                },
                expectedMutations: [
                    {key: 'SET_SIMULATION_PERIODS', value: 15},
                    {key: 'SET_SIMULATION_PROGRESS_BY_PERIOD', value: [[4, 18]]},
                ],
            },
        ]) {
            getLocalStorage.mockImplementation((argument) => {
                const key = argument.replace(/^ensembleGenerator\//, '');
                return localStorage[key];
            });
            storeModule.actions.loadFromLocalStorage({commit});

            for (const localStorageKey of [
                'ensembleGenerator/milestone',
                'ensembleGenerator/simulationPeriods',
                'ensembleGenerator/historicalData',
                'ensembleGenerator/simulationProgressionByPeriod',
                'ensembleGenerator/sortedSimulationProgressionByPeriod',
                'ensembleGenerator/generatedTimestamp',
            ]) {
                expect(getLocalStorage).toHaveBeenNthCalledWith(getLocalStorageCallIndex++, localStorageKey);
            }

            for (const {key, value} of expectedMutations) {
                expect(commit).toHaveBeenNthCalledWith(commitCallIndex++, key, value);
            }
        }
    });

    it('sets simulation run count mutation as positive integer through action', () => {
        const commit = jest.fn();

        for (const [index, {input, expected}] of inputsCastAsPositiveInteger.entries()) {
            storeModule.actions.setSimulationRunCount({commit}, input);
            expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_SIMULATION_RUN_COUNT', expected);
        }
    });

    it('sets simulation batch size mutation as positive integer through action', () => {
        const commit = jest.fn();

        for (const [index, {input, expected}] of inputsCastAsPositiveInteger.entries()) {
            storeModule.actions.setSimulationBatchSize({commit}, input);
            expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_SIMULATION_BATCH_SIZE', expected);
        }
    });

    it('calls the mutation to resetState, and clears local storage through clearEnsemble action', () => {
        const commit = jest.fn();

        storeModule.actions.clearEnsemble({commit});
        expect(commit).toHaveBeenNthCalledWith(1, 'RESET_STATE');
        expect(setLocalStorage).toHaveBeenNthCalledWith(1, 'ensembleGenerator/milestone', null);
        expect(setLocalStorage).toHaveBeenNthCalledWith(2, 'ensembleGenerator/simulationPeriods', null);
        expect(setLocalStorage).toHaveBeenNthCalledWith(3, 'ensembleGenerator/historicalData', null);
        expect(setLocalStorage).toHaveBeenNthCalledWith(4, 'ensembleGenerator/simulationProgressionByPeriod', null);
        expect(setLocalStorage)
            .toHaveBeenNthCalledWith(5, 'ensembleGenerator/sortedSimulationProgressionByPeriod', null);
        expect(setLocalStorage).toHaveBeenNthCalledWith(6, 'ensembleGenerator/generatedTimestamp', null);
    });

    it('errors if trying to create an ensemble before setting run count or batch size', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();

        const testCaseStates = [
            {},
            {simulationBatchSize: 100},
            {simulationRunCount: 100},
        ];
        for (const state of testCaseStates) {
            await expect(storeModule.actions.generateEnsemble({state, commit, dispatch})).rejects.toThrow(
                'simulation run count and batch size must both be specified',
            );
            expect(commit).not.toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();
        }
    });

    it('dispatches to record the loading start when creating an ensemble', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const state = {simulationBatchSize: 100, simulationRunCount: 100};

        storeModule.actions.generateEnsemble({state, commit, dispatch});
        expect(dispatch).toHaveBeenNthCalledWith(1, 'loading/recordLoadingStart', 'generateEnsemble', {root: true});
    });

    it('calls the reset state mutation when creating an ensemble', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const state = {simulationBatchSize: 100, simulationRunCount: 100};

        jest.useFakeTimers();
        storeModule.actions.generateEnsemble({state, commit, dispatch});
        jest.runAllTimers();

        expect(commit).toHaveBeenNthCalledWith(1, 'RESET_STATE');

        jest.useRealTimers();
    });

    it('dispatches to capture the simulation inputs when creating an ensemble', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const state = {simulationBatchSize: 100, simulationRunCount: 100};

        jest.useFakeTimers();
        storeModule.actions.generateEnsemble({state, commit, dispatch});
        jest.runAllTimers();

        expect(dispatch).toHaveBeenNthCalledWith(2, 'captureSimulationInputs');

        jest.useRealTimers();
    });

    it('calls the mutation to create simulation progression arrays when creating an ensemble', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const state = {simulationBatchSize: 100, simulationRunCount: 100};

        jest.useFakeTimers();
        storeModule.actions.generateEnsemble({state, commit, dispatch});
        jest.runAllTimers();

        expect(commit).toHaveBeenNthCalledWith(2, 'CREATE_SIMULATION_PROGRESSION_ARRAYS');

        jest.useRealTimers();
    });

    it('dispatches to run the simulation batch, starting at index 0, when creating an ensemble', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const state = {simulationBatchSize: 100, simulationRunCount: 100};

        jest.useFakeTimers();
        storeModule.actions.generateEnsemble({state, commit, dispatch});
        jest.runAllTimers();

        expect(dispatch).toHaveBeenNthCalledWith(3, 'runSimulationBatch', 0);

        jest.useRealTimers();
    });

    it('calls the mutations with data from the simulationInputs store module when capturing simulation inputs', () => {
        const historicalData = [17, 18, 12, 13];
        const milestone = 195;
        const simulationPeriods = 15;

        const commit = jest.fn();
        const rootGetters = {
            'simulationInputs/historicalData': historicalData,
            'simulationInputs/milestone': milestone,
            'simulationInputs/simulationPeriods': simulationPeriods,
        };

        storeModule.actions.captureSimulationInputs({commit, rootGetters});
        expect(commit).toHaveBeenNthCalledWith(1, 'SET_HISTORICAL_DATA', historicalData);
        expect(commit).toHaveBeenNthCalledWith(2, 'SET_MILESTONE', milestone);
        expect(commit).toHaveBeenNthCalledWith(3, 'SET_SIMULATION_PERIODS', simulationPeriods);
    });

    it('errors if trying to run a simulation batch before setting run count or batch size', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();

        const testCaseStates = [
            {},
            {simulationBatchSize: 100},
            {simulationRunCount: 100},
        ];
        for (const state of testCaseStates) {
            await expect(storeModule.actions.runSimulationBatch({state, commit, dispatch})).rejects.toThrow(
                'simulation run count and batch size must both be specified',
            );
            expect(commit).not.toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();
        }
    });

    it('dispatches to run the simulations with the correct index, and then requests further batches, or post simulation actions, when running a simulation batch', async () => {
        const dispatch = jest.fn();

        const testCases = [
            {
                state: {simulationBatchSize: 3, simulationRunCount: 6, simulationProgressionByPeriod: [[]]},
                input: 0,
                expectedIndexes: {
                    firstSimulatedIndex: 0,
                    lastSimulatedIndex: 2,
                    subsequentSimulationBatchIndex: 3,
                },
                expectedCompleteSimulationsForPurposeOfMessage: 0,
            },
            {
                state: {simulationBatchSize: 2, simulationRunCount: 6, simulationProgressionByPeriod: [[3, 4]]},
                input: 3,
                expectedIndexes: {
                    firstSimulatedIndex: 3,
                    lastSimulatedIndex: 4,
                    subsequentSimulationBatchIndex: 5,
                },
                expectedCompleteSimulationsForPurposeOfMessage: 2,
            },
            {
                state: {simulationBatchSize: 3, simulationRunCount: 6, simulationProgressionByPeriod: [[3]]},
                input: 3,
                expectedIndexes: {
                    firstSimulatedIndex: 3,
                    lastSimulatedIndex: 5,
                    subsequentSimulationBatchIndex: null,
                },
                expectedCompleteSimulationsForPurposeOfMessage: 1,
            },
            {
                state: {simulationBatchSize: 3, simulationRunCount: 6, simulationProgressionByPeriod: [[]]},
                input: 5,
                expectedIndexes: {
                    firstSimulatedIndex: 5,
                    lastSimulatedIndex: 5,
                    subsequentSimulationBatchIndex: null,
                },
                expectedCompleteSimulationsForPurposeOfMessage: 0,
            },
        ];

        let dispatchCallIndex = 1;

        jest.useFakeTimers();
        for (const {state, input, expectedIndexes, expectedCompleteSimulationsForPurposeOfMessage} of testCases) {
            await storeModule.actions.runSimulationBatch({state, dispatch}, input);
            for (
                let simulationIndex = expectedIndexes.firstSimulatedIndex;
                simulationIndex <= expectedIndexes.lastSimulatedIndex;
                simulationIndex++
            ) {
                expect(dispatch).toHaveBeenNthCalledWith(dispatchCallIndex, 'runSimulation', simulationIndex);
                dispatchCallIndex++;
            }
            expect(dispatch).toHaveBeenNthCalledWith(
                dispatchCallIndex,
                'loading/setLoadingMessage',
                {
                    key: 'generateEnsemble',
                    message: `Generating ensemble: ${expectedCompleteSimulationsForPurposeOfMessage} of ${state.simulationRunCount} simulations complete.`,
                },
                {root: true},
            );
            dispatchCallIndex++;

            jest.runAllTimers();

            if (expectedIndexes.subsequentSimulationBatchIndex) {
                expect(dispatch).toHaveBeenNthCalledWith(
                    dispatchCallIndex,
                    'runSimulationBatch',
                    expectedIndexes.subsequentSimulationBatchIndex,
                );
            } else {
                expect(dispatch).toHaveBeenNthCalledWith(dispatchCallIndex, 'handlePostSimulationEnsembleCreation');
            }
            dispatchCallIndex++;

        }
        jest.useRealTimers();
    });

    it('calls the mutation to populate sorted simulation progress, and dispatches to actions to persist local storage and record the loading end when handling post-simulation aspects of the ensemble creation', () => {
        const commit = jest.fn();
        const dispatch = jest.fn();

        storeModule.actions.handlePostSimulationEnsembleCreation({commit, dispatch});
        expect(commit).toHaveBeenNthCalledWith(1, 'POPULATE_SORTED_SIMULATION_PROGRESSION_ARRAYS');
        expect(commit).toHaveBeenNthCalledWith(2, 'RECORD_GENERATED_TIMESTAMP');
        expect(dispatch).toHaveBeenNthCalledWith(1, 'persistEnsembleToLocalStorage');
        expect(dispatch).toHaveBeenNthCalledWith(2, 'loading/recordLoadingEnd', 'generateEnsemble', {root: true});
    });

    it('persists the calculated values and captured simulation inputs to local storage', () => {
        const state = {
            generatedTimestamp: 1629400823000,
            milestone: 407,
            simulationPeriods: 16,
            historicalData: [15, 8, 0, 3],
            simulationProgressionByPeriod: [[1, 7, 2, 1]],
            sortedSimulationProgressionByPeriod: [[2, 5, 3], [4, 7, 9]],
        };
        storeModule.actions.persistEnsembleToLocalStorage({state});
        expect(setLocalStorage).toHaveBeenNthCalledWith(
            1,
            'ensembleGenerator/milestone',
            state.milestone,
        );
        expect(setLocalStorage).toHaveBeenNthCalledWith(
            2,
            'ensembleGenerator/simulationPeriods',
            state.simulationPeriods,
        );
        expect(setLocalStorage).toHaveBeenNthCalledWith(
            3,
            'ensembleGenerator/historicalData',
            state.historicalData,
        );
        expect(setLocalStorage).toHaveBeenNthCalledWith(
            4,
            'ensembleGenerator/simulationProgressionByPeriod',
            state.simulationProgressionByPeriod,
        );
        expect(setLocalStorage).toHaveBeenNthCalledWith(
            5,
            'ensembleGenerator/sortedSimulationProgressionByPeriod',
            state.sortedSimulationProgressionByPeriod,
        );
        expect(setLocalStorage).toHaveBeenNthCalledWith(
            6,
            'ensembleGenerator/generatedTimestamp',
            state.generatedTimestamp,
        );
    });

    it('errors if trying to run a simulation and simulation periods is empty or less than 1', async () => {
        const testCaseStates = [
            {},
            {simulationPeriods: null},
            {simulationPeriods: 0},
            {simulationPeriods: -1},
        ];
        for (const state of testCaseStates) {
            await expect(storeModule.actions.runSimulation({state})).rejects.toThrow(
                'a positive simulation periods value is required in order to run a simulation',
            );
        }
    });

    it('calls the mutation to record a simulated period outcome, based on what was drawm, when performing the run simulation action', async () => {
        const testCases = [
            {
                simulationPeriods: 2,
                simulationIndex: 1,
                drawnValues: [3, 7],
                expectedSimulatedOutcomes: [
                    {periodOutcome: 3, simulatedPeriod: 0, simulationIndex: 1},
                    {periodOutcome: 7, simulatedPeriod: 1, simulationIndex: 1},
                ],
            },
            {
                simulationPeriods: 1,
                simulationIndex: 99,
                drawnValues: [5],
                expectedSimulatedOutcomes: [
                    {periodOutcome: 5, simulatedPeriod: 0, simulationIndex: 99},
                ],
            },
        ];

        for (const {simulationPeriods, simulationIndex, drawnValues, expectedSimulatedOutcomes} of testCases) {
            const state = {simulationPeriods};
            const commit = jest.fn();
            const dispatch = jest.fn();

            let callIndex = 0;
            dispatch.mockImplementation((action) => {
                if (action === 'runDraw') {
                    return drawnValues[callIndex++];
                }
            });

            await storeModule.actions.runSimulation({state, commit, dispatch}, simulationIndex);

            for (const [index, {
                periodOutcome,
                simulatedPeriod,
                simulationIndex
            }] of expectedSimulatedOutcomes.entries()) {
                expect(dispatch).toHaveBeenNthCalledWith(index + 1, 'runDraw');
                expect(commit).toHaveBeenNthCalledWith(
                    index + 1,
                    'RECORD_SIMULATED_PERIOD_OUTCOME',
                    {periodOutcome, simulatedPeriod, simulationIndex},
                );
            }
        }
    });

    it('errors if trying to run a draw with empty historical data', async () => {
        const testCaseStates = [
            {},
            {historicalData: []},
            {historicalData: null},
        ];
        for (const state of testCaseStates) {
            await expect(storeModule.actions.runDraw({state})).rejects.toThrow(
                'historical data is required in order to draw',
            );
        }
    });

    it('picks a random value from historical data when performing the run draw action', async () => {
        const runCountsFor99Point99PercentConfidenceByDataLength = [1, 1, 14, 23, 33];

        for (const {historicalData} of [
            {historicalData: [2]},
            {historicalData: [4, 4]},
            {historicalData: [3, 4]},
            {historicalData: [3, 0, 1, 4]},
        ]) {
            const state = {historicalData};
            const results = new Set();
            const runCount = runCountsFor99Point99PercentConfidenceByDataLength[historicalData.length];

            for (let i = 0; i < runCount; i++) {
                const result = await storeModule.actions.runDraw({state});
                results.add(result);
            }

            historicalData.forEach(value => {
                expect(results.has(value)).toBe(true);
            });
        }
    });

    it('returns the generated timestamp from a getter', () => {
        [null, -1, 0, 1].forEach(
            (value) => {
                const state = {generatedTimestamp: value};
                const result = storeModule.getters.generatedTimestamp(state);
                expect(result).toBe(value);
            },
        );
    });

    it('returns the milestone state from a getter', () => {
        [null, -1, 0, 1].forEach(
            (value) => {
                const state = {milestone: value};
                const result = storeModule.getters.milestone(state);
                expect(result).toBe(value);
            },
        );
    });

    it('returns the simulation periods state from a getter', () => {
        [null, -1, 0, 1].forEach(
            (value) => {
                const state = {simulationPeriods: value};
                const result = storeModule.getters.simulationPeriods(state);
                expect(result).toBe(value);
            },
        );
    });

    it('returns the count of simulations completed, by checking simuation progress in the first period, and defaults to 0 when such data is invalid', () => {
        for (const {simulationProgressionByPeriod, expected} of [
            {simulationProgressionByPeriod: null, expected: 0},
            {simulationProgressionByPeriod: [], expected: 0},
            {simulationProgressionByPeriod: 'invalid', expected: 0},
            {simulationProgressionByPeriod: [[]], expected: 0},
            {simulationProgressionByPeriod: [[7]], expected: 1},
            {simulationProgressionByPeriod: [[7, 4]], expected: 2},
            {simulationProgressionByPeriod: [[7, 4, 7], [1, 6, 9]], expected: 3},
            {simulationProgressionByPeriod: [[7, 4, 7], [1, 6]], expected: 3},
        ]) {
            const state = {simulationProgressionByPeriod};
            const result = storeModule.getters.completedSimulationCount(state);
            expect(result).toBe(expected);
        }
    });

    it('returns whether an ensemble is generated, by checking that state generatedTimestamp is not null', () => {
        for (const {generatedTimestamp, expected} of [
            {generatedTimestamp: 0, expected: true},
            {generatedTimestamp: 1716733395554, expected: true},
            {generatedTimestamp: null, expected: false},
        ]) {
            const state = {generatedTimestamp};
            const result = storeModule.getters.isGenerated(state);
            expect(result).toBe(expected);
        }
    });

    it('returns a conservative figure for the progression at a specific period, at a specific percentile, and returns null if no value is found', () => {
        for (const {periodIndex, percentileFloat, sortedSimulationProgressionByPeriod, expected} of [
            {
                periodIndex: 0,
                percentileFloat: 0.0,
                sortedSimulationProgressionByPeriod: [[1, 2, 7, 9, 9]],
                expected: 1,
            },
            {
                periodIndex: 0,
                percentileFloat: 0.39,
                sortedSimulationProgressionByPeriod: [[1, 2, 7, 9, 9]],
                expected: 1,
            },
            {
                periodIndex: 0,
                percentileFloat: 0.4,
                sortedSimulationProgressionByPeriod: [[1, 2, 7, 9, 9]],
                expected: 2,
            },
            {
                periodIndex: 1,
                percentileFloat: 0.99,
                sortedSimulationProgressionByPeriod: [[1, 3], [4, 9]],
                expected: 4,
            },
            {
                periodIndex: 1,
                percentileFloat: 1,
                sortedSimulationProgressionByPeriod: [[1, 3], [4, 9]],
                expected: 9,
            },
            {
                periodIndex: 0,
                percentileFloat: 0.99,
                sortedSimulationProgressionByPeriod: [],
                expected: null,
            },
            {
                periodIndex: 2,
                percentileFloat: 0.99,
                sortedSimulationProgressionByPeriod: [[1, 3], [4, 9]],
                expected: null,
            },
        ]) {
            const state = {sortedSimulationProgressionByPeriod};
            const result = storeModule.getters
                .getConservativelyPercentiledProgressionAtPeriod(state)(periodIndex, percentileFloat);
            expect(result).toStrictEqual(expected);
        }
    });

    it('returns a chance of reaching the milestone by a specific period, and returns null if no value is found', () => {
        for (const {periodIndex, milestone, sortedSimulationProgressionByPeriod, expected} of [
            {
                periodIndex: 0,
                milestone: 10,
                sortedSimulationProgressionByPeriod: [[1, 2, 7, 9, 9]],
                expected: 0,
            },
            {
                periodIndex: 0,
                milestone: 9,
                sortedSimulationProgressionByPeriod: [[1, 2, 7, 9, 9]],
                expected: 0.4,
            },
            {
                periodIndex: 0,
                milestone: 1,
                sortedSimulationProgressionByPeriod: [[1, 2, 7, 9, 9]],
                expected: 1,
            },
            {
                periodIndex: 0,
                milestone: 0,
                sortedSimulationProgressionByPeriod: [[1, 2, 7, 9, 9]],
                expected: 1,
            },
            {
                periodIndex: 1,
                milestone: 7,
                sortedSimulationProgressionByPeriod: [[1, 2, 7, 9, 9], [3, 8, 11, 13, 16]],
                expected: 0.8,
            },
            {
                periodIndex: 0,
                milestone: 20,
                sortedSimulationProgressionByPeriod: [],
                expected: null,
            },
            {
                periodIndex: 2,
                milestone: 2,
                sortedSimulationProgressionByPeriod: [[1, 3], [4, 9]],
                expected: null,
            },
            {
                periodIndex: 0,
                milestone: null,
                sortedSimulationProgressionByPeriod: [[1, 3]],
                expected: null,
            },
        ]) {
            const state = {milestone, sortedSimulationProgressionByPeriod};
            const result = storeModule.getters.getChanceOfAchievingMilestoneByPeriod(state)(periodIndex);
            expect(result).toStrictEqual(expected);
        }
    });
});
