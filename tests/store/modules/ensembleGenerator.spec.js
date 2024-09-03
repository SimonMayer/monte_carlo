import ensembleGenerator from '@/store/modules/ensembleGenerator';
import {
    arrayOfIntegerArraysEachSortedAscendingly,
    inputsCastAsArrayItemsCastAsIntegerDefaultsToEmptyIfInvalid,
    inputsCastAsInteger,
    inputsCastAsPositiveInteger,
} from '../../testUtils/dataProviders';

describe('ensembleGenerator store module', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('sets simulation run count as positive integer through mutation', () => {
        const state = {
            simulationRunCount: null,
        };

        inputsCastAsPositiveInteger.forEach(
            ({input, expected}) => {
                ensembleGenerator.mutations.SET_SIMULATION_RUN_COUNT(state, input);
                expect(state.simulationRunCount).toBe(expected);
            },
        );
    });

    it('sets simulation batch size as positive integer through mutation', () => {
        const state = {
            simulationBatchSize: null,
        };

        inputsCastAsPositiveInteger.forEach(
            ({input, expected}) => {
                ensembleGenerator.mutations.SET_SIMULATION_BATCH_SIZE(state, input);
                expect(state.simulationBatchSize).toBe(expected);
            },
        );
    });

    it('resets state properties through mutation, except those for simulation run count and batch size', () => {
        const state = {
            simulationBatchSize: 123,
            simulationRunCount: 184,
            literallyAnyIntegerProperty: 987,
            literallyAnyArrayProperty: [22, 45, [3, 17]],
        };

        ensembleGenerator.mutations.RESET_STATE(state);
        expect(state.simulationBatchSize).toBe(123);
        expect(state.simulationRunCount).toBe(184);
        expect(state.literallyAnyIntegerProperty).toBe(null);
        expect(state.literallyAnyArrayProperty).toStrictEqual([]);
    });

    it('sets milestone correctly through mutation', () => {
        const state = {
            milestone: null,
        };

        inputsCastAsInteger.forEach(
            ({input, expected}) => {
                ensembleGenerator.mutations.SET_MILESTONE(state, input);
                expect(state.milestone).toBe(expected);
            },
        );
    });

    it('sets simulation periods as positive integer through mutation', () => {
        const state = {
            simulationPeriods: null,
        };

        inputsCastAsPositiveInteger.forEach(
            ({input, expected}) => {
                ensembleGenerator.mutations.SET_SIMULATION_PERIODS(state, input);
                expect(state.simulationPeriods).toBe(expected);
            },
        );
    });

    it('sets historical data either as an array of integers or empty array through mutation', () => {
        const state = {
            historicalData: [],
        };

        inputsCastAsArrayItemsCastAsIntegerDefaultsToEmptyIfInvalid.forEach(
            ({input, expected}) => {
                ensembleGenerator.mutations.SET_HISTORICAL_DATA(state, input);
                expect(state.historicalData).toStrictEqual(expected);
            },
        );
    });

    it('prepares simulation progression by period state, according to the simulation periods, through mutation', () => {
        const state = {
            simulationPeriods: 4,
            simulationProgressionByPeriod: [],
        };

        ensembleGenerator.mutations.CREATE_SIMULATION_PROGRESSION_ARRAYS(state);
        expect(state.simulationProgressionByPeriod).toStrictEqual([[], [], [], []]);
    });

    it('records simulated period outcomes cumulatively per simulation, through mutation', () => {
        const state = {
            simulationProgressionByPeriod: [[], [], []],
        };

        ensembleGenerator.mutations.RECORD_SIMULATED_PERIOD_OUTCOME(
            state,
            {periodOutcome: 10, simulationIndex: 0, simulatedPeriod: 0},
        );
        expect(state.simulationProgressionByPeriod).toStrictEqual([[10], [], []]);
        ensembleGenerator.mutations.RECORD_SIMULATED_PERIOD_OUTCOME(
            state,
            {periodOutcome: 20, simulationIndex: 0, simulatedPeriod: 1},
        );
        expect(state.simulationProgressionByPeriod).toStrictEqual([[10], [30], []]);
        ensembleGenerator.mutations.RECORD_SIMULATED_PERIOD_OUTCOME(
            state,
            {periodOutcome: 7, simulationIndex: 0, simulatedPeriod: 2},
        );
        expect(state.simulationProgressionByPeriod).toStrictEqual([[10], [30], [37]]);
        ensembleGenerator.mutations.RECORD_SIMULATED_PERIOD_OUTCOME(
            state,
            {periodOutcome: 16, simulationIndex: 1, simulatedPeriod: 0},
        );
        expect(state.simulationProgressionByPeriod).toStrictEqual([[10, 16], [30], [37]]);
        ensembleGenerator.mutations.RECORD_SIMULATED_PERIOD_OUTCOME(
            state,
            {periodOutcome: 3, simulationIndex: 1, simulatedPeriod: 1},
        );
        expect(state.simulationProgressionByPeriod).toStrictEqual([[10, 16], [30, 19], [37]]);
    });

    it('populates sorted simulation progression arrays, ascendingly per period, without changing the original, through mutation', () => {
        arrayOfIntegerArraysEachSortedAscendingly.forEach(
            ({input, expected}) => {
                const state = {
                    simulationProgressionByPeriod: input,
                    sortedSimulationProgressionByPeriod: [],
                };
                ensembleGenerator.mutations.POPULATE_SORTED_SIMULATION_PROGRESSION_ARRAYS(state);
                expect(state.simulationProgressionByPeriod).toStrictEqual(input);
                expect(state.sortedSimulationProgressionByPeriod).toStrictEqual(expected);
            },
        );
    });

    it('sets simulation run count mutation as positive integer through action', () => {
        const commit = jest.fn();

        inputsCastAsPositiveInteger.forEach(
            ({input, expected}, index) => {
                ensembleGenerator.actions.setSimulationRunCount({commit}, input);
                expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_SIMULATION_RUN_COUNT', expected);
            },
        );
    });

    it('sets simulation batch size mutation as positive integer through action', () => {
        const commit = jest.fn();

        inputsCastAsPositiveInteger.forEach(
            ({input, expected}, index) => {
                ensembleGenerator.actions.setSimulationBatchSize({commit}, input);
                expect(commit).toHaveBeenNthCalledWith(index + 1, 'SET_SIMULATION_BATCH_SIZE', expected);
            },
        );
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
            await expect(ensembleGenerator.actions.createEnsemble({state, commit, dispatch})).rejects.toThrow(
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

        ensembleGenerator.actions.createEnsemble({state, commit, dispatch});
        expect(dispatch).toHaveBeenNthCalledWith(1, 'loading/recordLoadingStart', 'createEnsemble', {root: true});
    });

    it('calls the reset state mutation when creating an ensemble', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const state = {simulationBatchSize: 100, simulationRunCount: 100};

        jest.useFakeTimers();
        ensembleGenerator.actions.createEnsemble({state, commit, dispatch});
        jest.runAllTimers();

        expect(commit).toHaveBeenNthCalledWith(1, 'RESET_STATE');

        jest.useRealTimers();
    });

    it('dispatches to capture the simulation inputs when creating an ensemble', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const state = {simulationBatchSize: 100, simulationRunCount: 100};

        jest.useFakeTimers();
        ensembleGenerator.actions.createEnsemble({state, commit, dispatch});
        jest.runAllTimers();

        expect(dispatch).toHaveBeenNthCalledWith(2, 'captureSimulationInputs');

        jest.useRealTimers();
    });

    it('calls the mutation to create simulation progression arrays when creating an ensemble', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const state = {simulationBatchSize: 100, simulationRunCount: 100};

        jest.useFakeTimers();
        ensembleGenerator.actions.createEnsemble({state, commit, dispatch});
        jest.runAllTimers();

        expect(commit).toHaveBeenNthCalledWith(2, 'CREATE_SIMULATION_PROGRESSION_ARRAYS');

        jest.useRealTimers();
    });

    it('dispatches to run the simulation batch, starting at index 0, when creating an ensemble', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const state = {simulationBatchSize: 100, simulationRunCount: 100};

        jest.useFakeTimers();
        ensembleGenerator.actions.createEnsemble({state, commit, dispatch});
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

        ensembleGenerator.actions.captureSimulationInputs({commit, rootGetters});
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
            await expect(ensembleGenerator.actions.runSimulationBatch({state, commit, dispatch})).rejects.toThrow(
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
                state: {simulationBatchSize: 3, simulationRunCount: 6},
                input: 0,
                expectedIndexes: {
                    firstSimulatedIndex: 0,
                    lastSimulatedIndex: 2,
                    subsequentSimulationBatchIndex: 3,
                },
            },
            {
                state: {simulationBatchSize: 2, simulationRunCount: 6},
                input: 3,
                expectedIndexes: {
                    firstSimulatedIndex: 3,
                    lastSimulatedIndex: 4,
                    subsequentSimulationBatchIndex: 5,
                },
            },
            {
                state: {simulationBatchSize: 3, simulationRunCount: 6},
                input: 3,
                expectedIndexes: {
                    firstSimulatedIndex: 3,
                    lastSimulatedIndex: 5,
                    subsequentSimulationBatchIndex: null,
                },
            },
            {
                state: {simulationBatchSize: 3, simulationRunCount: 6},
                input: 5,
                expectedIndexes: {
                    firstSimulatedIndex: 5,
                    lastSimulatedIndex: 5,
                    subsequentSimulationBatchIndex: null,
                },
            },
        ];

        let dispatchCallIndex = 1;

        jest.useFakeTimers();
        for (const {state, input, expectedIndexes} of testCases) {
            await ensembleGenerator.actions.runSimulationBatch({state, dispatch}, input);
            for (
                let simulationIndex = expectedIndexes.firstSimulatedIndex;
                simulationIndex <= expectedIndexes.lastSimulatedIndex;
                simulationIndex++
            ) {
                expect(dispatch).toHaveBeenNthCalledWith(dispatchCallIndex, 'runSimulation', simulationIndex);
                dispatchCallIndex++;
            }

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

    it('calls the mutation to populate sorted simulation progress and dispatches to record the loading end when handling post-simulation aspects of the ensemble creation', () => {
        const commit = jest.fn();
        const dispatch = jest.fn();

        ensembleGenerator.actions.handlePostSimulationEnsembleCreation({commit, dispatch});
        expect(commit).toHaveBeenNthCalledWith(1, 'POPULATE_SORTED_SIMULATION_PROGRESSION_ARRAYS');
        expect(dispatch).toHaveBeenNthCalledWith(1, 'loading/recordLoadingEnd', 'createEnsemble', {root: true});
    });

    it('errors if trying to run a simulation and simulation periods is empty or less than 1', async () => {
        const testCaseStates = [
            {},
            {simulationPeriods: null},
            {simulationPeriods: 0},
            {simulationPeriods: -1},
        ];
        for (const state of testCaseStates) {
            await expect(ensembleGenerator.actions.runSimulation({state})).rejects.toThrow(
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

            await ensembleGenerator.actions.runSimulation({state, commit, dispatch}, simulationIndex);

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
            await expect(ensembleGenerator.actions.runDraw({state})).rejects.toThrow(
                'historical data is required in order to draw',
            );
        }
    });

    it('picks a random value from historical data when performing the run draw action', async () => {
        const runCountsFor99Point99PercentConfidenceByDataLength = [1, 1, 14, 23, 33];

        const testCases = [
            {
                historicalData: [2],
            },
            {
                historicalData: [4, 4],
            },
            {
                historicalData: [3, 4],
            },
            {
                historicalData: [3, 0, 1, 4],
            },
        ];

        for (const {historicalData} of testCases) {
            const state = {historicalData};

            const results = new Set();
            const runCount = runCountsFor99Point99PercentConfidenceByDataLength[historicalData.length];

            for (let i = 0; i < runCount; i++) {
                const result = await ensembleGenerator.actions.runDraw({state});
                results.add(result);
            }

            historicalData.forEach(value => {
                expect(results.has(value)).toBe(true);
            });
        }
    });

    it('returns a conservative figure for the progression at a specific period, at a specific percentile, and returns null if no value is found', () => {

        [
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
        ].forEach(
            ({periodIndex, percentileFloat, sortedSimulationProgressionByPeriod, expected}) => {
                const state = {sortedSimulationProgressionByPeriod};
                const result = ensembleGenerator.getters
                    .getConservativelyPercentiledProgressionAtPeriod(state)(periodIndex, percentileFloat);
                expect(result).toStrictEqual(expected);
            },
        );
    });
});
