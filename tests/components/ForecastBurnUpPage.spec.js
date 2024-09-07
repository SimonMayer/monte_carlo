import {shallowMount} from '@vue/test-utils';
import EnsembleChart from '@/components/EnsembleChart.vue';
import ForecastBurnUpPage from '@/components/ForecastBurnUpPage.vue';
import store from '@/store';

describe('ForecastBurnUpPage.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(ForecastBurnUpPage, {
            global: {
                plugins: [store],
            },
        });
    });

    describe('data properties', () => {
        it('chartId is defined', () => {
            expect(wrapper.vm.chartId).toStrictEqual('forecast-burn-up-chart');
        });

        it('confidence levels are defined', () => {
            expect(wrapper.vm.confidenceLevels).toStrictEqual([0.2, 0.5, 0.8]);
        });

        it('dashArray is defined and is 0 for each confidence level, 5 for the milestone line', () => {
            const dashArray = Array(wrapper.vm.confidenceLevels.length).fill(0);
            dashArray.push(5);
            expect(wrapper.vm.dashArray).toStrictEqual(dashArray);
        });

        it('xTooltip is defined', () => {
            expect(wrapper.vm.xTooltip).toStrictEqual('Before end of period {value}');
        });

        it('xAxisTitle is defined', () => {
            expect(wrapper.vm.xAxisTitle).toStrictEqual('Period');
        });

        it('yAxisTitle is defined', () => {
            expect(wrapper.vm.yAxisTitle).toStrictEqual('Progress');
        });
    });

    it('has the handleBeforeZoomEvent method defined', () => {
        expect(wrapper.vm.handleBeforeZoomEvent).toBeDefined();
    });

    it('renders EnsembleChart component', () => {
        const chart = wrapper.findComponent(EnsembleChart);
        expect(chart.exists()).toBe(true);
    });

    it('passes the correct props to EnsembleChart', async () => {
        const chart = wrapper.findComponent(EnsembleChart);
        expect(chart.props('title')).toBe('Forecast burn-up');
        expect(chart.props('optionsData')).toStrictEqual(wrapper.vm.optionsData);
        expect(chart.props('seriesData')).toStrictEqual(wrapper.vm.seriesData);
        expect(chart.props('beforeZoomHandler')).toBe(wrapper.vm.handleBeforeZoomEvent);
        expect(chart.props('showTooltip')).toStrictEqual(['medium', 'large']);
    });

    it('computes the series data correctly based on store values', async () => {
        store.state.ensembleGenerator.simulationPeriods = 3;
        store.state.ensembleGenerator.milestone = 17;
        store.state.ensembleGenerator.sortedSimulationProgressionByPeriod = [
            [0, 0, 10, 11, 15, 16],
            [5, 15, 25, 30, 33, 34],
            [10, 20, 30, 35, 41, 43],
        ];

        const expectedSeries = [
            {
                name: 'Progress, with 20% confidence',
                data: [{x: 1, y: 11}, {x: 2, y: 30}, {x: 3, y: 35}],
            },
            {
                name: 'Progress, with 50% confidence',
                data: [{x: 1, y: 10}, {x: 2, y: 25}, {x: 3, y: 30}],
            },
            {
                name: 'Progress, with 80% confidence',
                data: [{x: 1, y: 0}, {x: 2, y: 5}, {x: 3, y: 10}],
            },
            {
                name: 'Milestone',
                data: [{x: 1, y: 17}, {x: 2, y: 17}, {x: 3, y: 17}],
                color: wrapper.vm.chartForeColor,
            },
        ];

        expect(wrapper.vm.series).toStrictEqual(expectedSeries);
    });

    it('generates the series data at confidence level correctly, limited by available data for periods, and specified simulation periods', async () => {
        store.state.ensembleGenerator.simulationPeriods = 2;
        store.state.ensembleGenerator.sortedSimulationProgressionByPeriod = [
            [0, 0, 10, 11, 15, 16],
            [5, 15, 25, 30, 33, 34],
            [10, 20, 30, 35, 41, 43],
        ];
        expect(wrapper.vm.generateSeriesDataAtConfidenceLevel(0.35)).toStrictEqual([{x: 1, y: 10}, {x: 2, y: 25}]);

        store.state.ensembleGenerator.simulationPeriods = 8;
        expect(wrapper.vm.generateSeriesDataAtConfidenceLevel(0.65)).toStrictEqual(
            [{x: 1, y: 0}, {x: 2, y: 15}, {x: 3, y: 20}],
        );
    });

    it('generates a horizontal line for the milestone, across each simulation period', async () => {
        store.state.ensembleGenerator.milestone = 1342;
        store.state.ensembleGenerator.simulationPeriods = 6;
        expect(wrapper.vm.generateSeriesDataForMilestoneLine()).toStrictEqual(
            [{x: 1, y: 1342}, {x: 2, y: 1342}, {x: 3, y: 1342}, {x: 4, y: 1342}, {x: 5, y: 1342}, {x: 6, y: 1342}],
        );
    });
});
