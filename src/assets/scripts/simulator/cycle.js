class Cycle {
    constructor() {
        this.milestonesMet = 0;
        this.runningTotals = [];
    }

    incrementMilestonesMet() {
        this.milestonesMet++;
    }

    addRunningTotal(runningTotal) {
        this.runningTotals.push(runningTotal);
    }

    sortRunningTotals() {
        this.runningTotals.sort(function sortNumber(a, b) {
            return a - b;
        });
    }

    calculateRunningTotalAtPercentile(percentile) {
        let percentileIndex = Math.floor(this.runningTotals.length / 100 * (100 - percentile));
        return this.runningTotals[percentileIndex];
    }

    calculateMilestoneMetPercentage(simulationCount) {
        return this.milestonesMet / simulationCount * 100;
    }
}
