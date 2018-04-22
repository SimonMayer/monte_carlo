class VariedForecastBarChart extends CycleChart {
    initialize(milestone, forecastsByPercentage) {
        this.milestone = milestone;
        this.forecastsByPercentage = forecastsByPercentage;
        this.labels = [];
        this.datasets = [];

        for (const percentage in this.forecastsByPercentage) {
            this.cycleCount = this.forecastsByPercentage[percentage].length;
            break;
        }

        this.buildLabels();
        this.destroy();
    }

    plotMilestoneLine() {
        const milestoneDataPoints = [];
        for (let i = 0; i < this.cycleCount; i++) {
            milestoneDataPoints.push(this.milestone);
        }
        this.datasets.push({
            label: 'milestone',
            data: milestoneDataPoints,
            fill: false,
            backgroundColor: '#fff',
            borderColor: this.config.milestoneColor,
            borderDash: [5, 5],
            pointRadius: 0,
            lineTension: 0,
            type: 'line'
        });
    }

    plotBars() {
        for (const percentile in this.forecastsByPercentage) {
            const adjustedPercentile = 100 - percentile;
            this.datasets.push({
                label: adjustedPercentile + '%',
                data: this.forecastsByPercentage[percentile],
                borderColor: this.config.outlineColors[adjustedPercentile],
                backgroundColor: this.config.barColors[adjustedPercentile],
            });
        }
    }

    render() {
        this.renderTitle();
        this.renderHelp();
        this.renderChart(
            {
                type: 'bar',
                data: {labels: this.labels, datasets: this.datasets},
                options: {
                    legend: {display: true, position: 'bottom'},
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                        xAxes: [
                            {
                                stacked: true,
                                scaleLabel: {labelString: 'cycles', display: true}
                            }
                        ],
                        yAxes: [
                            {
                                stacked: true,
                                scaleLabel: {labelString: 'items', display: true}
                            }
                        ]
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: VariedForecastBarChart.modifyTooltipLabel,
                            title: VariedForecastBarChart.modifyTooltipTitle
                        }
                    }
                }
            }
        );
    }

    static modifyTooltipLabel(tooltipItem, data) {
        let total = 0;
        for (let i = 0; i <= tooltipItem.datasetIndex; i++) {
            const dataset = data.datasets[i];
            if ('line' !== dataset.type) {
                total += dataset.data[tooltipItem.index];
            }
        }
        return '>' + total + ' completed items';
    }

    static modifyTooltipTitle(tooltipItems, data) {
        return 'After '
            + tooltipItems[0].index + ' '
            + ((1 === tooltipItems[0].index) ? 'cycle' : 'cycles') + ' '
            + data.datasets[tooltipItems[0].datasetIndex].label + ' '
            + 'chance';
    }
}
