<template>
  <div class="forecast-burn-up-page">
    <EnsembleChart
        :beforeZoomHandler="handleBeforeZoomEvent"
        :optionsData="optionsData"
        :seriesData="seriesData"
        :showTooltip="['medium', 'large']"
        title="Forecast burn-up"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {apexChartMixin} from '@/mixins/apexChartMixin';
import EnsembleChart from '@/components/EnsembleChart.vue';

export default {
  name: 'ForecastBurnUpPage',
  components: {EnsembleChart},
  mixins: [
    apexChartMixin,
  ],
  data() {
    return {
      chartId: 'forecast-burn-up-chart',
      confidenceLevels: [0.2, 0.5, 0.8], // if length changes, modify dashArray
      dashArray: [0, 0, 0, 5], // 0 values represent confidenceLevel series; final value is for milestone
      xTooltip: 'Before end of period {value}',
      xAxisTitle: 'Period',
      yAxisTitle: 'Progress',
    };
  },
  computed: {
    ...mapGetters({
      getConservativelyPercentiledProgressionAtPeriod: 'ensembleGenerator/getConservativelyPercentiledProgressionAtPeriod',
      milestone: 'ensembleGenerator/milestone',
      simulationPeriods: 'ensembleGenerator/simulationPeriods',
    }),
    series() {
      const series = [];

      for (const confidenceLevel of this.confidenceLevels) {
        series.push({
          name: `Progress, with ${confidenceLevel * 100}% confidence`,
          data: this.generateSeriesDataAtConfidenceLevel(confidenceLevel),
        });
      }

      series.push({
        name: `Milestone`,
        data: this.generateSeriesDataForMilestoneLine(),
        color: this.chartForeColor,
      });

      return series;
    },
  },
  methods: {
    generateSeriesDataAtConfidenceLevel(confidenceLevel) {
      const data = [];

      if (this.simulationPeriods === 1) {
        data.push({x: 0, y: 0});
      }

      for (let simulationPeriod = 0; simulationPeriod < this.simulationPeriods; simulationPeriod++) {
        const humanReadablePeriodNumber = simulationPeriod + 1;
        const percentileFloat = 1 - confidenceLevel;
        const progression = this.getConservativelyPercentiledProgressionAtPeriod(simulationPeriod, percentileFloat);

        if (progression !== null) {
          data.push({
            x: humanReadablePeriodNumber,
            y: progression,
          });
        }
      }
      return data;
    },
    generateSeriesDataForMilestoneLine() {
      const data = [];

      if (this.simulationPeriods === 1) {
        data.push({x: 0, y: this.milestone});
      }

      for (let simulationPeriod = 0; simulationPeriod < this.simulationPeriods; simulationPeriod++) {
        const humanReadablePeriodNumber = simulationPeriod + 1;
        data.push({
          x: humanReadablePeriodNumber,
          y: this.milestone,
        });
      }
      return data;
    },
  },
};
</script>
