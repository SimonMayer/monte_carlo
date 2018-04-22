class BurnUpChart extends CycleChart {
    initialize(milestone, forecastsByPercentage) {
        this.milestone = milestone;
        this.forecastsByPercentage = forecastsByPercentage;
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
            lineTension: 0
        });
    }

    plotTrendLines() {
        for (const percentile in this.forecastsByPercentage) {
            this.datasets.push({
                label: percentile + '%',
                data: this.forecastsByPercentage[percentile],
                fill: false,
                borderColor: this.config.lineColors[percentile],
                backgroundColor: this.config.pointColors[percentile],
                lineTension: 0
            });
        }
    }

    render() {
        this.renderTitle();
        this.renderHelp();
        this.renderChart(
            {
                type: 'line',
                data: {labels: this.labels, datasets: this.datasets},
                options: {
                    legend: {display: true, position: 'bottom'},
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                        xAxes: [
                            {scaleLabel: {labelString: 'cycles', display: true}}
                        ],
                        yAxes: [
                            {scaleLabel: {labelString: 'items', display: true}}
                        ]
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: BurnUpChart.modifyTooltipLabel,
                            title: BurnUpChart.modifyTooltipTitle
                        }
                    }
                }
            }
        );
    }

    static modifyTooltipLabel(tooltipItem) {
        return '>' + tooltipItem.yLabel + ' completed items';
    }

    static modifyTooltipTitle(tooltipItems, data) {
        return 'After '
            + tooltipItems[0].index + ' '
            + ((1 === tooltipItems[0].index) ? 'cycle' : 'cycles') + ' '
            + data.datasets[tooltipItems[0].datasetIndex].label + ' '
            + 'chance';
    }
}
