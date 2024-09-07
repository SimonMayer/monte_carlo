import {shallowMount} from '@vue/test-utils';
import {apexChartMixin} from '@/mixins/apexChartMixin';

describe('apexChartMixin', () => {
    let wrapper;

    const TestComponent = {
        mixins: [apexChartMixin],
        template: '<div></div>',
    };

    beforeEach(() => {
        wrapper = shallowMount(TestComponent, {
            data() {
                return {
                    series: [],
                };
            },
        });
    });

    describe('data properties', () => {
        it('defaults chartId as null', () => {
            expect(apexChartMixin.data().chartId).toStrictEqual(null);
        });

        it('defaults seriesData as an empty array', () => {
            expect(apexChartMixin.data().seriesData).toStrictEqual([]);
        });

        it('defaults optionsData as an empty object', () => {
            expect(apexChartMixin.data().optionsData).toStrictEqual({});
        });

        it('defaults chartForeColor as #2C3E50', () => {
            expect(apexChartMixin.data().chartForeColor).toStrictEqual('#2C3E50');
        });

        it('defaults chartColors as a specific array of hex values', () => {
            expect(apexChartMixin.data().chartColors).toStrictEqual([
                '#1F618D',
                '#C0392B',
                '#239B56',
                '#E67E22',
                '#1ABC9C',
                '#9B59B6',
                '#D4AC0D',
                '#8B4513',
                '#800020',
                '#E91E63',
            ]);
        });

        it('defaults xIdealTickAmountExcludingEnd as integer 5', () => {
            expect(apexChartMixin.data().xIdealTickAmountExcludingEnd).toStrictEqual(5);
        });

        it('defaults yIdealTickAmountIncludingEnd as integer 6', () => {
            expect(apexChartMixin.data().yIdealTickAmountIncludingEnd).toStrictEqual(6);
        });

        it('defaults dashArray as integer 0', () => {
            expect(apexChartMixin.data().dashArray).toStrictEqual(0);
        });

        it('defaults xAxisDecimalsInFloat as integer 0', () => {
            expect(apexChartMixin.data().xAxisDecimalsInFloat).toStrictEqual(0);
        });

        it('defaults xAxisTitle as empty string', () => {
            expect(apexChartMixin.data().xAxisTitle).toStrictEqual('');
        });

        it('defaults yAxisTitle as empty string', () => {
            expect(apexChartMixin.data().yAxisTitle).toStrictEqual('');
        });
    });

    describe('computed properties', () => {
        it('computes xLowestValueInData correctly', () => {
            for (const {series, expected} of [
                {
                    series: [{data: [{x: 16, y: 5}, {x: 14, y: 30}]}],
                    expected: 14,
                },
                {
                    series: [
                        {data: [{x: 1, y: 10}, {x: 3, y: 20}]},
                        {data: [{x: 2, y: 5}, {x: 4, y: 30}]},
                    ],
                    expected: 1,
                },
            ]) {
                wrapper.vm.series = series;
                expect(wrapper.vm.xLowestValueInData).toBe(expected);
            }
        });

        it('computes xHighestValueInData correctly', () => {
            for (const {series, expected} of [
                {
                    series: [{data: [{x: 16, y: 5}, {x: 14, y: 30}]}],
                    expected: 16,
                },
                {
                    series: [
                        {data: [{x: 1, y: 10}, {x: 3, y: 20}]},
                        {data: [{x: 2, y: 5}, {x: 4, y: 30}]},
                    ],
                    expected: 4,
                },
            ]) {
                wrapper.vm.series = series;
                expect(wrapper.vm.xHighestValueInData).toBe(expected);
            }
        });

        it('computes yHighestValueInData correctly', () => {
            for (const {series, expected} of [
                {
                    series: [{data: [{x: 16, y: 5}, {x: 14, y: 34}]}],
                    expected: 34,
                },
                {
                    series: [
                        {data: [{x: 1, y: 110}, {x: 3, y: 20}]},
                        {data: [{x: 2, y: 5}, {x: 4, y: 30}]},
                    ],
                    expected: 110,
                },
            ]) {
                wrapper.vm.series = series;
                expect(wrapper.vm.yHighestValueInData).toBe(expected);
            }
        });

        it('computes chartOptions correctly based on default and provided values', () => {
            wrapper.vm.chartId = 'theChartId';

            expect(wrapper.vm.chartOptions).toStrictEqual({
                id: wrapper.vm.chartId,
                toolbar: wrapper.vm.chartToolbarOptions,
                foreColor: apexChartMixin.data().chartForeColor,
                height: '100%',
                zoom: wrapper.vm.chartZoomOptions,
            });
        });

        it('computes chartToolbarOptions correctly based on default values', () => {
            expect(wrapper.vm.chartToolbarOptions).toStrictEqual({
                show: true,
                tools: {
                    reset: '<img src="/icons/reset.svg" width="20">',
                },
            });
        });

        it('computes chartZoomOptions correctly based on default values', () => {
            expect(wrapper.vm.chartZoomOptions).toStrictEqual({type: 'x'});
        });

        it('computes dataLabelsOptions correctly based on default values', () => {
            expect(wrapper.vm.dataLabelsOptions).toStrictEqual({enabled: false});
        });

        it('computes strokeOptions correctly based on default and provided values', () => {
            expect(wrapper.vm.strokeOptions).toStrictEqual({
                curve: 'monotoneCubic',
                width: 2,
                dashArray: apexChartMixin.data().dashArray,
            });

            wrapper.vm.dashArray = 3;
            expect(wrapper.vm.strokeOptions.dashArray).toStrictEqual(3);
        });

        it('computes responsiveOptions as an empty array', () => {
            expect(wrapper.vm.responsiveOptions).toStrictEqual([]);
        });

        it('computes tooltipOptions correctly based on other computed values', () => {
            expect(wrapper.vm.tooltipOptions).toStrictEqual({
                x: wrapper.vm.tooltipXOptions,
                y: wrapper.vm.tooltipYOptions,
            });
        });

        it('tooltipXOptions formatter correctly uses provided xTooltip option', () => {
            for (const {xTooltip, value, expected} of [
                {xTooltip: 'X {value}', value: 478, expected: 'X 478'},
                {xTooltip: '{value}', value: 99, expected: '99'},
                {xTooltip: 'Some string', value: 123, expected: 'Some string'},
            ]) {
                wrapper.setData({xTooltip});
                expect(wrapper.vm.tooltipXOptions.formatter(value)).toStrictEqual(expected);
            }
        });

        it('tooltipYOptions formatter correctly uses yIsPercentage and yTooltipDecimalPlaces', () => {
            for (const {yIsPercentage, yTooltipDecimalPlaces, value, expected} of [
                {value: 478, expected: 478},
                {yIsPercentage: true, value: 43, expected: '43%'},
                {yIsPercentage: true, value: 43.2, expected: '43%'},
                {yIsPercentage: true, value: 43.8, expected: '44%'},
                {yIsPercentage: false, value: 43, expected: 43},
                {yIsPercentage: true, yTooltipDecimalPlaces: 0, value: 27, expected: '27%'},
                {yIsPercentage: true, yTooltipDecimalPlaces: 0, value: 27.2, expected: '27%'},
                {yIsPercentage: true, yTooltipDecimalPlaces: 1, value: 27.2, expected: '27.2%'},
                {yIsPercentage: true, yTooltipDecimalPlaces: 2, value: 27.2, expected: '27.20%'},
                {yIsPercentage: false, yTooltipDecimalPlaces: 2, value: 27.2, expected: 27.2},
                {yTooltipDecimalPlaces: 2, value: 27.2, expected: 27.2},
            ]) {
                wrapper.setData({yIsPercentage: (yIsPercentage !== undefined) ? yIsPercentage : undefined});
                wrapper.setData({
                    yTooltipDecimalPlaces: (yTooltipDecimalPlaces !== undefined) ? yTooltipDecimalPlaces : undefined,
                });
                expect(wrapper.vm.tooltipYOptions.formatter(value)).toStrictEqual(expected);
            }
        });

        it('computes xaxisOptions correctly based on default, provided and calculated values', () => {
            wrapper.vm.series = [
                {data: [{x: 13, y: 10}, {x: 14, y: 13}, {x: 15, y: 13}, {x: 20, y: 19}]},
            ];

            expect(wrapper.vm.xaxisOptions).toStrictEqual({
                type: 'category',
                decimalsInFloat: wrapper.vm.xAxisDecimalsInFloat,
                title: {
                    text: apexChartMixin.data().xAxisTitle,
                },
                min: wrapper.vm.xLowestValueInData,
                max: wrapper.vm.xCalculateMaxAxisFromData(),
                tickAmount: wrapper.vm.xCalculateTickAmountExcludingEnd(),
                tickPlacement: 'on',
            });

            wrapper.vm.xAxisDecimalsInFloat = 4;
            expect(wrapper.vm.xaxisOptions.decimalsInFloat).toStrictEqual(4);
            wrapper.vm.xAxisTitle = 'Some title!';
            expect(wrapper.vm.xaxisOptions.title.text).toStrictEqual('Some title!');
        });

        it('computes yaxisOptions correctly based on default, provided and calculated values', () => {
            wrapper.vm.series = [
                {data: [{x: 13, y: 3}, {x: 14, y: 13}, {x: 15, y: 13}, {x: 20, y: 19}]},
            ];

            expect(wrapper.vm.yaxisOptions).toMatchObject({
                title: {
                    text: apexChartMixin.data().yAxisTitle,
                },
                min: 0,
                max: wrapper.vm.yCalculateMaxAxisFromData(),
                tickAmount: wrapper.vm.yCalculateTickAmountIncludingEnd(),
            });
            expect(wrapper.vm.yaxisOptions.labels.formatter(123.45)).toBe(123);
            expect(wrapper.vm.yaxisOptions.labels.formatter('456')).toBe(456);

            wrapper.vm.yAxisTitle = 'A nice title';
            expect(wrapper.vm.yaxisOptions.title.text).toStrictEqual('A nice title');
        });
    });

    describe('methods', () => {
        it('updates seriesData correctly when updateSeriesData is called', () => {
            wrapper.vm.series = [{name: 'Test Series', data: [10, 20, 30]}];

            wrapper.vm.updateSeriesData();
            expect(wrapper.vm.seriesData).toStrictEqual(wrapper.vm.series);
        });

        it('updates optionsData correctly with computed values when updateOptionsData is called', () => {
            wrapper.vm.updateOptionsData();
            expect(wrapper.vm.optionsData).toStrictEqual({
                chart: wrapper.vm.chartOptions,
                dataLabels: wrapper.vm.dataLabelsOptions,
                stroke: wrapper.vm.strokeOptions,
                colors: wrapper.vm.chartColors,
                responsive: wrapper.vm.responsiveOptions,
                tooltip: wrapper.vm.tooltipOptions,
                xaxis: wrapper.vm.xaxisOptions,
                yaxis: wrapper.vm.yaxisOptions,
            });
        });

        it('calculates neat interval', () => {
            for (const {provisionalInterval, useHigherInterval, expected} of [
                // return exactly as provisional
                {provisionalInterval: 0.0025, useHigherInterval: false, expected: 0.0025},
                {provisionalInterval: 0.5, useHigherInterval: false, expected: 0.5},
                {provisionalInterval: 1, useHigherInterval: false, expected: 1},
                {provisionalInterval: 2, useHigherInterval: false, expected: 2},
                {provisionalInterval: 2.5, useHigherInterval: false, expected: 2.5},
                {provisionalInterval: 5, useHigherInterval: false, expected: 5},
                {provisionalInterval: 10, useHigherInterval: false, expected: 10},
                {provisionalInterval: 2500, useHigherInterval: false, expected: 2500},
                // return higher interval despite exact match
                {provisionalInterval: 0.0025, useHigherInterval: true, expected: 0.005},
                {provisionalInterval: 0.5, useHigherInterval: true, expected: 1},
                {provisionalInterval: 1, useHigherInterval: true, expected: 2},
                {provisionalInterval: 200, useHigherInterval: true, expected: 250},
                // return lower interval despite being narrowly below neat interval
                {provisionalInterval: 0.0049, useHigherInterval: false, expected: 0.0025},
            ]) {
                expect(wrapper.vm.calculateNeatInterval(provisionalInterval, useHigherInterval)).toBe(expected);
            }
        });

        it('calculates the axis maximum from data for y axis', () => {
            for (const {yHighestValueInData, yIdealTickAmountIncludingEnd, expected} of [
                {yHighestValueInData: 99, yIdealTickAmountIncludingEnd: 1, expected: 100},
                {yHighestValueInData: 100, yIdealTickAmountIncludingEnd: 1, expected: 200},
                {yHighestValueInData: 100, yIdealTickAmountIncludingEnd: 3, expected: 150},
                {yHighestValueInData: 99, yIdealTickAmountIncludingEnd: 10, expected: 100},
                {yHighestValueInData: 100, yIdealTickAmountIncludingEnd: 10, expected: 120},
                {yHighestValueInData: 7, yIdealTickAmountIncludingEnd: 10, expected: 8},
            ]) {
                wrapper.vm.series = [{data: [{x: 3, y: 0}, {x: 6, y: yHighestValueInData}]}];
                wrapper.vm.yIdealTickAmountIncludingEnd = yIdealTickAmountIncludingEnd;
                expect(wrapper.vm.yCalculateMaxAxisFromData()).toBe(expected);
            }
        });

        it('calculates tick amount including end for y axis', () => {
            for (const {yHighestValueInData, yIdealTickAmountIncludingEnd, expected} of [
                {yHighestValueInData: 99, yIdealTickAmountIncludingEnd: 1, expected: 1},
                {yHighestValueInData: 100, yIdealTickAmountIncludingEnd: 1, expected: 1},
                {yHighestValueInData: 100, yIdealTickAmountIncludingEnd: 3, expected: 3},
                {yHighestValueInData: 99, yIdealTickAmountIncludingEnd: 10, expected: 10},
                {yHighestValueInData: 100, yIdealTickAmountIncludingEnd: 10, expected: 6},
                {yHighestValueInData: 7, yIdealTickAmountIncludingEnd: 10, expected: 8},
            ]) {
                wrapper.vm.series = [{data: [{x: 3, y: 0}, {x: 6, y: yHighestValueInData}]}];
                wrapper.vm.yIdealTickAmountIncludingEnd = yIdealTickAmountIncludingEnd;
                expect(wrapper.vm.yCalculateTickAmountIncludingEnd()).toBe(expected);
            }
        });

        it('calculates tick interval from data for y axis', () => {
            for (const {yHighestValueInData, yIdealTickAmountIncludingEnd, expected} of [
                {yHighestValueInData: 99, yIdealTickAmountIncludingEnd: 1, expected: 100},
                {yHighestValueInData: 100, yIdealTickAmountIncludingEnd: 1, expected: 200},
                {yHighestValueInData: 100, yIdealTickAmountIncludingEnd: 3, expected: 50},
                {yHighestValueInData: 99, yIdealTickAmountIncludingEnd: 10, expected: 10},
                {yHighestValueInData: 100, yIdealTickAmountIncludingEnd: 10, expected: 20},
                {yHighestValueInData: 7, yIdealTickAmountIncludingEnd: 10, expected: 1},
            ]) {
                wrapper.vm.series = [{data: [{x: 3, y: 0}, {x: 6, y: yHighestValueInData}]}];
                wrapper.vm.yIdealTickAmountIncludingEnd = yIdealTickAmountIncludingEnd;
                expect(wrapper.vm.yCalculateTickInterval()).toBe(expected);
            }
        });

        it('calculates the axis maximum from data for x axis', () => {
            for (const {xLowestValueInData, xHighestValueInData, xIdealTickAmountExcludingEnd, expected} of [
                {xLowestValueInData: 0, xHighestValueInData: 100, xIdealTickAmountExcludingEnd: 0, expected: 100},
                {xLowestValueInData: 1000, xHighestValueInData: 1100, xIdealTickAmountExcludingEnd: 0, expected: 1100},
                {xLowestValueInData: 0, xHighestValueInData: 100, xIdealTickAmountExcludingEnd: 2, expected: 102},
                {xLowestValueInData: 75, xHighestValueInData: 175, xIdealTickAmountExcludingEnd: 2, expected: 177},
            ]) {
                wrapper.vm.series = [{data: [{x: xLowestValueInData, y: 5}, {x: xHighestValueInData, y: 30}]}];
                wrapper.vm.xIdealTickAmountExcludingEnd = xIdealTickAmountExcludingEnd;
                expect(wrapper.vm.xCalculateMaxAxisFromData()).toBe(expected);
            }
        });

        it('calculates tick amount excluding end for x axis', () => {
            for (const {xLowestValueInData, xHighestValueInData, xIdealTickAmountExcludingEnd, expected} of [
                {xLowestValueInData: 0, xHighestValueInData: 100, xIdealTickAmountExcludingEnd: 100, expected: 99},
                {xLowestValueInData: 10, xHighestValueInData: 110, xIdealTickAmountExcludingEnd: 100, expected: 99},
                {xLowestValueInData: 0, xHighestValueInData: 101, xIdealTickAmountExcludingEnd: 100, expected: 100},
                {xLowestValueInData: 0, xHighestValueInData: 102, xIdealTickAmountExcludingEnd: 100, expected: 100},
                {xLowestValueInData: 0, xHighestValueInData: 102, xIdealTickAmountExcludingEnd: 3, expected: 3},
            ]) {
                wrapper.vm.series = [{data: [{x: xLowestValueInData, y: 5}, {x: xHighestValueInData, y: 30}]}];
                wrapper.vm.xIdealTickAmountExcludingEnd = xIdealTickAmountExcludingEnd;
                expect(wrapper.vm.xCalculateTickAmountExcludingEnd()).toBe(expected);
            }
        });

        it('calculates tick interval from data for x axis', () => {
            for (const {xLowestValueInData, xHighestValueInData, xIdealTickAmountExcludingEnd, expected} of [
                {xLowestValueInData: 0, xHighestValueInData: 100, xIdealTickAmountExcludingEnd: 0, expected: 100},
                {xLowestValueInData: 0, xHighestValueInData: 100, xIdealTickAmountExcludingEnd: 1, expected: 50},
                {xLowestValueInData: 75, xHighestValueInData: 175, xIdealTickAmountExcludingEnd: 2, expected: 34},
                {xLowestValueInData: 75, xHighestValueInData: 175, xIdealTickAmountExcludingEnd: 99, expected: 1},
                {xLowestValueInData: 75, xHighestValueInData: 175, xIdealTickAmountExcludingEnd: 98, expected: 2},
            ]) {
                wrapper.vm.series = [{data: [{x: xLowestValueInData, y: 5}, {x: xHighestValueInData, y: 30}]}];
                wrapper.vm.xIdealTickAmountExcludingEnd = xIdealTickAmountExcludingEnd;
                expect(wrapper.vm.xCalculateTickIntervalFromData()).toBe(expected);
            }
        });

        it('calculates tick interval for x axis', () => {
            for (const {startValue, endValue, xIdealTickAmountExcludingEnd, expected} of [
                {startValue: 0, endValue: 100, xIdealTickAmountExcludingEnd: 0, expected: 100},
                {startValue: 0, endValue: 100, xIdealTickAmountExcludingEnd: 1, expected: 50},
                {startValue: 0, endValue: 100, xIdealTickAmountExcludingEnd: 9, expected: 10},
                {startValue: 0, endValue: 100, xIdealTickAmountExcludingEnd: 2, expected: 34},
                {startValue: 50, endValue: 150, xIdealTickAmountExcludingEnd: 2, expected: 34},
            ]) {
                wrapper.vm.series = [{data: [{x: 0, y: 5}, {x: 10000, y: 30}]}];
                wrapper.vm.xIdealTickAmountExcludingEnd = xIdealTickAmountExcludingEnd;
                expect(wrapper.vm.xCalculateTickInterval(startValue, endValue)).toBe(expected);
            }
        });

        it('calculates tick interval', () => {
            for (const {startValue, endValue, tickAmountIncludingEnd, expected} of [
                {startValue: 0, endValue: 100, tickAmountIncludingEnd: 1, expected: 100},
                {startValue: 0, endValue: 100, tickAmountIncludingEnd: 10, expected: 10},
                {startValue: 0, endValue: 100, tickAmountIncludingEnd: 3, expected: 34},
                {startValue: 50, endValue: 150, tickAmountIncludingEnd: 3, expected: 34},
                {startValue: 0, endValue: 5, tickAmountIncludingEnd: 100000, expected: 1},
            ]) {
                expect(wrapper.vm.calculateTickInterval(startValue, endValue, tickAmountIncludingEnd)).toBe(expected);
            }
        });

        it('calculates axis from adjustment using x axis data', () => {
            wrapper.vm.series = [{data: [{x: 1374, y: 5}, {x: 4, y: 30}]}];
            wrapper.vm.xIdealTickAmountExcludingEnd = 6;

            expect(wrapper.vm.xCalculateAxisFromAdjustment(15, 391)).toStrictEqual({
                min: 13,
                max: 391,
                tickInterval: 54,
            });
        });

        it('calculates axis from adjustment', () => {
            for (const {
                specifiedMin,
                specifiedMax,
                lowestValueInData,
                highestValueInData,
                tickAmountExcludingEnd,
                expected,
                expectTickIntervalCalculatorCalledWith
            } of [
                {
                    specifiedMin: 1,
                    specifiedMax: 101,
                    lowestValueInData: 1,
                    highestValueInData: 101,
                    tickAmountExcludingEnd: 4,
                    expected: {min: 1, max: 101, tickInterval: 20},
                    expectTickIntervalCalculatorCalledWith: [1, 101],
                },
                {
                    specifiedMin: 64.6, // rounded down to 64 as provisionalMin
                    specifiedMax: 105.4, // capped provisionalMax at 101
                    lowestValueInData: 1,
                    highestValueInData: 101,
                    tickAmountExcludingEnd: 4,
                    expected: {min: 51, max: 101, tickInterval: 10},
                    expectTickIntervalCalculatorCalledWith: [64, 101],
                },
                {
                    specifiedMin: 34.6,
                    specifiedMax: 75.4, // rounded up to 76 as provisionalMax
                    lowestValueInData: 1,
                    highestValueInData: 101,
                    tickAmountExcludingEnd: 4,
                    expected: {min: 26, max: 76, tickInterval: 10},
                    expectTickIntervalCalculatorCalledWith: [34, 76],
                },
                { // higher tick interval pushes minimum closer to lowest value in data
                    specifiedMin: 34.6,
                    specifiedMax: 75.4,
                    lowestValueInData: 1,
                    highestValueInData: 101,
                    tickAmountExcludingEnd: 4,
                    expected: {min: 6, max: 76, tickInterval: 14},
                    expectTickIntervalCalculatorCalledWith: [34, 76],
                },
                { // even higher tick interval pushes minimum to lowest value in data and maximum above highest value
                    specifiedMin: 34.6,
                    specifiedMax: 75.4,
                    lowestValueInData: 1,
                    highestValueInData: 101,
                    tickAmountExcludingEnd: 4,
                    expected: {min: 1, max: 121, tickInterval: 24},
                    expectTickIntervalCalculatorCalledWith: [34, 76],
                },
                { // values that are too low are pushed right to match lowest value in data
                    specifiedMin: -1.4,
                    specifiedMax: 39.4,
                    lowestValueInData: 1,
                    highestValueInData: 101,
                    tickAmountExcludingEnd: 4,
                    expected: {min: 1, max: 51, tickInterval: 10},
                    expectTickIntervalCalculatorCalledWith: [1, 40],
                },
            ]) {
                const tickIntervalCalculator = jest.fn().mockReturnValueOnce(expected.tickInterval);

                expect(wrapper.vm.calculateAxisFromAdjustment(
                    specifiedMin,
                    specifiedMax,
                    lowestValueInData,
                    highestValueInData,
                    tickIntervalCalculator,
                    tickAmountExcludingEnd,
                )).toStrictEqual(expected);

                expect(tickIntervalCalculator).toHaveBeenCalledWith(
                    expectTickIntervalCalculatorCalledWith[0],
                    expectTickIntervalCalculatorCalledWith[1],
                );
            }
        });

        it('calculates axis from adjustment using x axis data and returns the modified xaxis object when handling the beforeZoom event', () => {
            wrapper.vm.series = [{data: [{x: 1374, y: 5}, {x: 4, y: 30}]}];
            wrapper.vm.xIdealTickAmountExcludingEnd = 6;
            const xaxis = {min: 15, max: 391};

            const result = wrapper.vm.handleBeforeZoomEvent(undefined, {xaxis});
            expect(result).toStrictEqual({
                xaxis: {min: 13, max: 391},
            });
            expect(result.xaxis).toBe(xaxis);
        });
    });
});
