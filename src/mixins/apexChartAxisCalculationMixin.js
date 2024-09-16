export const apexChartAxisCalculationMixin = {
    methods: {
        calculateAxisCrudeTickInterval(minimumViewSize, minimumTickInterval, maximumTickQuantity) {
            const idealTickInterval = minimumViewSize / maximumTickQuantity;
            return Math.ceil(idealTickInterval / minimumTickInterval) * minimumTickInterval;
        },
        calculateAxisNeatTickInterval(approximateViewSize, minimumTickInterval, maximumTickQuantity) {
            const crudeTickInterval = this.calculateAxisCrudeTickInterval(approximateViewSize, minimumTickInterval, maximumTickQuantity);

            const neatIntervalMultipliers = [1.0, 2.0, 2.5, 5.0];
            const fallbackMultiplier = 10;

            const magnitude = Math.pow(10, Math.floor(Math.log10(crudeTickInterval)));
            const normalizedInterval = crudeTickInterval / magnitude;

            for (const neatMultiplier of neatIntervalMultipliers) {
                if (normalizedInterval <= neatMultiplier) {
                    const neatTickInterval = neatMultiplier * magnitude;

                    const remainder = neatTickInterval % minimumTickInterval;
                    if (remainder < 1) {
                        /*
                         * Ideally remainder is zero.
                         * Tolerance is increased because of imprecision in floating point tick intervals.
                         */
                        return neatTickInterval;
                    }
                }
            }

            return fallbackMultiplier * magnitude;
        },
        calculateAxisTickInterval(approximateViewSize, minimumTickInterval, maximumTickQuantity, useNeatTickInterval) {
            return useNeatTickInterval
                ? this.calculateAxisNeatTickInterval(approximateViewSize, minimumTickInterval, maximumTickQuantity)
                : this.calculateAxisCrudeTickInterval(approximateViewSize, minimumTickInterval, maximumTickQuantity);
        },
        calculateAxisMaximumSize(axisMinimumValue, dataMaximumValue, tickInterval) {
            const range = dataMaximumValue - axisMinimumValue;
            return Math.ceil(range / tickInterval) * tickInterval;
        },
        calculateAxisViewRange(axisMinimumValue, dataMaximumValue, tickInterval, maximumTickQuantity) {
            const maximumAxisSize = this.calculateAxisMaximumSize(axisMinimumValue, dataMaximumValue, tickInterval);
            const maximumViewRange = tickInterval * maximumTickQuantity;

            return Math.min(maximumViewRange, maximumAxisSize);
        },
        calculateAxisViewAdjustment(
            axisMinimumValue,
            dataMaximumValue,
            approximateViewCenter,
            approximateViewSize,
            minimumTickInterval,
            maximumTickQuantity,
            useNeatTickInterval,
        ) {
            const tickInterval = this.calculateAxisTickInterval(
                approximateViewSize,
                minimumTickInterval,
                maximumTickQuantity,
                useNeatTickInterval,
            );

            const viewRange = this.calculateAxisViewRange(axisMinimumValue, dataMaximumValue, tickInterval, maximumTickQuantity);

            const idealViewStart = Math.round((approximateViewCenter - (viewRange / 2)) / tickInterval) * tickInterval;
            const viewUnderflow = Math.max(0, axisMinimumValue - idealViewStart);
            const definitiveViewStart = idealViewStart + viewUnderflow;

            const idealViewEnd = definitiveViewStart + viewRange;
            const viewOverflow = Math.max(0, idealViewEnd - dataMaximumValue);
            const excessiveTickQuantity = Math.floor(viewOverflow / tickInterval);
            const definitiveViewEnd = idealViewEnd - (excessiveTickQuantity * tickInterval);

            const tickQuantity = Math.round((definitiveViewEnd - definitiveViewStart) / tickInterval);

            return {
                viewStart: definitiveViewStart,
                viewEnd: definitiveViewEnd,
                tickInterval,
                tickQuantity,
            };
        },
    },
};
