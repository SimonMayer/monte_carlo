class Simulator {
    initialize(milestone, simulationCount, cycleCount, possibleOutcomes) {
        this.cycles = [];
        this.simulations = [];

        this.milestone = milestone;
        this.simulationCount = simulationCount;
        this.cycleCount = cycleCount;
        this.possibleOutcomes = possibleOutcomes;

        this.generateCycles();
    }

    generateCycles() {
        this.cycles = [];
        for (let i = 0; i <= this.cycleCount; i++) {
            this.cycles.push(new Cycle());
        }
    }

    runSimulations() {
        for (let i = 0; i < this.simulationCount; i++) {
            this.runSimulation();
        }
    }

    runSimulation() {
        const simulation = [];
        let runningTotal = 0;
        let isMilestoneMet = false;
        let isCycleZero = true;

        for (const sequence in this.cycles) {
            const outcome = (isCycleZero) ? 0 : this.simulateSingleCycle();
            simulation.push(outcome);

            runningTotal += outcome;
            this.cycles[sequence].addRunningTotal(runningTotal);

            if (!isMilestoneMet && runningTotal >= this.milestone) {
                this.cycles[sequence].incrementMilestonesMet();
                isMilestoneMet = true;
            }
            isCycleZero = false;
        }
        this.simulations.push(simulation);
    }

    simulateSingleCycle() {
        return parseFloat(this.possibleOutcomes[Math.floor(Math.random() * this.possibleOutcomes.length)]);
    }

    calculateMilestoneMetDistribution() {
        const milestoneDistribution = [];
        for (const sequence in this.cycles) {
            milestoneDistribution.push(this.cycles[sequence].calculateMilestoneMetPercentage(this.simulationCount));
        }

        return milestoneDistribution;
    }

    calculateForecastsByPercentiles(percentiles) {
        const forecasts = {};

        for (const sequence in this.cycles) {
            this.cycles[sequence].sortRunningTotals();
        }
        for (const index in percentiles) {
            const percentile = percentiles[index];
            forecasts[percentile] = [];

            for (const sequence in this.cycles) {
                forecasts[percentile].push(this.cycles[sequence].calculateRunningTotalAtPercentile(percentile));
            }
        }

        return forecasts;
    }

    calculateIterativeForecastsByPercentiles(percentiles) {
        percentiles.sort(function (a, b) {
            return b - a;
        }); // must be descending, for the indexed comparisons
        const iterativeForecasts = {};
        const forecastsByPercentiles = this.calculateForecastsByPercentiles(percentiles);

        for (const sequence in this.cycles) {
            for (const index in percentiles) {
                const percentile = percentiles[index];
                if (iterativeForecasts[percentile] === undefined) {
                    iterativeForecasts[percentile] = [];
                }

                if (index < percentiles.length - 1) {
                    const higherPercentile = percentiles[parseInt(index, 10) + 1];

                    iterativeForecasts[percentile].push(
                        forecastsByPercentiles[higherPercentile][sequence] -
                        forecastsByPercentiles[percentile][sequence]
                    );
                } else {
                    iterativeForecasts[percentile].push(forecastsByPercentiles[percentiles[0]][sequence]);
                }
            }
        }

        return iterativeForecasts;
    }
}
