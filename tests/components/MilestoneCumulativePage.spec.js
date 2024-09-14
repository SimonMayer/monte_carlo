import { shallowMount } from '@vue/test-utils';
import EnsembleChart from '@/components/EnsembleChart.vue';
import MilestoneCumulativePage from '@/components/MilestoneCumulativePage.vue';
import store from '@/store';

describe('MilestoneCumulativePage.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(MilestoneCumulativePage, {
            global: {
                plugins: [store],
            },
        });
    });

    describe('data properties', () => {
        it('chartId is defined', () => {
            expect(wrapper.vm.chartId).toBe('milestone-cumulative-chart');
        });

        it('xTooltip is defined', () => {
            expect(wrapper.vm.xTooltip).toBe('Before end of period {value}');
        });

        it('xAxisTitle is defined', () => {
            expect(wrapper.vm.xAxisTitle).toBe('Period');
        });

        it('yAxisTitle is defined', () => {
            expect(wrapper.vm.yAxisTitle).toBe('Likelihood (%)');
        });

        it('yIsPercentage is defined', () => {
            expect(wrapper.vm.yIsPercentage).toBe(true);
        });

        it('yTooltipDecimalPlaces is defined', () => {
            expect(wrapper.vm.yTooltipDecimalPlaces).toBe(2);
        });
    });

    it('renders EnsembleChart component', () => {
        const chart = wrapper.findComponent(EnsembleChart);
        expect(chart.exists()).toBe(true);
    });

    it('passes the correct props to EnsembleChart', async () => {
        const chart = wrapper.findComponent(EnsembleChart);
        expect(chart.props('title')).toBe('Cumulative milestone achievement');
        expect(chart.props('optionsData')).toStrictEqual(wrapper.vm.optionsData);
        expect(chart.props('seriesData')).toStrictEqual(wrapper.vm.seriesData);
        expect(chart.props('requiresMilestoneAchievement')).toStrictEqual(true);
        expect(chart.props('showTooltip')).toStrictEqual(['medium', 'large']);
        expect(chart.props('type')).toStrictEqual('area');
    });

    it('computes the series data correctly based on store values', async () => {
        store.state.ensembleGenerator.simulationPeriods = 3;
        store.state.ensembleGenerator.milestone = 17;
        store.state.ensembleGenerator.sortedSimulationProgressionByPeriod = [
            [0, 0, 10, 11, 15, 16, 16, 21, 23, 28],
            [5, 15, 17, 30, 33, 34, 35, 37, 37, 40],
            [8, 16, 30, 35, 41, 43, 45, 51, 61, 63],
            [10, 18, 33, 38, 45, 49, 51, 59, 63, 66],
        ];

        const expectedSeries = [
            {
                name: 'Cumulative likelihood of achieving milestone',
                data: [
                    { x: 1, y: 30 },
                    { x: 2, y: 80 },
                    { x: 3, y: 80 },
                ],
            },
        ];

        expect(wrapper.vm.series).toStrictEqual(expectedSeries);
    });

    it('computes the series data with a point at 0,0 if there is only one simulation period', async () => {
        store.state.ensembleGenerator.simulationPeriods = 1;
        store.state.ensembleGenerator.milestone = 17;
        store.state.ensembleGenerator.sortedSimulationProgressionByPeriod = [
            [0, 0, 10, 11, 15, 16, 16, 21, 23, 28],
        ];

        const expectedSeries = [
            {
                name: 'Cumulative likelihood of achieving milestone',
                data: [
                    { x: 0, y: 0 },
                    { x: 1, y: 30 },
                ],
            },
        ];

        expect(wrapper.vm.series).toStrictEqual(expectedSeries);
    });
});
