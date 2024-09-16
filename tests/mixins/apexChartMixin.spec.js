import {shallowMount} from '@vue/test-utils';
import {apexChartMixin} from '@/mixins/apexChartMixin';

describe('apexChartMixin', () => {
    const TestComponent = {
        mixins: [apexChartMixin],
        template: '<div></div>',
    };

    function createWrapper() {
        return shallowMount(
            TestComponent,
            {
                data() {
                    return {
                        series: [],
                    };
                },
            },
        );
    }

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

        it('defaults dashArray as integer 0', () => {
            expect(apexChartMixin.data().dashArray).toStrictEqual(0);
        });

        it('defaults xAxisDecimalsInFloat as integer 0', () => {
            expect(apexChartMixin.data().xAxisDecimalsInFloat).toStrictEqual(0);
        });

        it('defaults xAxisTitle as empty string', () => {
            expect(apexChartMixin.data().xAxisTitle).toStrictEqual('');
        });

        it('defaults xMax as null', () => {
            expect(apexChartMixin.data().xMax).toStrictEqual(null);
        });

        it('defaults xMaximumTickQuantity as integer 6', () => {
            expect(apexChartMixin.data().xMaximumTickQuantity).toStrictEqual(6);
        });

        it('defaults xMin as null', () => {
            expect(apexChartMixin.data().xMin).toStrictEqual(null);
        });

        it('defaults xMinimumTickInterval as integer 1', () => {
            expect(apexChartMixin.data().xMinimumTickInterval).toStrictEqual(1);
        });

        it('defaults xTickAmount as null', () => {
            expect(apexChartMixin.data().xTickAmount).toStrictEqual(null);
        });

        it('defaults xTickInterval as null', () => {
            expect(apexChartMixin.data().xTickInterval).toStrictEqual(null);
        });

        it('defaults yAxisTitle as empty string', () => {
            expect(apexChartMixin.data().yAxisTitle).toStrictEqual('');
        });

        it('defaults yMax as null', () => {
            expect(apexChartMixin.data().yMax).toStrictEqual(null);
        });

        it('defaults yMaximumTickQuantity as integer 6', () => {
            expect(apexChartMixin.data().yMaximumTickQuantity).toStrictEqual(6);
        });

        it('defaults yMin as null', () => {
            expect(apexChartMixin.data().yMin).toStrictEqual(null);
        });

        it('defaults yMinimumTickInterval as integer 1', () => {
            expect(apexChartMixin.data().yMinimumTickInterval).toStrictEqual(1);
        });

        it('defaults yTickAmount as null', () => {
            expect(apexChartMixin.data().yTickAmount).toStrictEqual(null);
        });

        it('defaults yTickInterval as null', () => {
            expect(apexChartMixin.data().yTickInterval).toStrictEqual(null);
        });

        it('defaults zoomLevel as integer 0', () => {
            expect(apexChartMixin.data().zoomLevel).toStrictEqual(0);
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
                const wrapper = createWrapper();
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
                const wrapper = createWrapper();
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
                const wrapper = createWrapper();
                wrapper.vm.series = series;
                expect(wrapper.vm.yHighestValueInData).toBe(expected);
            }
        });

        it('computes chartOptions correctly based on default and provided values', () => {
            const wrapper = createWrapper();
            wrapper.vm.chartId = 'theChartId';

            expect(wrapper.vm.chartOptions).toStrictEqual({
                id: wrapper.vm.chartId,
                toolbar: wrapper.vm.chartToolbarOptions,
                foreColor: apexChartMixin.data().chartForeColor,
                height: '100%',
                zoom: wrapper.vm.chartZoomOptions,
            });
        });

        it('computes chartToolbarOptions correctly based on default, provided and calculated values', () => {
            const wrapper = createWrapper();
            wrapper.vm.xAxisTitle = 'the x axis title';

            expect(wrapper.vm.chartToolbarOptions).toStrictEqual({
                show: true,
                tools: {
                    download: '<img src="/icons/download.svg" width="20" height="20" />',
                    reset: false,
                    pan: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    customIcons: wrapper.vm.chartToolbarCustomIconOptions,
                },
                export: {
                    csv: {
                        headerCategory: wrapper.vm.xAxisTitle,
                    },
                },
            });
        });

        it('computes isFullyZoomedOut correctly based on zoom level', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.isFullyZoomedOut).toStrictEqual(true);
            wrapper.vm.zoomLevel = 1;
            expect(wrapper.vm.isFullyZoomedOut).toStrictEqual(false);
            wrapper.vm.zoomLevel = 0;
            expect(wrapper.vm.isFullyZoomedOut).toStrictEqual(true);
        });

        it('computes isZoomViewInEnabled correctly based on tick interval sizes, relative to their minimums', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.isZoomViewInEnabled).toStrictEqual(false);
            wrapper.vm.yTickInterval = 1;
            wrapper.vm.yMinimumTickInterval = 0.5;
            expect(wrapper.vm.isZoomViewInEnabled).toStrictEqual(true);
            wrapper.vm.yMinimumTickInterval = 1;
            expect(wrapper.vm.isZoomViewInEnabled).toStrictEqual(false);
            wrapper.vm.yTickInterval = 2;
            expect(wrapper.vm.isZoomViewInEnabled).toStrictEqual(true);
            wrapper.vm.yTickInterval = 1;
            wrapper.vm.yMinimumTickInterval = 1;
            wrapper.vm.xTickInterval = 1;
            wrapper.vm.xMinimumTickInterval = 1;
            expect(wrapper.vm.isZoomViewInEnabled).toStrictEqual(false);
            wrapper.vm.xMinimumTickInterval = 0.9;
            expect(wrapper.vm.isZoomViewInEnabled).toStrictEqual(true);
        });

        it('computes isZoomViewOutEnabled correctly based on zoom level', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.isZoomViewOutEnabled).toStrictEqual(false);
            wrapper.vm.zoomLevel = 1;
            expect(wrapper.vm.isZoomViewOutEnabled).toStrictEqual(true);
            wrapper.vm.zoomLevel = 0;
            expect(wrapper.vm.isZoomViewOutEnabled).toStrictEqual(false);
        });

        it('computes move view enabled booleans correctly based on zoom level and where the view is set, relative to x data minimum and maximum and y zero and data maximum', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [
                {data: [{x: 7, y: 4}, {x: 38, y: 27}]},
            ];
            wrapper.vm.xMin = 8; // above minimum
            wrapper.vm.xMax = 37; // below maximum
            wrapper.vm.yMin = 1; // above zero
            wrapper.vm.yMax = 27; // identical to maximum
            wrapper.vm.zoomLevel = 0;
            expect(wrapper.vm.isMoveViewLeftEnabled).toStrictEqual(false);
            expect(wrapper.vm.isMoveViewUpEnabled).toStrictEqual(false);
            expect(wrapper.vm.isMoveViewDownEnabled).toStrictEqual(false);
            expect(wrapper.vm.isMoveViewRightEnabled).toStrictEqual(false);
            wrapper.vm.zoomLevel = 1;
            expect(wrapper.vm.isMoveViewLeftEnabled).toStrictEqual(true);
            expect(wrapper.vm.isMoveViewUpEnabled).toStrictEqual(true);
            expect(wrapper.vm.isMoveViewDownEnabled).toStrictEqual(true);
            expect(wrapper.vm.isMoveViewRightEnabled).toStrictEqual(true);
            wrapper.vm.xMin = 7;
            expect(wrapper.vm.isMoveViewLeftEnabled).toStrictEqual(false);
            expect(wrapper.vm.isMoveViewRightEnabled).toStrictEqual(true);
            wrapper.vm.xMin = 8;
            wrapper.vm.xMax = 38;
            expect(wrapper.vm.isMoveViewLeftEnabled).toStrictEqual(true);
            expect(wrapper.vm.isMoveViewRightEnabled).toStrictEqual(false);
            wrapper.vm.yMin = 0;
            expect(wrapper.vm.isMoveViewUpEnabled).toStrictEqual(true);
            expect(wrapper.vm.isMoveViewDownEnabled).toStrictEqual(false);
            wrapper.vm.yMin = 1;
            wrapper.vm.yMax = 28;
            expect(wrapper.vm.isMoveViewUpEnabled).toStrictEqual(false);
            expect(wrapper.vm.isMoveViewDownEnabled).toStrictEqual(true);
        });

        it('computes toolbarIconPathZoomIn correctly based on isZoomViewInEnabled', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.toolbarIconPathZoomIn).toStrictEqual('/icons/zoom-in-disabled.svg');
            wrapper.vm.yTickInterval = 1;
            wrapper.vm.yMinimumTickInterval = 0.5;
            expect(wrapper.vm.toolbarIconPathZoomIn).toStrictEqual('/icons/zoom-in.svg');
        });

        it('computes toolbarIconPathZoomOut correctly based on isZoomViewOutEnabled', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.toolbarIconPathZoomOut).toStrictEqual('/icons/zoom-out-disabled.svg');
            wrapper.vm.zoomLevel = 1;
            expect(wrapper.vm.toolbarIconPathZoomOut).toStrictEqual('/icons/zoom-out.svg');
        });

        it('computes toolbarIconPathMoveLeft correctly based on isMoveViewLeftEnabled', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [
                {data: [{x: 7, y: 4}, {x: 38, y: 27}]},
            ];
            wrapper.vm.xMin = 7;
            wrapper.vm.zoomLevel = 1;
            expect(wrapper.vm.toolbarIconPathMoveLeft).toStrictEqual('/icons/move-left-disabled.svg');
            wrapper.vm.xMin = 8;
            expect(wrapper.vm.toolbarIconPathMoveLeft).toStrictEqual('/icons/move-left.svg');
        });

        it('computes toolbarIconPathMoveUp correctly based on isMoveViewUpEnabled', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [
                {data: [{x: 7, y: 4}, {x: 38, y: 27}]},
            ];
            wrapper.vm.yMax = 28;
            wrapper.vm.zoomLevel = 1;
            expect(wrapper.vm.toolbarIconPathMoveUp).toStrictEqual('/icons/move-up-disabled.svg');
            wrapper.vm.yMax = 27;
            expect(wrapper.vm.toolbarIconPathMoveUp).toStrictEqual('/icons/move-up.svg');
        });

        it('computes toolbarIconPathMoveDown correctly based on isMoveViewDownEnabled', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [
                {data: [{x: 7, y: 4}, {x: 38, y: 27}]},
            ];
            wrapper.vm.yMin = 0;
            wrapper.vm.zoomLevel = 1;
            expect(wrapper.vm.toolbarIconPathMoveDown).toStrictEqual('/icons/move-down-disabled.svg');
            wrapper.vm.yMin = 1;
            expect(wrapper.vm.toolbarIconPathMoveDown).toStrictEqual('/icons/move-down.svg');
        });

        it('computes toolbarIconPathMoveRight correctly based on isMoveViewRightEnabled', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [
                {data: [{x: 7, y: 4}, {x: 38, y: 27}]},
            ];
            wrapper.vm.xMax = 38;
            wrapper.vm.zoomLevel = 1;
            expect(wrapper.vm.toolbarIconPathMoveRight).toStrictEqual('/icons/move-right-disabled.svg');
            wrapper.vm.xMax = 37;
            expect(wrapper.vm.toolbarIconPathMoveRight).toStrictEqual('/icons/move-right.svg');
        });

        it('returns correct strings for reset and divider icon paths', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.toolbarIconPathReset).toStrictEqual('/icons/reset.svg');
            expect(wrapper.vm.toolbarIconPathDivider).toStrictEqual('/icons/divider.svg');
        });

        it('computes chartToolbarCustomIconOptions correctly based on default and calculated values', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [
                {data: [{x: 7, y: 4}, {x: 38, y: 27}]},
            ];
            wrapper.vm.xMin = 10;
            wrapper.vm.xMax = 20;
            wrapper.vm.yMin = 10;
            wrapper.vm.yMax = 20;
            wrapper.vm.zoomLevel = 1;

            const result = wrapper.vm.chartToolbarCustomIconOptions;

            expect(result[0]).toStrictEqual({
                icon: `<img src="${wrapper.vm.toolbarIconPathZoomIn}" width="20" height="20" />`,
                index: -10,
                title: 'zoom in',
                class: 'custom-icon',
                click: wrapper.vm.zoomViewIn,
            });
            expect(result[1]).toStrictEqual({
                icon: `<img src="${wrapper.vm.toolbarIconPathZoomOut}" width="20" height="20" />`,
                index: -9,
                title: 'zoom out',
                class: 'custom-icon',
                click: wrapper.vm.zoomViewOut,
            });

            expect(result[2]['icon']).toStrictEqual(`<img src="${wrapper.vm.toolbarIconPathDivider}" width="2" height="20" />`);
            expect(result[2]['index']).toStrictEqual(-8);
            expect(result[2]['title']).toStrictEqual('');
            expect(result[2]['class']).toStrictEqual('divider');
            // not practical to test that divider has anonymous function that does nothing

            expect(result[3]).toStrictEqual({
                icon: `<img src="${wrapper.vm.toolbarIconPathMoveLeft}" width="20" height="20" />`,
                index: -7,
                title: 'move left',
                class: 'custom-icon',
                click: wrapper.vm.moveViewLeft,
            });
            expect(result[4]).toStrictEqual({
                icon: `<img src="${wrapper.vm.toolbarIconPathMoveUp}" width="20" height="20" />`,
                index: -6,
                title: 'move up',
                class: 'custom-icon',
                click: wrapper.vm.moveViewUp,
            });
            expect(result[5]).toStrictEqual({
                icon: `<img src="${wrapper.vm.toolbarIconPathMoveDown}" width="20" height="20" />`,
                index: -5,
                title: 'move down',
                class: 'custom-icon',
                click: wrapper.vm.moveViewDown,
            });
            expect(result[6]).toStrictEqual({
                icon: `<img src="${wrapper.vm.toolbarIconPathMoveRight}" width="20" height="20" />`,
                index: -4,
                title: 'move right',
                class: 'custom-icon',
                click: wrapper.vm.moveViewRight,
            });

            expect(result[7]['icon']).toStrictEqual(`<img src="${wrapper.vm.toolbarIconPathDivider}" width="2" height="20" />`);
            expect(result[7]['index']).toStrictEqual(-3);
            expect(result[7]['title']).toStrictEqual('');
            expect(result[7]['class']).toStrictEqual('divider');
            // not practical to test that divider has anonymous function that does nothing

            expect(result[8]).toStrictEqual({
                icon: `<img src="${wrapper.vm.toolbarIconPathReset}" width="20" height="20" />`,
                index: -2,
                title: 'reset view',
                class: 'custom-icon',
                click: wrapper.vm.applyDefaultView,
            });

            expect(result[9]['icon']).toStrictEqual(`<img src="${wrapper.vm.toolbarIconPathDivider}" width="2" height="20" />`);
            expect(result[9]['index']).toStrictEqual(-1);
            expect(result[9]['title']).toStrictEqual('');
            expect(result[9]['class']).toStrictEqual('divider');
            // not practical to test that divider has anonymous function that does nothing
        });

        it('computes chartZoomOptions correctly based on default values', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.chartZoomOptions).toStrictEqual({enabled: false});
        });

        it('computes dataLabelsOptions correctly based on default values', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.dataLabelsOptions).toStrictEqual({enabled: false});
        });

        it('computes strokeOptions correctly based on default and provided values', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.strokeOptions).toStrictEqual({
                curve: 'monotoneCubic',
                width: 2,
                dashArray: apexChartMixin.data().dashArray,
            });

            wrapper.vm.dashArray = 3;
            expect(wrapper.vm.strokeOptions.dashArray).toStrictEqual(3);
        });

        it('computes responsiveOptions as an empty array', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.responsiveOptions).toStrictEqual([]);
        });

        it('computes tooltipOptions correctly based on other computed values', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.tooltipOptions).toStrictEqual({
                x: wrapper.vm.tooltipXOptions,
                y: wrapper.vm.tooltipYOptions,
            });
        });

        it('tooltipXOptions formatter correctly uses provided xTooltip option', () => {
            const wrapper = createWrapper();
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
            const wrapper = createWrapper();
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

        it('computes xaxisOptions correctly based on default and provided values', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.xaxisOptions).toMatchObject({
                type: 'category',
                decimalsInFloat: wrapper.vm.xAxisDecimalsInFloat,
                title: {
                    text: apexChartMixin.data().xAxisTitle,
                },
                tickPlacement: 'on',
            });

            wrapper.vm.xAxisDecimalsInFloat = 4;
            expect(wrapper.vm.xaxisOptions.decimalsInFloat).toStrictEqual(4);
            wrapper.vm.xAxisTitle = 'Some title!';
            expect(wrapper.vm.xaxisOptions.title.text).toStrictEqual('Some title!');
        });

        it('computes yaxisOptions correctly based on default and provided values', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.yaxisOptions).toMatchObject({
                title: {
                    text: apexChartMixin.data().yAxisTitle,
                },
            });
            expect(wrapper.vm.yaxisOptions.labels.formatter(123.45)).toBe(123);
            expect(wrapper.vm.yaxisOptions.labels.formatter('456')).toBe(456);

            wrapper.vm.yAxisTitle = 'A nice title';
            expect(wrapper.vm.yaxisOptions.title.text).toStrictEqual('A nice title');
        });
    });

    describe('methods', () => {
        it('updates optionsData by cloning the object in a shallow way', () => {
            const wrapper = createWrapper();
            wrapper.vm.optionsData = {
                chart: {id: 'chart1', type: 'line'},
                stroke: {width: 2},
            };
            const originalOptionsData = wrapper.vm.optionsData;
            const originalStrokeData = wrapper.vm.optionsData.stroke;

            expect(wrapper.vm.optionsData).toBe(originalOptionsData);
            expect(wrapper.vm.optionsData.stroke).toBe(originalStrokeData);

            wrapper.vm.updateOptionsData({});
            expect(wrapper.vm.optionsData).not.toBe(originalOptionsData);
            expect(wrapper.vm.optionsData.stroke).toBe(originalStrokeData);
            expect(wrapper.vm.optionsData).toStrictEqual(originalOptionsData);
        });

        it('adds new properties to optionsData as a clone', () => {
            const wrapper = createWrapper();
            wrapper.vm.optionsData = {
                chart: {id: 'chart1', type: 'line'},
                stroke: {width: 2},
            };
            const newOption = {someKey: 'some value'};

            wrapper.vm.updateOptionsData({newOption});
            expect(wrapper.vm.optionsData).toStrictEqual({
                chart: {id: 'chart1', type: 'line'},
                stroke: {width: 2},
                newOption: newOption,
            });
            expect(wrapper.vm.optionsData.newOption).not.toBe(newOption);
        });

        it('replaces existing properties in optionsData with new values', () => {
            const wrapper = createWrapper();
            wrapper.vm.optionsData = {
                chart: {id: 'chart1', type: 'line'},
                stroke: {width: 2},
            };
            const newStrokeData = {curve: 'monotoneCubic'};

            wrapper.vm.updateOptionsData({stroke: newStrokeData});
            expect(wrapper.vm.optionsData.stroke).toStrictEqual(newStrokeData);
        });

        it('refreshes optionsData with the latest chart options', () => {
            const wrapper = createWrapper();
            const originalChartId = 'theOriginalChartId';
            const subsequentChartId = 'theNewChartId';
            wrapper.vm.chartId = originalChartId;
            wrapper.vm.optionsData = {};

            wrapper.vm.refreshChartOptions();
            expect(wrapper.vm.optionsData.chart).not.toBe(wrapper.vm.chartOptions);
            expect(wrapper.vm.optionsData.chart).toStrictEqual(wrapper.vm.chartOptions);

            wrapper.vm.chartId = subsequentChartId;
            expect(wrapper.vm.optionsData.chart.id).toBe(originalChartId);

            wrapper.vm.refreshChartOptions();
            expect(wrapper.vm.optionsData.chart.id).toBe(subsequentChartId);
        });

        it('updates chart and xaxis optionsData when setting x axis position', () => {
            const wrapper = createWrapper();
            wrapper.vm.chartId = 'theProvidedChartId';
            wrapper.vm.series = [{data: [{x: 3, y: 0}, {x: 6, y: 1}]}];

            expect(wrapper.vm.optionsData.chart.id).not.toBe(wrapper.vm.chartId);
            expect(wrapper.vm.optionsData.xaxis.min).not.toBe(3);
            wrapper.vm.xSetAxisPosition();
            expect(wrapper.vm.optionsData.xaxis.min).toBe(3);
            expect(wrapper.vm.optionsData.chart.id).toBe(wrapper.vm.chartId);
        });

        it('sets min, max and tickAmount values on xaxis optionsData when setting x axis position', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.optionsData.xaxis.min).not.toBe(3);
            expect(wrapper.vm.optionsData.xaxis.max).not.toBe(6);
            expect(wrapper.vm.optionsData.xaxis.tickAmount).not.toBe(17);

            wrapper.vm.xMaximumTickQuantity = 17;
            wrapper.vm.series = [{data: [{x: 3, y: 0}, {x: 6, y: 1}]}];

            wrapper.vm.xSetAxisPosition(); // xMaximumTickQuantity and series data used, if necessary
            expect(wrapper.vm.optionsData.xaxis).toMatchObject({min: 3, max: 6, tickAmount: 17});

            wrapper.vm.xMin = 4;
            wrapper.vm.xMax = 8;
            wrapper.vm.xTickAmount = 2;

            wrapper.vm.xSetAxisPosition(); // xMin, xMax and xTickAmount used if possible
            expect(wrapper.vm.optionsData.xaxis).toMatchObject({min: 4, max: 8, tickAmount: 2});

            // falls back to defaults if values are NaN
            wrapper.vm.xMin = parseInt('this is not a number');
            wrapper.vm.xSetAxisPosition();
            expect(wrapper.vm.optionsData.xaxis).toMatchObject({min: 3, max: 8, tickAmount: 2});
            wrapper.vm.xMax = parseInt('this is not a number');
            wrapper.vm.xSetAxisPosition();
            expect(wrapper.vm.optionsData.xaxis).toMatchObject({min: 3, max: 6, tickAmount: 2});
            wrapper.vm.xTickAmount = parseInt('this is not a number');
            wrapper.vm.xSetAxisPosition();
            expect(wrapper.vm.optionsData.xaxis).toMatchObject({min: 3, max: 6, tickAmount: 17});

            // falls back to defaults if values are not of type number
            wrapper.vm.xMin = '4';
            wrapper.vm.xMax = '5';
            wrapper.vm.xTickAmount = '2';
            wrapper.vm.xSetAxisPosition();
            expect(wrapper.vm.optionsData.xaxis).toMatchObject({min: 3, max: 6, tickAmount: 17});
        });

        it('sets properties related to the x axis, and adjusts the x axis options, according to the calculateAxisViewAdjustment method', () => {
            for (const {
                zoomLevel,
                xLowestValueInData,
                xHighestValueInData,
                xMinimumTickInterval,
                xMaximumTickQuantity,
                xaxisOptions,
            } of [
                {
                    zoomLevel: 0,
                    xLowestValueInData: 3,
                    xHighestValueInData: 55,
                    xMinimumTickInterval: 1,
                    xMaximumTickQuantity: 7,
                    xaxisOptions: {min: 3, max: 55},
                },
                {
                    zoomLevel: 2,
                    xLowestValueInData: 3,
                    xHighestValueInData: 155,
                    xMinimumTickInterval: 2,
                    xMaximumTickQuantity: 8,
                    xaxisOptions: {min: 12, max: 99},
                },
                {
                    zoomLevel: 3,
                    xLowestValueInData: 0,
                    xHighestValueInData: 25,
                    xMinimumTickInterval: 0.01,
                    xMaximumTickQuantity: 17,
                    xaxisOptions: {min: 22, max: 23},
                },
            ]) {
                const wrapper = createWrapper();
                wrapper.vm.zoomLevel = zoomLevel;
                wrapper.vm.series = [{data: [{x: xLowestValueInData, y: 0}, {x: xHighestValueInData, y: 1}]}];
                wrapper.vm.xMinimumTickInterval = xMinimumTickInterval;
                wrapper.vm.xMaximumTickQuantity = xMaximumTickQuantity;
                wrapper.vm.xaxisOptions.min = xaxisOptions.min;
                wrapper.vm.xaxisOptions.max = xaxisOptions.max;

                // test should fail if these assumed values are not calculated and used in an equivalent way
                const assumedApproximateViewCenter = ((xaxisOptions.min + xaxisOptions.max) / 2);
                const assumedApproximateViewSize = (
                    (Math.pow(0.5, zoomLevel)) * (xHighestValueInData - xLowestValueInData)
                );

                // calculatedAdjustment result assumes correct values were passed to calculateAxisViewAdjustment, which is tested separately
                const assumedCalculatedAdjustment = wrapper.vm.calculateAxisViewAdjustment(
                    xLowestValueInData,
                    xHighestValueInData,
                    assumedApproximateViewCenter,
                    assumedApproximateViewSize,
                    xMinimumTickInterval,
                    xMaximumTickQuantity,
                    false,
                );

                const expectedXMin = assumedCalculatedAdjustment.viewStart;
                const expectedXMax = assumedCalculatedAdjustment.viewEnd;
                const expectedXTickAmount = assumedCalculatedAdjustment.tickQuantity - 1;

                wrapper.vm.xAdjustAxis();

                expect(wrapper.vm.xTickInterval).toStrictEqual(assumedCalculatedAdjustment.tickInterval);
                expect(wrapper.vm.xMin).toStrictEqual(expectedXMin);
                expect(wrapper.vm.xMax).toStrictEqual(expectedXMax);
                expect(wrapper.vm.xTickAmount).toStrictEqual(expectedXTickAmount);
                expect(wrapper.vm.optionsData.xaxis)
                    .toMatchObject({min: expectedXMin, max: expectedXMax, tickAmount: expectedXTickAmount});
            }
        });

        it('sets min, max and tickAmount values on yaxis optionsData when setting y axis position', () => {
            const wrapper = createWrapper();
            expect(wrapper.vm.optionsData.yaxis.max).not.toBe(6);
            expect(wrapper.vm.optionsData.yaxis.tickAmount).not.toBe(17);

            wrapper.vm.yMaximumTickQuantity = 17;
            wrapper.vm.series = [{data: [{x: 0, y: 3}, {x: 1, y: 6}]}];

            wrapper.vm.ySetAxisPosition(); // yMaximumTickQuantity, zero, and series data used, if necessary
            expect(wrapper.vm.optionsData.yaxis).toMatchObject({min: 0, max: 6, tickAmount: 17});

            wrapper.vm.yMin = 4;
            wrapper.vm.yMax = 8;
            wrapper.vm.yTickAmount = 2;

            wrapper.vm.ySetAxisPosition(); // yMin, yMax and yTickAmount used if possible
            expect(wrapper.vm.optionsData.yaxis).toMatchObject({min: 4, max: 8, tickAmount: 2});

            // falls back to defaults if values are NaN
            wrapper.vm.yMin = parseInt('this is not a number');
            wrapper.vm.ySetAxisPosition();
            expect(wrapper.vm.optionsData.yaxis).toMatchObject({min: 0, max: 8, tickAmount: 2});
            wrapper.vm.yMax = parseInt('this is not a number');
            wrapper.vm.ySetAxisPosition();
            expect(wrapper.vm.optionsData.yaxis).toMatchObject({min: 0, max: 6, tickAmount: 2});
            wrapper.vm.yTickAmount = parseInt('this is not a number');
            wrapper.vm.ySetAxisPosition();
            expect(wrapper.vm.optionsData.yaxis).toMatchObject({min: 0, max: 6, tickAmount: 17});

            // falls back to defaults if values are not of type number
            wrapper.vm.yMin = '1';
            wrapper.vm.yMax = '5';
            wrapper.vm.yTickAmount = '4';
            wrapper.vm.ySetAxisPosition();
            expect(wrapper.vm.optionsData.yaxis).toMatchObject({min: 0, max: 6, tickAmount: 17});
        });

        it('sets properties related to the y axis, and adjusts the y axis options, according to the calculateAxisViewAdjustment method', () => {
            for (const {
                zoomLevel,
                yLowestValueInData,
                yHighestValueInData,
                yMinimumTickInterval,
                yMaximumTickQuantity,
                yaxisOptions,
            } of [
                {
                    zoomLevel: 0,
                    yLowestValueInData: 3,
                    yHighestValueInData: 55,
                    yMinimumTickInterval: 1,
                    yMaximumTickQuantity: 7,
                    yaxisOptions: {min: 3, max: 55},
                },
                {
                    zoomLevel: 2,
                    yLowestValueInData: 3,
                    yHighestValueInData: 155,
                    yMinimumTickInterval: 2,
                    yMaximumTickQuantity: 8,
                    yaxisOptions: {min: 12, max: 99},
                },
                {
                    zoomLevel: 3,
                    yLowestValueInData: 0,
                    yHighestValueInData: 25,
                    yMinimumTickInterval: 0.01,
                    yMaximumTickQuantity: 17,
                    yaxisOptions: {min: 22, max: 23},
                },
            ]) {
                const wrapper = createWrapper();
                wrapper.vm.zoomLevel = zoomLevel;
                wrapper.vm.series = [{data: [{x: 0, y: yLowestValueInData}, {x: 1, y: yHighestValueInData}]}];
                wrapper.vm.yMinimumTickInterval = yMinimumTickInterval;
                wrapper.vm.yMaximumTickQuantity = yMaximumTickQuantity;
                wrapper.vm.yaxisOptions.min = yaxisOptions.min;
                wrapper.vm.yaxisOptions.max = yaxisOptions.max;

                // test should fail if these assumed values are not calculated and used in an equivalent way
                const assumedApproximateViewCenter = ((yaxisOptions.min + yaxisOptions.max) / 2);
                const assumedApproximateViewSize = ((Math.pow(0.5, zoomLevel)) * yHighestValueInData);

                // calculatedAdjustment result assumes correct values were passed to calculateAxisViewAdjustment, which is tested separately
                const assumedCalculatedAdjustment = wrapper.vm.calculateAxisViewAdjustment(
                    0,
                    yHighestValueInData,
                    assumedApproximateViewCenter,
                    assumedApproximateViewSize,
                    yMinimumTickInterval,
                    yMaximumTickQuantity,
                    true,
                );

                const expectedYMin = assumedCalculatedAdjustment.viewStart;
                const expectedYMax = assumedCalculatedAdjustment.viewEnd;
                const expectedYTickAmount = assumedCalculatedAdjustment.tickQuantity;

                wrapper.vm.yAdjustAxis();

                expect(wrapper.vm.yTickInterval).toStrictEqual(assumedCalculatedAdjustment.tickInterval);
                expect(wrapper.vm.yMin).toStrictEqual(expectedYMin);
                expect(wrapper.vm.yMax).toStrictEqual(expectedYMax);
                expect(wrapper.vm.yTickAmount).toStrictEqual(expectedYTickAmount);
                expect(wrapper.vm.optionsData.yaxis)
                    .toMatchObject({min: expectedYMin, max: expectedYMax, tickAmount: expectedYTickAmount});
            }
        });

        it('does not zoom the view in if isZoomViewInEnabled is false', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: 610, y: 505}]}];
            wrapper.vm.zoomLevel = 0;
            wrapper.vm.xMinimumTickInterval = 5;
            wrapper.vm.xTickInterval = 5;
            wrapper.vm.yMinimumTickInterval = 5;
            wrapper.vm.yTickInterval = 5;
            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.zoomViewIn();
            expect(wrapper.vm.zoomLevel).toStrictEqual(0);
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);
        });

        it('zooms the view in on both axis', () => {
            for (const {originalZoomLevel, xTickInterval, yTickInterval} of [
                {originalZoomLevel: 0, xTickInterval: 50, yTickInterval: 50}, // pass zoom enabled check on x & y
                {originalZoomLevel: 0, xTickInterval: 5, yTickInterval: 50}, // pass zoom enabled check on y
                {originalZoomLevel: 0, xTickInterval: 50, yTickInterval: 5}, // pass zoom enabled check on x
                {originalZoomLevel: 1, xTickInterval: 50, yTickInterval: 5},
                {originalZoomLevel: 2, xTickInterval: 50, yTickInterval: 5},
            ]) {
                const wrapper = createWrapper();
                wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: 610, y: 505}]}];
                wrapper.vm.zoomLevel = originalZoomLevel;
                wrapper.vm.xMinimumTickInterval = 5;
                wrapper.vm.xTickInterval = xTickInterval;
                wrapper.vm.yMinimumTickInterval = 5;
                wrapper.vm.yTickInterval = yTickInterval;
                wrapper.vm.xSetAxisPosition();
                wrapper.vm.ySetAxisPosition();

                const preZoomInXAxisMin = wrapper.vm.xaxisOptions.min;
                const preZoomInXAxisMax = wrapper.vm.xaxisOptions.max;
                const preZoomInYAxisMin = wrapper.vm.yaxisOptions.min;
                const preZoomInYAxisMax = wrapper.vm.yaxisOptions.max;

                wrapper.vm.zoomViewIn();
                expect(wrapper.vm.zoomLevel).toStrictEqual(originalZoomLevel + 1);
                expect(wrapper.vm.xaxisOptions.min).toBeGreaterThan(preZoomInXAxisMin);
                expect(wrapper.vm.xaxisOptions.max).toBeLessThan(preZoomInXAxisMax);
                expect(wrapper.vm.yaxisOptions.min).toBeGreaterThan(preZoomInYAxisMin);
                expect(wrapper.vm.yaxisOptions.max).toBeLessThan(preZoomInYAxisMax);
            }
        });

        it('does not adjust the zoom level or axis options if fully zoomed out', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: 610, y: 505}]}];
            wrapper.vm.zoomLevel = 0;
            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.zoomViewOut();
            expect(wrapper.vm.zoomLevel).toStrictEqual(0);
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);
        });

        it('zooms the view out on both axis', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: 610, y: 505}]}];
            wrapper.vm.zoomLevel = 4;
            wrapper.vm.xMinimumTickInterval = 5;
            wrapper.vm.yMinimumTickInterval = 5;
            wrapper.vm.xSetAxisPosition();
            wrapper.vm.ySetAxisPosition();
            wrapper.vm.xAdjustAxis();
            wrapper.vm.yAdjustAxis();

            const preZoomOutXAxisMin = wrapper.vm.xaxisOptions.min;
            const preZoomOutXAxisMax = wrapper.vm.xaxisOptions.max;
            const preZoomOutYAxisMin = wrapper.vm.yaxisOptions.min;
            const preZoomOutYAxisMax = wrapper.vm.yaxisOptions.max;

            wrapper.vm.zoomViewOut();
            expect(wrapper.vm.zoomLevel).toStrictEqual(3);
            expect(wrapper.vm.xaxisOptions.min).toBeLessThan(preZoomOutXAxisMin);
            expect(wrapper.vm.xaxisOptions.max).toBeGreaterThan(preZoomOutXAxisMax);
            expect(wrapper.vm.yaxisOptions.min).toBeLessThan(preZoomOutYAxisMin);
            expect(wrapper.vm.yaxisOptions.max).toBeGreaterThan(preZoomOutYAxisMax);
            wrapper.vm.zoomViewOut();
            expect(wrapper.vm.zoomLevel).toStrictEqual(2);
        });

        it('move left does not change any axis if already set to the lowest x value, or lower', () => {
            const wrapper = createWrapper();
            const xLowestValueInData = 5;
            wrapper.vm.series = [{data: [{x: xLowestValueInData, y: 3}, {x: 610, y: 505}]}];
            wrapper.vm.zoomLevel = 1;
            wrapper.vm.xMin = xLowestValueInData;

            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.moveViewLeft();
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);

            wrapper.vm.xMin = xLowestValueInData - 1;
            wrapper.vm.moveViewLeft();
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);
        });

        it('move left does not change any axis if fully zoomed out', () => {
            const wrapper = createWrapper();
            const xLowestValueInData = 5;
            wrapper.vm.series = [{data: [{x: xLowestValueInData, y: 3}, {x: 610, y: 505}]}];
            wrapper.vm.zoomLevel = 0;
            wrapper.vm.xMin = xLowestValueInData + 1;

            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.moveViewLeft();
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);
        });

        it('move left shifts min and max to the left on x axis only', () => {
            const wrapper = createWrapper();
            const xLowestValueInData = 5;
            wrapper.vm.series = [{data: [{x: xLowestValueInData, y: 3}, {x: 610, y: 505}]}];
            wrapper.vm.zoomLevel = 1;
            wrapper.vm.xMin = xLowestValueInData + 1;
            wrapper.vm.xSetAxisPosition();
            wrapper.vm.ySetAxisPosition();
            wrapper.vm.xAdjustAxis();
            wrapper.vm.yAdjustAxis();

            const xTickInterval = wrapper.vm.xTickInterval;
            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.moveViewLeft();
            expect(wrapper.vm.xaxisOptions.min).toBeLessThan(originalXAxisOptionsValues.min);
            expect(wrapper.vm.xaxisOptions.min).toStrictEqual(originalXAxisOptionsValues.min - xTickInterval);
            expect(wrapper.vm.xaxisOptions.max).toStrictEqual(originalXAxisOptionsValues.max - xTickInterval);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);
        });

        it('move up does not change any axis if already set above the highest y value', () => {
            const wrapper = createWrapper();
            const yHighestValueInData = 505;
            wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: 610, y: yHighestValueInData}]}];
            wrapper.vm.zoomLevel = 1;
            wrapper.vm.yMax = yHighestValueInData + 1;

            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.moveViewUp();
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);
        });

        it('move up does not change any axis if fully zoomed out', () => {
            const wrapper = createWrapper();
            const yHighestValueInData = 505;
            wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: 610, y: yHighestValueInData}]}];
            wrapper.vm.zoomLevel = 0;
            wrapper.vm.yMax = yHighestValueInData - 1;

            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.moveViewUp();
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);
        });

        it('move up shifts min and max to the top on y axis only when at or below the top', () => {
            for (const {gapToTop} of [
                {gapToTop: 0},
                {gapToTop: 1},
            ]) {
                const wrapper = createWrapper();
                const yHighestValueInData = 505;
                wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: 610, y: yHighestValueInData}]}];
                wrapper.vm.zoomLevel = 1;
                wrapper.vm.yMax = yHighestValueInData - gapToTop;
                wrapper.vm.xSetAxisPosition();
                wrapper.vm.ySetAxisPosition();
                wrapper.vm.xAdjustAxis();
                wrapper.vm.yAdjustAxis();

                const yTickInterval = wrapper.vm.yTickInterval;
                const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
                const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

                wrapper.vm.moveViewUp();
                expect(wrapper.vm.yaxisOptions.min).toBeGreaterThan(originalYAxisOptionsValues.min);
                expect(wrapper.vm.yaxisOptions.min).toStrictEqual(originalYAxisOptionsValues.min + yTickInterval);
                expect(wrapper.vm.yaxisOptions.max).toStrictEqual(originalYAxisOptionsValues.max + yTickInterval);
                expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            }
        });

        it('move down does not change any axis if y minimum already set to 0 or lower', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: 610, y: 505}]}];
            wrapper.vm.zoomLevel = 1;
            wrapper.vm.yMin = 0;

            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.moveViewDown();
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);

            wrapper.vm.yMin = -1;
            wrapper.vm.moveViewDown();
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);
        });

        it('move down does not change any axis if fully zoomed out', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: 610, y: 505}]}];
            wrapper.vm.zoomLevel = 0;
            wrapper.vm.yMin = 1;

            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.moveViewDown();
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);
        });

        it('move down shifts min and max to the bottom on y axis only', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: 610, y: 505}]}];
            wrapper.vm.zoomLevel = 1;
            wrapper.vm.yMin = 1;
            wrapper.vm.xSetAxisPosition();
            wrapper.vm.ySetAxisPosition();
            wrapper.vm.xAdjustAxis();
            wrapper.vm.yAdjustAxis();

            const yTickInterval = wrapper.vm.yTickInterval;
            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.moveViewDown();
            expect(wrapper.vm.yaxisOptions.min).toBeLessThan(originalYAxisOptionsValues.min);
            expect(wrapper.vm.yaxisOptions.min).toStrictEqual(originalYAxisOptionsValues.min - yTickInterval);
            expect(wrapper.vm.yaxisOptions.max).toStrictEqual(originalYAxisOptionsValues.max - yTickInterval);
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
        });

        it('move right does not change any axis if already set to the highest x value, or higher', () => {
            const wrapper = createWrapper();
            const xHighestValueInData = 610;
            wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: xHighestValueInData, y: 505}]}];
            wrapper.vm.zoomLevel = 1;
            wrapper.vm.xMax = xHighestValueInData;

            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.moveViewRight();
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);

            wrapper.vm.xMax = xHighestValueInData + 1;
            wrapper.vm.moveViewRight();
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);
        });

        it('move right does not change any axis if fully zoomed out', () => {
            const wrapper = createWrapper();
            const xHighestValueInData = 610;
            wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: xHighestValueInData, y: 505}]}];
            wrapper.vm.zoomLevel = 0;
            wrapper.vm.xMax = xHighestValueInData - 1;

            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.moveViewRight();
            expect(wrapper.vm.xaxisOptions).toStrictEqual(originalXAxisOptionsValues);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);
        });

        it('move right shifts min and max to the right on x axis only', () => {
            const wrapper = createWrapper();
            const xHighestValueInData = 610;
            wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: xHighestValueInData, y: 505}]}];
            wrapper.vm.zoomLevel = 1;
            wrapper.vm.xMax = xHighestValueInData - 1;
            wrapper.vm.xSetAxisPosition();
            wrapper.vm.ySetAxisPosition();
            wrapper.vm.xAdjustAxis();
            wrapper.vm.yAdjustAxis();

            const xTickInterval = wrapper.vm.xTickInterval;
            const originalXAxisOptionsValues = {...wrapper.vm.xaxisOptions};
            const originalYAxisOptionsValues = {...wrapper.vm.yaxisOptions};

            wrapper.vm.moveViewRight();
            expect(wrapper.vm.xaxisOptions.min).toBeGreaterThan(originalXAxisOptionsValues.min);
            expect(wrapper.vm.xaxisOptions.min).toStrictEqual(originalXAxisOptionsValues.min + xTickInterval);
            expect(wrapper.vm.xaxisOptions.max).toStrictEqual(originalXAxisOptionsValues.max + xTickInterval);
            expect(wrapper.vm.yaxisOptions).toStrictEqual(originalYAxisOptionsValues);
        });

        it('sets the fullest view possible when applyDefaultView is called', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [{data: [{x: 5, y: 3}, {x: 610, y: 705}]}];
            wrapper.vm.zoomLevel = 1;
            wrapper.vm.xaxisOptions.min = 100;
            wrapper.vm.xaxisOptions.max = 500;
            wrapper.vm.yaxisOptions.min = 50;
            wrapper.vm.yaxisOptions.max = 450;

            wrapper.vm.applyDefaultView();
            expect(wrapper.vm.zoomLevel).toStrictEqual(0);
            expect(wrapper.vm.xaxisOptions).toMatchObject({min: 5, max: 611, tickAmount: 5});
            expect(wrapper.vm.yaxisOptions).toMatchObject({min: 0, max: 800, tickAmount: 4});
        });

        it('sets optionsData correctly with computed values', () => {
            const wrapper = createWrapper();
            wrapper.vm.setOptionsData();
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

        it('updates seriesData correctly when updateSeriesData is called', () => {
            const wrapper = createWrapper();
            wrapper.vm.series = [{name: 'Test Series', data: [{x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 1}]}];

            wrapper.vm.updateSeriesData();
            expect(wrapper.vm.seriesData).toStrictEqual(wrapper.vm.series);
        });

        it('sets options data, updates series data, and applies default view upon mounting', () => {
            const providedSeries = [{name: 'Test Series', data: [{x: 5, y: 3}, {x: 610, y: 705}]}];
            const wrapper = shallowMount(
                TestComponent,
                {
                    data() {
                        return {
                            series: providedSeries,
                            zoomLevel: 1,
                        };
                    },
                },
            );
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

            expect(wrapper.vm.seriesData).toStrictEqual(providedSeries);

            expect(wrapper.vm.zoomLevel).toStrictEqual(0);
            expect(wrapper.vm.xaxisOptions).toMatchObject({min: 5, max: 611, tickAmount: 5});
            expect(wrapper.vm.yaxisOptions).toMatchObject({min: 0, max: 800, tickAmount: 4});
        });
    });
});
