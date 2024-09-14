<template>
  <div class="milestone-distribution-page">
    <EnsembleChart
        :optionsData="optionsData"
        :requiresMilestoneAchievement="true"
        :seriesData="seriesData"
        :showTooltip="['medium', 'large']"
        title="Milestone achievement distribution"
        type="area"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import EnsembleChart from '@/components/EnsembleChart.vue';
import {apexChartMixin} from '@/mixins/apexChartMixin';

export default {
  name: 'MilestoneDistributionPage',
  components: {
    EnsembleChart,
  },
  mixins: [
    apexChartMixin,
  ],
  data() {
    return {
      chartId: 'milestone-distribution-chart',
      xTooltip: 'During period {value}',
      xAxisTitle: 'Period',
      yAxisTitle: 'Likelihood (%)',
      yIsPercentage: true,
      yTooltipDecimalPlaces: 2,
    };
  },
  computed: {
    ...mapGetters({
      getChanceOfAchievingMilestoneByPeriod: 'ensembleGenerator/getChanceOfAchievingMilestoneByPeriod',
      simulationPeriods: 'ensembleGenerator/simulationPeriods',
    }),
    series() {
      const data = [];
      let priorCumulativeChance = 0;

      if (this.simulationPeriods === 1) {
        data.push({x: 0, y: 0});
      }

      for (let i = 0; i < this.simulationPeriods; i++) {
        const humanReadablePeriodNumber = i + 1;
        const cumulativeChance = this.getChanceOfAchievingMilestoneByPeriod(i);
        const periodChance = cumulativeChance - priorCumulativeChance;

        if (periodChance !== null) {
          data.push({
            x: humanReadablePeriodNumber,
            y: periodChance * 100,
          });
        }

        priorCumulativeChance = cumulativeChance;
      }
      return [
        {
          name: 'Likelihood of achieving milestone',
          data: data,
        },
      ];
    },
  },
};
</script>

