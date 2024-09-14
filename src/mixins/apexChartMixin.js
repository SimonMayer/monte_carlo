export const apexChartMixin = {
    data() {
        return {
            seriesData: [],
            optionsData: {},
            chartId: null,
            chartForeColor: '#2C3E50',
            chartColors: [
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
            ],
            dashArray: 0,
            xAxisDecimalsInFloat: 0,
            xAxisTitle: '',
            xIdealTickAmountExcludingEnd: 5,
            yAxisTitle: '',
            yIdealTickAmountIncludingEnd: 6,
        };
    },
    computed: {
        xLowestValueInData() {
            return this.series.reduce(
                (xLowestValue, currentObject) => {
                    const xLowestValueInCurrentSeries = currentObject.data.reduce(
                        (xLowestValueInCurrentData, item) => Math.min(xLowestValueInCurrentData, item.x), Infinity,
                    );
                    return Math.min(xLowestValue, xLowestValueInCurrentSeries);
                },
                Infinity,
            );
        },
        xHighestValueInData() {
            return this.series.reduce(
                (xHighestValue, currentObject) => {
                    const xHighestValueInCurrentSeries = currentObject.data.reduce(
                        (xHighestValueInCurrentData, item) => Math.max(xHighestValueInCurrentData, item.x), -Infinity,
                    );
                    return Math.max(xHighestValue, xHighestValueInCurrentSeries);
                },
                -Infinity,
            );
        },
        yHighestValueInData() {
            return this.series.reduce(
                (yHighestValue, currentObject) => {
                    const yHighestValueInCurrentSeries = currentObject.data.reduce(
                        (yHighestValueInCurrentData, item) => Math.max(yHighestValueInCurrentData, item.y), -Infinity,
                    );
                    return Math.max(yHighestValue, yHighestValueInCurrentSeries);
                },
                -Infinity,
            );
        },
        chartOptions() {
            return {
                id: this.chartId,
                toolbar: this.chartToolbarOptions,
                foreColor: this.chartForeColor,
                height: '100%',
                zoom: this.chartZoomOptions,
            };
        },
        chartToolbarOptions() {
            return {
                show: true,
                tools: {
                    reset: false,
                    pan: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                },
            };
        },
        chartZoomOptions() {
            /**
             * disabling native zoom functionality, due to its limitations
             *   y-zoom is limited:
             *     — Toolbar zoom-in and zoom-out buttons don't work with it.
             *     — Using pan resets y-zoom.
             *   toolbar buttons to pan or zoom by dragging selection are disabled in an undocumented way on touch
             *     devices: https://github.com/apexcharts/apexcharts.js/issues/4701
             */
            return {
                enabled: false, //
            };
        },
        dataLabelsOptions() {
            return {
                enabled: false,
            };
        },
        strokeOptions() {
            return {
                curve: 'monotoneCubic',
                width: 2,
                dashArray: this.dashArray,
            };
        },
        responsiveOptions() {
            /**
             * deliberately not used, because it appears to cause a "too much recursion" error
             * whenever options is mutated,
             * See: https://stackoverflow.com/questions/78960089/
             **/
            return [];
        },
        tooltipOptions() {
            return {
                x: this.tooltipXOptions,
                y: this.tooltipYOptions,
            };
        },
        tooltipXOptions() {
            return {
                formatter: (value) => {
                    return this.xTooltip.replace('{value}', String(value));
                },
            };
        },
        tooltipYOptions() {
            return {
                formatter: (value) => {
                    if (this.yIsPercentage) {
                        const decimalPlaces = this.yTooltipDecimalPlaces || 0;
                        return String(parseFloat(value).toFixed(decimalPlaces)) + '%';
                    }
                    return value;
                },
            };
        },
        xaxisOptions() {
            return {
                type: 'category',
                decimalsInFloat: this.xAxisDecimalsInFloat,
                title: {
                    text: this.xAxisTitle,
                },
                min: this.xLowestValueInData,
                max: this.xCalculateMaxAxisFromData(),
                tickAmount: this.xCalculateTickAmountExcludingEnd(), // defined as "Number of Tick Intervals to show." — unlike yaxis, it appears this excludes both the first and last displayed values
                tickPlacement: 'on',
            };
        },
        yaxisOptions() {
            return {
                title: {
                    text: this.yAxisTitle,
                },
                min: 0,
                max: this.yCalculateMaxAxisFromData(),
                tickAmount: this.yCalculateTickAmountIncludingEnd(), // defined as "Number of Tick Intervals to show." — unlike xaxis, it appears this includes one, but not both of the first and last displayed values
                labels: {
                    formatter: (value) => {
                        return parseInt(value, 10);
                    },
                },
            };
        },
    },
    methods: {
        updateSeriesData() {
            this.seriesData = this.series;
        },
        updateOptionsData() {
            this.optionsData = {
                chart: this.chartOptions,
                dataLabels: this.dataLabelsOptions,
                stroke: this.strokeOptions,
                colors: this.chartColors,
                responsive: this.responsiveOptions,
                tooltip: this.tooltipOptions,
                xaxis: this.xaxisOptions,
                yaxis: this.yaxisOptions,
            };
        },
        calculateNeatInterval(provisionalInterval, useHigherInterval) {
            const unsortedNeatIntervals = [1.0, 2.0, 2.5, 5.0];
            const neatIntervals = unsortedNeatIntervals.sort((a, b) => useHigherInterval ? a - b : b - a);
            const fallbackMultiplier = useHigherInterval ? 10 : 0.1;

            const magnitude = Math.pow(10, Math.floor(Math.log10(provisionalInterval)));
            const normalizedInterval = provisionalInterval / magnitude;

            for (const neat of neatIntervals) {
                if (useHigherInterval ? (normalizedInterval < neat) : (normalizedInterval >= neat)) {
                    return neat * magnitude;
                }
            }

            return fallbackMultiplier * magnitude;
        },
        yCalculateMaxAxisFromData() {
            return this.yCalculateTickAmountIncludingEnd() * this.yCalculateTickInterval();
        },
        yCalculateTickAmountIncludingEnd() {
            const requiredAxisHeight = this.yHighestValueInData + 1; // presentation decision: ensure top data point is not at absolute top of chart
            return Math.ceil(requiredAxisHeight / this.yCalculateTickInterval());
        },
        yCalculateTickInterval() {
            const lowestValue = 0;
            const highestValue = this.yHighestValueInData;
            const tickAmountIncludingEnd = Math.min(this.yIdealTickAmountIncludingEnd, highestValue + 1); // presentation decision: ensure top data point is not at absolute top of chart
            const tickInterval = this.calculateTickInterval(lowestValue, highestValue, tickAmountIncludingEnd);

            const lowerNeatInterval = this.calculateNeatInterval(tickInterval, false);

            if (tickAmountIncludingEnd * lowerNeatInterval > highestValue) {
                return lowerNeatInterval;
            }

            return this.calculateNeatInterval(tickInterval, true);
        },
        xCalculateMaxAxisFromData() {
            const numberOfTicksIncludingEnd = this.xCalculateTickAmountExcludingEnd() + 1;
            const axisRange = numberOfTicksIncludingEnd * this.xCalculateTickIntervalFromData();
            return this.xLowestValueInData + axisRange;
        },
        xCalculateTickAmountExcludingEnd() {
            return Math.min(
                this.xIdealTickAmountExcludingEnd,
                ((this.xHighestValueInData - this.xLowestValueInData) - 1),
            );
        },
        xCalculateTickIntervalFromData() {
            return this.xCalculateTickInterval(this.xLowestValueInData, this.xHighestValueInData);
        },
        xCalculateTickInterval(startValue, endValue) {
            return this.calculateTickInterval(startValue, endValue, this.xCalculateTickAmountExcludingEnd() + 1);
        },
        calculateTickInterval(startValue, endValue, tickAmountIncludingEnd) {
            const lowHighOffset = endValue - startValue;
            return Math.ceil(lowHighOffset / tickAmountIncludingEnd);
        },
        xCalculateAxisFromAdjustment(specifiedMin, specifiedMax) {
            return this.calculateAxisFromAdjustment(
                specifiedMin,
                specifiedMax,
                this.xLowestValueInData,
                this.xHighestValueInData,
                this.xCalculateTickInterval,
                this.xCalculateTickAmountExcludingEnd(),
            );
        },
        calculateAxisFromAdjustment(
            specifiedMin,
            specifiedMax,
            lowestValueInData,
            highestValueInData,
            tickIntervalCalculator,
            tickAmountExcludingEnd,
        ) {
            let provisionalMin = Math.max(Math.floor(specifiedMin), lowestValueInData);
            let provisionalMax = Math.min(Math.ceil(specifiedMax), highestValueInData);
            const tickInterval = tickIntervalCalculator(provisionalMin, provisionalMax);

            const numberOfTicksIncludingEnd = tickAmountExcludingEnd + 1;
            const axisRange = numberOfTicksIncludingEnd * tickInterval;

            provisionalMin = provisionalMax - axisRange; // use full range

            const minDifferenceToData = provisionalMin - lowestValueInData;

            if (minDifferenceToData < 0) { // check if adjusted minimum is too low and offset towards maximum
                provisionalMin = provisionalMin - minDifferenceToData;
                provisionalMax = provisionalMax - minDifferenceToData;
            }

            return {min: provisionalMin, max: provisionalMax, tickInterval};
        },
    },
    mounted() {
        this.updateOptionsData();
        this.updateSeriesData();
    },
};
