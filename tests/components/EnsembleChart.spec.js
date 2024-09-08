import {nextTick} from 'vue';
import {shallowMount} from '@vue/test-utils';
import ApexCharts from 'vue3-apexcharts';
import EnsembleChart from '@/components/EnsembleChart.vue';
import router from '@/router';
import store from '@/store';

describe('EnsembleChart.vue', () => {
    function generateDefaultProps() {
        return {
            title: 'Test Chart',
            optionsData: {
                chart: {id: 'test-chart'},
                xaxis: {categories: ['Period 1', 'Period 2']},
            },
            seriesData: [
                {
                    name: 'Test Series',
                    data: [{x: 1, y: 30}, {x: 2, y: 50}],
                },
            ],
            beforeZoomHandler: jest.fn(),
            type: 'line',
            requiresMilestoneAchievement: false,
            showTooltip: ['small', 'medium'],
        };
    }

    function createWrapper(props = null) {
        const propsData = (props === null) ? generateDefaultProps() : props;

        return shallowMount(EnsembleChart, {
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
    }

    it('sets the correct tooltip-related classes based on showTooltip value', async () => {
        const wrapper = createWrapper();
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
            const ensembleChart = wrapper.find('.ensemble-chart');
            expect(ensembleChart.classes()).toStrictEqual(expect.arrayContaining(expectedClasses));
            expect(ensembleChart.classes()).not.toStrictEqual(expect.arrayContaining(notExpectedClasses));
        }
    });

    it('renders the chart with the correct title', () => {
        const propsData = generateDefaultProps();
        const wrapper = createWrapper(propsData);
        expect(wrapper.find('h3').text()).toBe(propsData.title);
    });

    it('displays chart details and the correct number of simulation periods and milestone', async () => {
        const wrapper = createWrapper();
        store.state.ensembleGenerator.simulationPeriods = 19;
        store.state.ensembleGenerator.milestone = 131;
        store.state.ensembleGenerator.simulationProgressionByPeriod = Array.from(
            { length: 19 }, () => Array.from({ length: 37 }, () => 1)
        );

        await nextTick();
        const details = wrapper.find('details');
        expect(details.exists()).toBe(true);
        expect(details.text()).toContain('19 hypothetical future periods,');
        expect(details.text()).toContain('milestone of 131');
        expect(details.text()).toContain('and repeated over 37 simulation runs');

        store.state.ensembleGenerator.simulationPeriods = 1;
        await nextTick();
        expect(details.text()).not.toContain('19 hypothetical future periods,');
        expect(details.text()).toContain('1 hypothetical future period,');
    });

    it('displays chart and details, dependent on requiresMilestoneAchievement flag and whether milestone is achieved', async () => {
        store.state.ensembleGenerator.simulationPeriods = 1;
        store.state.ensembleGenerator.simulationProgressionByPeriod = [Array(22).fill(50)];
        store.state.ensembleGenerator.sortedSimulationProgressionByPeriod = [Array(22).fill(50)];

        for (const {milestone, requiresMilestoneAchievement, expectedChartVisible} of [
            {
                milestone: 51, // milestone missed
                requiresMilestoneAchievement: false,
                expectedChartVisible: true,
            },
            {
                milestone: 51, // milestone missed
                requiresMilestoneAchievement: true,
                expectedChartVisible: false,
            },
            {
                milestone: 50, // milestone hit
                requiresMilestoneAchievement: false,
                expectedChartVisible: true,
            },
            {
                milestone: 50, // milestone hit
                requiresMilestoneAchievement: true,
                expectedChartVisible: true,
            },
        ]) {
            store.state.ensembleGenerator.milestone = milestone;
            const props = {
                ...generateDefaultProps(),
                requiresMilestoneAchievement: requiresMilestoneAchievement,
            };
            const wrapper = createWrapper(props);
            await nextTick();

            expect(wrapper.find('details').exists()).toBe(expectedChartVisible);
            expect(wrapper.findComponent(ApexCharts).exists()).toBe(expectedChartVisible);
        }
    });

    it('displays the no-relevant-data explanation message when seriesData is valid, but the milestone is not achieved and it is a requirement for the milestone to be achieved', async () => {
        store.state.ensembleGenerator.simulationPeriods = 2;
        store.state.ensembleGenerator.simulationProgressionByPeriod = Array.from(
            { length: 2 }, () => Array.from({ length: 22 }, () => 50)
        );
        store.state.ensembleGenerator.sortedSimulationProgressionByPeriod = Array.from(
            { length: 2 }, () => Array.from({ length: 22 }, () => 50)
        );
        store.state.ensembleGenerator.milestone = 51;
        const props = {
            ...generateDefaultProps(),
            requiresMilestoneAchievement: true,
        };
        const wrapper = createWrapper(props);
        await nextTick();

        const noRelevantDataMessage = wrapper.find('.no-relevant-data-message');
        const routerLink = noRelevantDataMessage.find('a');
        expect(noRelevantDataMessage.exists()).toBe(true);
        expect(noRelevantDataMessage.find('h4').text()).toBe('No relevant data to display');
        expect(noRelevantDataMessage.text()).toContain('cannot be generated because the milestone of 51 was not reached');
        expect(noRelevantDataMessage.text()).toContain('within the specified 2 simulated periods.');
        expect(noRelevantDataMessage.text()).toContain('you might either set a lower milestone or allow more simulated periods');
        expect(noRelevantDataMessage.text()).toContain('please provide the required simulation inputs');
        expect(routerLink.exists()).toBe(true);
        expect(routerLink.text()).toBe('Go to Simulation Inputs');
        expect(routerLink.attributes('href')).toBe(wrapper.vm.$router.getRouteById('simulation-inputs'));

        store.state.ensembleGenerator.simulationPeriods = 1;
        await nextTick();
        expect(noRelevantDataMessage.text()).not.toContain('within the specified 2 simulated periods.');
        expect(noRelevantDataMessage.text()).toContain('within the specified 1 simulated period.');
    });

    it('renders the ApexChart component with the correct props', () => {
        const propsData = generateDefaultProps();
        const wrapper = createWrapper(propsData);
        const apexChart = wrapper.findComponent(ApexCharts);

        expect(apexChart.exists()).toBe(true);
        expect(apexChart.props('type')).toBe(propsData.type);
        expect(apexChart.props('options')).toStrictEqual(propsData.optionsData);
        expect(apexChart.props('series')).toStrictEqual(propsData.seriesData);
    });

    it('triggers the beforeZoomHandler when zooming on the chart', async () => {
        const propsData = generateDefaultProps();
        const wrapper = createWrapper(propsData);

        await wrapper.findComponent(ApexCharts).vm.$emit('beforeZoom');
        expect(propsData.beforeZoomHandler).toHaveBeenCalled();
    });

    it('displays the no-data explanation message when seriesData is empty, or has no data in children, or data in children are not arrays', async () => {
        const wrapper = createWrapper();
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

            expect(wrapper.find('details').exists()).toBe(false);
            const noDataMessage = wrapper.find('.no-data-message');
            expect(noDataMessage.exists()).toBe(true);
            expect(noDataMessage.find('h4').text()).toBe('No data available');
            expect(noDataMessage.text()).toContain('We don\'t have the necessary data to generate this visualization.');
            expect(noDataMessage.text()).toContain('please provide the required simulation inputs');
        }
    });

    it('renders the correct router link in the no-data-message', async () => {
        const wrapper = createWrapper();
        await wrapper.setProps({
            seriesData: [],
        });
        const routerLink = wrapper.find('.no-data-message a');
        expect(routerLink.exists()).toBe(true);
        expect(routerLink.text()).toBe('Go to Simulation Inputs');
        expect(routerLink.attributes('href')).toBe(wrapper.vm.$router.getRouteById('simulation-inputs'));
    });
});
