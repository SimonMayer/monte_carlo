class Dashboard {
    constructor(simulator, burnUp, variedForecast, reachedMilestonesDistribution) {
        this.simulator = simulator;
        this.burnUp = burnUp;
        this.variedForecast = variedForecast;
        this.reachedMilestonesDistribution = reachedMilestonesDistribution;
    }

    simulate(milestone, simulationCount, cycleCount, previousOutcomes) {
        this.simulator.initialize(milestone, simulationCount, cycleCount, previousOutcomes);
        this.simulator.runSimulations();
    }

    generateBurnUp(percentiles) {
        this.burnUp.initialize(
            this.simulator.milestone,
            this.simulator.calculateForecastsByPercentiles(percentiles)
        );
        this.burnUp.plotMilestoneLine();
        this.burnUp.plotTrendLines();
        this.burnUp.render();
    }

    generateReachedMilestonesDistribution() {
        this.reachedMilestonesDistribution.initialize(this.simulator.milestone, this.simulator.calculateMilestoneMetDistribution());
        this.reachedMilestonesDistribution.addDistributionCurve();
        this.reachedMilestonesDistribution.render();
    }

    generateVariedForecast(percentiles) {
        this.variedForecast.initialize(
            this.simulator.milestone,
            this.simulator.calculateIterativeForecastsByPercentiles(percentiles)
        );
        this.variedForecast.plotMilestoneLine();
        this.variedForecast.plotBars();
        this.variedForecast.render();
    }
}
