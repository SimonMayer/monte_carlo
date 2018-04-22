class ReachedMilestoneDistributionChart extends CycleChart {
    initialize(milestone, percentageDurationByCycle) {
        this.milestone = milestone;
        this.percentageDurationByCycle = percentageDurationByCycle;
        this.datasets = [];
        this.cycleCount = this.percentageDurationByCycle.length;

        this.buildLabels();
        this.destroy();
    }

    addDistributionCurve() {
        this.datasets.push({
            label: 'Distribution of cycles required to reach milestone (' + this.milestone + ' items)',
            data: this.percentageDurationByCycle,
            fill: 'origin',
            borderColor: this.config.lineColor,
            backgroundColor: this.config.pointColor,
            lineTension: 0.4
        });
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
                            {scaleLabel: {labelString: '% chance', display: true}}
                        ]
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'index',
                        callbacks: {
                            label: ReachedMilestoneDistributionChart.modifyTooltipLabel,
                            title: ReachedMilestoneDistributionChart.modifyTooltipTitle
                        }
                    }
                }
            }
        );
    }

    static modifyTooltipLabel(tooltipItem) {
        return parseFloat(tooltipItem.yLabel).toFixed(2) + '%';
    }

    static modifyTooltipTitle(tooltipItems) {
        return 'Chance of reaching milestone after '
            + tooltipItems[0].index + ' '
            + ((1 === tooltipItems[0].index) ? 'cycle' : 'cycles');
    }
}
