import {apexChartAxisCalculationMixin} from '@/mixins/apexChartAxisCalculationMixin';

export const apexChartMixin = {
    mixins: [
        apexChartAxisCalculationMixin,
    ],
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
            xMax: null,
            xMaximumTickQuantity: 6,
            xMin: null,
            xMinimumTickInterval: 1,
            xTickAmount: null,
            xTickInterval: null,
            yAxisTitle: '',
            yMax: null,
            yMaximumTickQuantity: 6,
            yMin: null,
            yMinimumTickInterval: 1,
            yTickAmount: null,
            yTickInterval: null,
            zoomLevel: 0,
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
                    download: '<img src="/icons/download.svg" width="20" height="20" />',
                    reset: false,
                    pan: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    customIcons: this.chartToolbarCustomIconOptions,
                },
                export: {
                    csv: {
                        headerCategory: this.xAxisTitle,
                    },
                },
            };
        },
        isFullyZoomedOut() {
            return this.zoomLevel < 1;
        },
        isZoomViewInEnabled() {
            return (this.xTickInterval > this.xMinimumTickInterval) || (this.yTickInterval > this.yMinimumTickInterval);
        },
        isZoomViewOutEnabled() {
            return !this.isFullyZoomedOut;
        },
        isMoveViewLeftEnabled() {
            return !this.isFullyZoomedOut && this.xMin > this.xLowestValueInData;
        },
        isMoveViewUpEnabled() {
            return !this.isFullyZoomedOut && this.yMax <= this.yHighestValueInData;
        },
        isMoveViewDownEnabled() {
            return !this.isFullyZoomedOut && this.yMin > 0;
        },
        isMoveViewRightEnabled() {
            return !this.isFullyZoomedOut && this.xMax < this.xHighestValueInData;
        },
        toolbarIconPathZoomIn() {
            const fileName = 'zoom-in' + (this.isZoomViewInEnabled ? '' : '-disabled');
            return `/icons/${fileName}.svg`;
        },
        toolbarIconPathZoomOut() {
            const fileName = 'zoom-out' + (this.isZoomViewOutEnabled ? '' : '-disabled');
            return `/icons/${fileName}.svg`;
        },
        toolbarIconPathMoveLeft() {
            const fileName = 'move-left' + (this.isMoveViewLeftEnabled ? '' : '-disabled');
            return `/icons/${fileName}.svg`;
        },
        toolbarIconPathMoveUp() {
            const fileName = 'move-up' + (this.isMoveViewUpEnabled ? '' : '-disabled');
            return `/icons/${fileName}.svg`;
        },
        toolbarIconPathMoveDown() {
            const fileName = 'move-down' + (this.isMoveViewDownEnabled ? '' : '-disabled');
            return `/icons/${fileName}.svg`;
        },
        toolbarIconPathMoveRight() {
            const fileName = 'move-right' + (this.isMoveViewRightEnabled ? '' : '-disabled');
            return `/icons/${fileName}.svg`;
        },
        toolbarIconPathReset() {
            return '/icons/reset.svg';
        },
        toolbarIconPathDivider() {
            return '/icons/divider.svg';
        },
        chartToolbarCustomIconOptions() {
            const iconOptions = [
                {srcPath: this.toolbarIconPathZoomIn, title: 'zoom in', click: this.zoomViewIn},
                {srcPath: this.toolbarIconPathZoomOut, title: 'zoom out', click: this.zoomViewOut},
                {divider: true},
                {srcPath: this.toolbarIconPathMoveLeft, title: 'move left', click: this.moveViewLeft},
                {srcPath: this.toolbarIconPathMoveUp, title: 'move up', click: this.moveViewUp},
                {srcPath: this.toolbarIconPathMoveDown, title: 'move down', click: this.moveViewDown},
                {srcPath: this.toolbarIconPathMoveRight, title: 'move right', click: this.moveViewRight},
                {divider: true},
                {srcPath: this.toolbarIconPathReset, title: 'reset view', click: this.applyDefaultView},
                {divider: true},
            ];

            return iconOptions.map((option, index) => ({
                icon: `<img src="${option.divider ? this.toolbarIconPathDivider : option.srcPath}" width="${option.divider ? 2 : 20}" height="20" />`,
                index: index - iconOptions.length,
                title: option.divider ? '' : option.title,
                class: option.divider ? 'divider' : 'custom-icon',
                click: option.divider ? function () {
                } : option.click,
            }));
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
                enabled: false,
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
                tickPlacement: 'on',
            };
        },
        yaxisOptions() {
            return {
                title: {
                    text: this.yAxisTitle,
                },
                labels: {
                    formatter: (value) => {
                        return parseInt(value, 10);
                    },
                },
            };
        },
    },
    methods: {
        updateOptionsData(options) {
            this.optionsData = {
                ...this.optionsData,
                ...options,
            };
        },
        refreshChartOptions() {
            this.updateOptionsData({chart: this.chartOptions});
        },
        xSetAxisPosition() {
            this.xaxisOptions.min = (typeof this.xMin === 'number' && !isNaN(this.xMin))
                ? this.xMin
                : this.xLowestValueInData;
            this.xaxisOptions.max = (typeof this.xMax === 'number' && !isNaN(this.xMax))
                ? this.xMax
                : this.xHighestValueInData;
            this.xaxisOptions.tickAmount = (typeof this.xTickAmount === 'number' && !isNaN(this.xTickAmount))
                ? this.xTickAmount
                : this.xMaximumTickQuantity;

            this.updateOptionsData({xaxis: this.xaxisOptions});
            this.refreshChartOptions();
        },
        xAdjustAxis() {
            const zoomFactor = Math.pow(0.5, this.zoomLevel);
            const xApproximateViewCenter = (this.xaxisOptions.min + this.xaxisOptions.max) / 2;
            const xApproximateViewSize = (this.xHighestValueInData - this.xLowestValueInData) * zoomFactor;

            const xAxisViewAdjustment = this.calculateAxisViewAdjustment(
                this.xLowestValueInData,
                this.xHighestValueInData,
                xApproximateViewCenter,
                xApproximateViewSize,
                this.xMinimumTickInterval,
                this.xMaximumTickQuantity,
                false,
            );
            this.xMin = xAxisViewAdjustment.viewStart;
            this.xMax = xAxisViewAdjustment.viewEnd;
            this.xTickInterval = xAxisViewAdjustment.tickInterval;
            /**
             *  undocumented, but apexcharts seems to place an additional tick on the x-axis, despite not doing this
             *  for the y-axis.
             */
            this.xTickAmount = xAxisViewAdjustment.tickQuantity - 1;
            this.xSetAxisPosition();
        },
        ySetAxisPosition() {
            this.yaxisOptions.min = (typeof this.yMin === 'number' && !isNaN(this.yMin))
                ? this.yMin
                : 0;
            this.yaxisOptions.max = (typeof this.yMax === 'number' && !isNaN(this.yMax))
                ? this.yMax
                : this.yHighestValueInData;
            this.yaxisOptions.tickAmount = (typeof this.yTickAmount === 'number' && !isNaN(this.yTickAmount))
                ? this.yTickAmount
                : this.yMaximumTickQuantity;

            this.updateOptionsData({yaxis: this.yaxisOptions});
            this.refreshChartOptions();
        },
        yAdjustAxis() {
            const zoomFactor = Math.pow(0.5, this.zoomLevel);

            const yApproximateViewCenter = (this.yaxisOptions.min + this.yaxisOptions.max) / 2;
            const yApproximateViewSize = this.yHighestValueInData * zoomFactor;
            const yAxisViewAdjustment = this.calculateAxisViewAdjustment(
                0,
                this.yHighestValueInData + this.yMinimumTickInterval,
                yApproximateViewCenter,
                yApproximateViewSize,
                this.yMinimumTickInterval,
                this.yMaximumTickQuantity,
                true,
            );
            this.yMin = yAxisViewAdjustment.viewStart;
            this.yMax = yAxisViewAdjustment.viewEnd;
            this.yTickInterval = yAxisViewAdjustment.tickInterval;
            /**
             *  undocumented, but unlike with the x-axis, apexcharts seems to not place an additional tick on the
             *  y-axis. It just uses the specified tickAmount.
             */
            this.yTickAmount = yAxisViewAdjustment.tickQuantity;
            this.ySetAxisPosition();
        },
        zoomViewIn() {
            if (!this.isZoomViewInEnabled) {
                return;
            }
            this.zoomLevel++;
            this.xAdjustAxis();
            this.yAdjustAxis();
        },
        zoomViewOut() {
            if (!this.isZoomViewOutEnabled) {
                return;
            }
            this.zoomLevel--;
            this.xAdjustAxis();
            this.yAdjustAxis();
        },
        moveViewLeft() {
            if (!this.isMoveViewLeftEnabled) {
                return;
            }
            this.xaxisOptions.min = this.xaxisOptions.min - this.xTickInterval;
            this.xaxisOptions.max = this.xaxisOptions.max - this.xTickInterval;
            this.xAdjustAxis();
        },
        moveViewUp() {
            if (!this.isMoveViewUpEnabled) {
                return;
            }
            this.yaxisOptions.min = this.yaxisOptions.min + this.yTickInterval;
            this.yaxisOptions.max = this.yaxisOptions.max + this.yTickInterval;
            this.yAdjustAxis();
        },
        moveViewDown() {
            if (!this.isMoveViewDownEnabled) {
                return;
            }
            this.yaxisOptions.min = this.yaxisOptions.min - this.yTickInterval;
            this.yaxisOptions.max = this.yaxisOptions.max - this.yTickInterval;
            this.yAdjustAxis();
        },
        moveViewRight() {
            if (!this.isMoveViewRightEnabled) {
                return;
            }
            this.xaxisOptions.min = this.xaxisOptions.min + this.xTickInterval;
            this.xaxisOptions.max = this.xaxisOptions.max + this.xTickInterval;
            this.xAdjustAxis();
        },
        applyDefaultView() {
            this.zoomLevel = 0;
            this.xaxisOptions.min = this.xLowestValueInData;
            this.xaxisOptions.max = this.xHighestValueInData;
            this.yaxisOptions.min = 0;
            this.yaxisOptions.max = this.yHighestValueInData;

            this.xAdjustAxis();
            this.yAdjustAxis();
        },
        setOptionsData() {
            this.updateOptionsData({
                chart: this.chartOptions,
                dataLabels: this.dataLabelsOptions,
                stroke: this.strokeOptions,
                colors: this.chartColors,
                responsive: this.responsiveOptions,
                tooltip: this.tooltipOptions,
                xaxis: this.xaxisOptions,
                yaxis: this.yaxisOptions,
            });
        },
        updateSeriesData() {
            this.seriesData = this.series;
        },
    },
    mounted() {
        this.setOptionsData();
        this.updateSeriesData();
        this.applyDefaultView();
    },
};
