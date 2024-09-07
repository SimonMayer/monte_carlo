import {nextTick} from 'vue';
import {shallowMount} from '@vue/test-utils';
import ApexCharts from 'vue3-apexcharts';
import EnsembleChart from '@/components/EnsembleChart.vue';
import router from '@/router';
import store from '@/store';

describe('EnsembleChart.vue', () => {
    let wrapper;

    const propsData = {
        title: 'Test Chart',
        optionsData: {
            chart: {id: 'test-chart'},
            xaxis: {categories: ['Period 1', 'Period 2']},
        },
        seriesData: [
            {
                name: 'Test Series',
                data: [30, 50],
            },
        ],
        beforeZoomHandler: jest.fn(),
        type: 'line',
        showTooltip: ['small', 'medium'],
    };

    beforeEach(() => {
        wrapper = shallowMount(EnsembleChart, {
            global: {
                plugins: [router, store],
                stubs: {
                    'router-link': {
                        props: ['to'],
                        template: '<a :href="to"><slot /></a>',
                    },
                },
            },
            propsData,
        });
    });

    it('sets the correct tooltip-related classes based on showTooltip value', async () => {
        for (const {showTooltip, expectedClasses, notExpectedClasses} of [
            {
                showTooltip: [],
                expectedClasses: ['hide-tooltip-small', 'hide-tooltip-medium', 'hide-tooltip-large'],
                notExpectedClasses: ['show-tooltip-small', 'show-tooltip-medium', 'show-tooltip-large'],
            },
            {
                showTooltip: ['small', 'large', 'medium'],
                expectedClasses: ['show-tooltip-small', 'show-tooltip-medium', 'show-tooltip-large'],
                notExpectedClasses: ['hide-tooltip-small', 'hide-tooltip-medium', 'hide-tooltip-large'],
            },
            {
                showTooltip: ['small'],
                expectedClasses: ['show-tooltip-small', 'hide-tooltip-medium', 'hide-tooltip-large'],
                notExpectedClasses: ['hide-tooltip-small', 'show-tooltip-medium', 'show-tooltip-large'],
            },
            {
                showTooltip: ['small', 'medium'],
                expectedClasses: ['show-tooltip-small', 'show-tooltip-medium', 'hide-tooltip-large'],
                notExpectedClasses: ['hide-tooltip-small', 'hide-tooltip-medium', 'show-tooltip-large'],
            },
            {
                showTooltip: ['large'],
                expectedClasses: ['hide-tooltip-small', 'hide-tooltip-medium', 'show-tooltip-large'],
                notExpectedClasses: ['show-tooltip-small', 'show-tooltip-medium', 'hide-tooltip-large'],
            },
        ]) {
            await wrapper.setProps({showTooltip});
            expect(wrapper.find('.ensemble-chart').classes()).toStrictEqual(expect.arrayContaining(expectedClasses));
            expect(wrapper.find('.ensemble-chart').classes()).not.toStrictEqual(expect.arrayContaining(notExpectedClasses));
        }
    });

    it('renders the chart with the correct title', () => {
        expect(wrapper.find('h3').text()).toBe(propsData.title);
    });

    it('displays chart details and the correct number of simulation periods and milestone', async () => {
        store.state.ensembleGenerator.simulationPeriods = 19;
        store.state.ensembleGenerator.milestone = 131;
        store.state.ensembleGenerator.simulationProgressionByPeriod = [Array(22).fill(1)];

        await nextTick();
        const details = wrapper.find('details');
        expect(details.exists()).toBe(true);
        expect(details.text()).toContain('19 hypothetical future periods');
        expect(details.text()).toContain('milestone of 131');
        expect(details.text()).toContain('and repeated over 22 simulation runs');
    });

    it('renders the ApexChart component with the correct props', () => {
        const apexChart = wrapper.findComponent(ApexCharts);
        expect(apexChart.exists()).toBe(true);
        expect(apexChart.props('type')).toBe(propsData.type);
        expect(apexChart.props('options')).toStrictEqual(propsData.optionsData);
        expect(apexChart.props('series')).toStrictEqual(propsData.seriesData);
    });

    it('triggers the beforeZoomHandler when zooming on the chart', async () => {
        const apexChart = wrapper.findComponent(ApexCharts);
        await apexChart.vm.$emit('beforeZoom');
        expect(propsData.beforeZoomHandler).toHaveBeenCalled();
    });

    it('displays the no-data explanation message when seriesData is empty, or has no data in children, or data in children are not arrays', async () => {
        for (const seriesData of [
            [],
            [1, 14],
            [{data: []}, {data: []}],
            [{data: 1}, {data: 3}],
        ]) {
            await wrapper.setProps({
                seriesData: seriesData,
            });

            await nextTick();

            const noDataMessage = wrapper.find('.no-data-message');
            expect(noDataMessage.exists()).toBe(true);
            expect(noDataMessage.find('h4').text()).toBe('No data available');
            expect(noDataMessage.text()).toContain('We don\'t have the necessary data to generate this visualization.');
            expect(noDataMessage.text()).toContain('please provide the required simulation inputs');
        }
    });

    it('renders the correct router link in the no-data-message', async () => {
        await wrapper.setProps({
            seriesData: [],
        });
        const routerLink = wrapper.find('.no-data-message a');
        expect(routerLink.exists()).toBe(true);
        expect(routerLink.text()).toBe('Go to Simulation Inputs');
        expect(routerLink.attributes('href')).toBe(wrapper.vm.$router.getRouteById('simulation-inputs'));
    });
});
