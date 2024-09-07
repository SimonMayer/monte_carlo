import {nextTick} from 'vue';
import {shallowMount} from '@vue/test-utils';
import SimulationInputsPage from '@/components/SimulationInputsPage.vue';
import router from '@/router';
import store from '@/store';

describe('SimulationInputsPage.vue', () => {
    let wrapper;
    let originalState;

    beforeEach(() => {
        originalState = JSON.parse(JSON.stringify(store.state));
        wrapper = shallowMount(SimulationInputsPage, {
            global: {
                plugins: [
                    router,
                    store,
                ],
            },
        });
    });

    afterEach(() => {
        store.replaceState(originalState);
    });

    it('renders the milestone input with the correct store value', async () => {
        store.state.simulationInputs.milestone = 7865;

        const input = wrapper.find('#milestone');
        expect(input.exists()).toBe(true);

        await nextTick();
        expect(input.element.value).toBe('7865');
    });

    it('renders the simulation periods input with the correct store value', async () => {
        store.state.simulationInputs.simulationPeriods = 329;

        const input = wrapper.find('#simulationPeriods');
        expect(input.exists()).toBe(true);

        await nextTick();
        expect(input.element.value).toBe('329');
    });

    it('renders radio buttons for historical data input method and sets the correct store value', async () => {
        const bulkRadioInput = wrapper.find('input[type="radio"][value="bulk"]');
        const manualRadioInput = wrapper.find('input[type="radio"][value="manual"]');

        expect(bulkRadioInput.exists()).toBe(true);
        expect(manualRadioInput.exists()).toBe(true);

        store.state.simulationInputs.isHistoricalDataInputManually = false;
        await nextTick();
        expect(bulkRadioInput.element.checked).toBe(true);
        expect(manualRadioInput.element.checked).toBe(false);

        store.state.simulationInputs.isHistoricalDataInputManually = true;
        await nextTick();
        expect(bulkRadioInput.element.checked).toBe(false);
        expect(manualRadioInput.element.checked).toBe(true);
    });

    it('renders historical data bulk entry with the correct store value, and displays according to the historical data input method', async () => {
        store.state.simulationInputs.historicalData = [10, 20, 30];

        const bulkEntryTextarea = wrapper.find('#historicalDataBulkEntry');
        expect(bulkEntryTextarea.exists()).toBe(true);

        store.state.simulationInputs.isHistoricalDataInputManually = true;
        await nextTick();
        expect(bulkEntryTextarea.isVisible()).toBe(false);

        store.state.simulationInputs.isHistoricalDataInputManually = false;
        await nextTick();
        expect(bulkEntryTextarea.isVisible()).toBe(true);
        expect(bulkEntryTextarea.element.value).toBe('10, 20, 30');
    });

    it('renders historical record count with the correct store value, and displays according to the historical data input method', async () => {
        store.state.simulationInputs.historicalData = [17, 8, 9, 8, 7, 0, 0, 76, 11, 7, 0];

        const input = wrapper.find('#historicalRecordCount');
        expect(input.exists()).toBe(true);

        store.state.simulationInputs.isHistoricalDataInputManually = false;
        await nextTick();
        expect(input.isVisible()).toBe(false);

        store.state.simulationInputs.isHistoricalDataInputManually = true;
        await nextTick();
        expect(input.isVisible()).toBe(true);
        expect(input.element.value).toBe('11');
    });

    it('renders correct number of historical data input fields, and displays according to the historical data input method', async () => {
        store.state.simulationInputs.historicalData = [97, 8, 9, 8, 7, 0, 0, 1];

        await nextTick();
        const inputs = wrapper.findAll('ol li input[type="number"]');
        expect(inputs.length).toBe(8);

        store.state.simulationInputs.isHistoricalDataInputManually = false;
        await nextTick();
        expect(inputs[0].isVisible()).toBe(false);
        expect(inputs[3].isVisible()).toBe(false);
        expect(inputs[4].isVisible()).toBe(false);

        store.state.simulationInputs.isHistoricalDataInputManually = true;
        await nextTick();
        expect(inputs[0].isVisible()).toBe(true);
        expect(inputs[3].isVisible()).toBe(true);
        expect(inputs[4].isVisible()).toBe(true);
        expect(inputs[0].element.value).toBe('97');
        expect(inputs[1].element.value).toBe('8');
        expect(inputs[7].element.value).toBe('1');
    });

    it('displays the correct historical data values from store', async () => {
        store.state.simulationInputs.historicalData = [10, 20, 30];
        store.state.simulationInputs.isHistoricalDataInputManually = true;

        await nextTick();
        const inputs = wrapper.findAll('ol li input[type="number"]');
        expect(inputs[0].element.value).toBe('10');
        expect(inputs[1].element.value).toBe('20');
        expect(inputs[2].element.value).toBe('30');
    });

    it('updates milestone value on input change', async () => {
        const input = wrapper.find('#milestone');
        await input.setValue('150');
        expect(store.state.simulationInputs.milestone).toBe(150);
    });

    it('updates simulation periods value on input change', async () => {
        const testCases = [
            {input: '24', expected: 24},
            {input: '0', expected: 1},
            {input: '-1', expected: 1},
        ];

        for (const {input, expected} of testCases) {
            await wrapper.find('#simulationPeriods').setValue(input);
            expect(store.state.simulationInputs.simulationPeriods).toBe(expected);
        }
    });

    it('updates historical data input method and shows correct inputs when "Manual Entry" is selected', async () => {
        store.state.simulationInputs.historicalData = [15, 25, 35, 45];
        const manualRadioInput = wrapper.find('input[type="radio"][value="manual"]');
        await manualRadioInput.setChecked();

        expect(store.state.simulationInputs.isHistoricalDataInputManually).toBe(true);

        expect(wrapper.find('#historicalRecordCount').isVisible()).toBe(true);
        expect(wrapper.find('#historicalDataBulkEntry').isVisible()).toBe(false);

        const perPeriodInputs = wrapper.findAll('ol li input[type="number"]');
        expect(perPeriodInputs.length).toBe(4);
        perPeriodInputs.forEach(input => {
            expect(input.isVisible()).toBe(true);
        });
    });

    it('updates historical data input method and shows correct inputs when "Bulk Entry" is selected', async () => {
        store.state.simulationInputs.historicalData = [17, 13];
        const bulkRadioInput = wrapper.find('input[type="radio"][value="bulk"]');
        await bulkRadioInput.setChecked();

        expect(store.state.simulationInputs.isHistoricalDataInputManually).toBe(false);

        expect(wrapper.find('#historicalRecordCount').isVisible()).toBe(false);
        expect(wrapper.find('#historicalDataBulkEntry').isVisible()).toBe(true);

        const perPeriodInputs = wrapper.findAll('ol li input[type="number"]');
        expect(perPeriodInputs.length).toBe(2);
        perPeriodInputs.forEach(input => {
            expect(input.isVisible()).toBe(false);
        });
    });

    it('excludes invalid characters and updates historical data on bulk entry textarea change', async () => {
        const testCases = [
            {input: '24', expected: [24]},
            {input: '', expected: []},
            {input: ',', expected: []},
            {input: '0', expected: [0]},
            {input: '-1', expected: []},
            {input: '1,7,8', expected: [1, 7, 8]},
            {input: 'a3 6 5', expected: [3, 6, 5]},
            {input: '1;4;8', expected: [1, 4, 8]},
            {input: '3           11  5', expected: [3, 11, 5]},
            {input: '24' + '\r' + '22', expected: [24, 22]},
            {input: '1a2,17', expected: [12, 17]},
            {input: '1-3,77', expected: [77]},
            {input: '7.2 2.7', expected: [7, 2]},
        ];

        for (const {input, expected} of testCases) {
            await wrapper.find('#historicalDataBulkEntry').setValue(input);
            expect(store.state.simulationInputs.historicalData).toStrictEqual(expected);
        }
    });

    it('updates historical record count value on input change', async () => {
        store.state.simulationInputs.isHistoricalDataInputManually = true;
        store.state.simulationInputs.historicalData = [];

        const input = wrapper.find('#historicalRecordCount');
        await input.setValue('7');
        expect(store.state.simulationInputs.historicalData.length).toBe(7);
    });

    it('excludes invalid characters, defaults to 0 when empty, removes negative values altogether, and updates historical data in store on historical data input change', async () => {
        store.state.simulationInputs.historicalData = [82, 40, 23];
        store.state.simulationInputs.isHistoricalDataInputManually = true;

        const testCases = [
            {input: '24', expected: 24},
            {input: '', expected: 0},
            {input: ',', expected: 0},
            {input: '0', expected: 0},
            {input: '1,7,8', expected: 0},
            {input: '-1', expected: 23},
            {input: '7.2', expected: 7},
        ];

        await nextTick();
        const inputElement = wrapper.findAll('ol li input[type="number"]').at(1);
        for (const {input, expected} of testCases) {
            await inputElement.setValue(input);
            expect(store.state.simulationInputs.historicalData[1]).toBe(expected);
        }
    });

    it('disables the generateEnsemble button when loading', async () => {
        wrapper.vm.$store.dispatch = jest.fn();

        wrapper.vm.$store.state.loading.loadingFlags = {anything: true};
        wrapper.vm.$store.state.simulationInputs.milestone = 1;
        wrapper.vm.$store.state.simulationInputs.simulationPeriods = 1;
        wrapper.vm.$store.state.simulationInputs.historicalData = [22, 17];

        await wrapper.vm.$nextTick();

        const button = wrapper.find('button#generateEnsemble');
        expect(button.exists()).toBe(true);
        expect(button.element.disabled).toBe(true);
        await button.trigger('click');
        expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled();
    });

    it('enables the generateEnsemble button when not loading', async () => {
        store.state.loading.loadingFlags = {};

        await nextTick();

        const button = wrapper.find('button#generateEnsemble');
        expect(button.exists()).toBe(true);
        expect(button.element.disabled).toBe(false);
    });

    it('dispatches the generateEnsemble action on button click if valid data is provided', async () => {
        wrapper.vm.$store.dispatch = jest.fn();
        wrapper.vm.$store.state.simulationInputs.milestone = 1;
        wrapper.vm.$store.state.simulationInputs.simulationPeriods = 1;
        wrapper.vm.$store.state.simulationInputs.historicalData = [22, 17];

        const button = wrapper.find('button#generateEnsemble');
        expect(button.exists()).toBe(true);

        await button.trigger('click');
        expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('ensembleGenerator/generateEnsemble');
    });

    it('shows errors and does not dispatch generateEnsemble action if required inputs are missing or invalid', async () => {
        wrapper.vm.$store.dispatch = jest.fn();

        const testCases = [
            {state: {simulationInputs: {}}, errors: ['milestone', 'simulationPeriods', 'historicalData']},
            {state: {simulationInputs: {milestone: 20, historicalData: [22, 17]}}, errors: ['simulationPeriods']},
            {
                state: {simulationInputs: {milestone: 20, simulationPeriods: '', historicalData: [22, 17]}},
                errors: ['simulationPeriods'],
            },
            {
                state: {simulationInputs: {milestone: 1, simulationPeriods: 0, historicalData: [22, 17]}},
                errors: ['simulationPeriods'],
            },
            {
                state: {simulationInputs: {milestone: 1, simulationPeriods: -1, historicalData: [22, 17]}},
                errors: ['simulationPeriods'],
            },
            {state: {simulationInputs: {simulationPeriods: 10, historicalData: [22, 17]}}, errors: ['milestone']},
            {
                state: {simulationInputs: {milestone: '', simulationPeriods: 10, historicalData: [22, 17]}},
                errors: ['milestone'],
            },
            {
                state: {simulationInputs: {milestone: 0, simulationPeriods: 10, historicalData: [22, 17]}},
                errors: ['milestone'],
            },
            {
                state: {simulationInputs: {milestone: -1, simulationPeriods: 10, historicalData: [22, 17]}},
                errors: ['milestone'],
            },
            {
                state: {simulationInputs: {milestone: 1, simulationPeriods: 1, historicalData: []}},
                errors: ['historicalDataLength'],
            },
            {
                state: {simulationInputs: {milestone: 1, simulationPeriods: 1, historicalData: [22]}},
                errors: ['historicalDataLength'],
            },
            {
                state: {simulationInputs: {milestone: 1, simulationPeriods: 1, historicalData: [-4, 22]}},
                errors: ['historicalDataNonNegative'],
            },
            {
                state: {simulationInputs: {milestone: 1, simulationPeriods: 1, historicalData: [-4]}},
                errors: ['historicalDataLength', 'historicalDataNonNegative'],
            },
        ];

        for (const {state, errors} of testCases) {
            for (const [key, value] of Object.entries(state)) {
                store.state[key] = value;
            }

            const button = wrapper.find('button#generateEnsemble');
            await button.trigger('click');

            expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled();
            const errorList = wrapper.findAll('ul.error li');
            expect(errorList.length).toBe(errors.length);
            for (const [index, error] of errors.entries()) {
                if (error === 'milestone') {
                    expect(errorList.at(index).text()).toBe('Milestone must be a positive integer.');
                }
                if (error === 'simulationPeriods') {
                    expect(errorList.at(index).text()).toBe('Simulation periods must be a positive integer.');
                }
                if (error === 'historicalDataLength') {
                    expect(errorList.at(index).text()).toBe('You must provide data for at least two historical periods.');
                }
                if (error === 'historicalDataNonNegative') {
                    expect(errorList.at(index).text()).toBe('Historical units completed per period may not be negative.');
                }
            }
        }
    });
});
