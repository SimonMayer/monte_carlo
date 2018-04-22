class CycleChart {
    constructor(config, containerElement) {
        this.chart = null;
        this.config = config;
        this.containerElement = containerElement;
        this.cycleCount = 0;
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
        }
        this.containerElement.empty();
    }

    buildLabels() {
        this.labels = [];
        for (let i = 0; i < this.cycleCount; i++) {
            this.labels.push(i);
        }
    }

    renderChart(config) {
        const canvas = $('<canvas height="' + this.config.canvasHeight + '"></canvas>');
        this.containerElement.append(canvas);

        this.chart = new Chart(canvas, config)
    }

    renderHelp() {
        if (this.containerElement.data('help')) {
            $(this.containerElement.data('help')).removeAttr('hidden');
        }
    }

    renderTitle() {
        if (this.containerElement.data('title')) {
            $(this.containerElement.data('title')).removeAttr('hidden');
        }
    }
}
