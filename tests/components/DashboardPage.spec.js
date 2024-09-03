import {shallowMount} from '@vue/test-utils';
import {nextTick} from 'vue';
import DashboardPage from '@/components/DashboardPage.vue';
import store from '@/store';

describe('DashboardPage.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(DashboardPage, {
            global: {
                plugins: [store],
            },
        });
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

    it('updates historical data input method when "Manual Entry" is selected', async () => {
        const manualRadioInput = wrapper.find('input[type="radio"][value="manual"]');
        await manualRadioInput.setChecked();

        expect(store.state.simulationInputs.isHistoricalDataInputManually).toBe(true);
    });

    it('updates historical data input method when "Bulk Entry" is selected', async () => {
        const bulkRadioInput = wrapper.find('input[type="radio"][value="bulk"]');
        await bulkRadioInput.setChecked();

        expect(store.state.simulationInputs.isHistoricalDataInputManually).toBe(false);
    });

    it('excludes invalid characters and updates historical data on bulk entry textarea change', async () => {
        const testCases = [
            {input: '24', expected: [24]},
            {input: '', expected: []},
            {input: ',', expected: []},
            {input: '0', expected: [0]},
            {input: '-1', expected: [-1]},
            {input: '1,7,8', expected: [1, 7, 8]},
            {input: 'a3 6 5', expected: [3, 6, 5]},
            {input: '1;4;8', expected: [1, 4, 8]},
            {input: '3 11 5', expected: [3, 11, 5]},
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

    it('excludes invalid characters, defaults to 0 when empty, and updates historical data in store on historical data input change', async () => {
        store.state.simulationInputs.historicalData = [82, 40, 23];
        store.state.simulationInputs.isHistoricalDataInputManually = true;

        const testCases = [
            {input: '24', expected: 24},
            {input: '', expected: 0},
            {input: ',', expected: 0},
            {input: '0', expected: 0},
            {input: '-1', expected: -1},
            {input: '1,7,8', expected: 0},
            {input: '7.2', expected: 7},
        ];

        await nextTick();
        const inputElement = wrapper.findAll('ol li input[type="number"]').at(1);
        for (const {input, expected} of testCases) {
            await inputElement.setValue(input);
            expect(store.state.simulationInputs.historicalData[1]).toBe(expected);
        }
    });

    it('dispatches the correct Vuex action on button click', async () => {
        const dispatchMock = jest.fn();
        wrapper.vm.$store.dispatch = dispatchMock;

        const button = wrapper.find('button#createEnsemble');
        expect(button.exists()).toBe(true);

        await button.trigger('click');
        expect(dispatchMock).toHaveBeenCalledWith('ensembleGenerator/createEnsemble', expect.anything());
    });
});
