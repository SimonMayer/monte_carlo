<template>
  <div class="milestone-cumulative-page">
    <EnsembleChart
        :beforeZoomHandler="handleBeforeZoomEvent"
        :optionsData="optionsData"
        :requiresMilestoneAchievement="true"
        :seriesData="seriesData"
        :showTooltip="['medium', 'large']"
        title="Cumulative milestone achievement"
        type="area"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import EnsembleChart from '@/components/EnsembleChart.vue';
import {apexChartMixin} from '@/mixins/apexChartMixin';

export default {
  name: 'MilestoneCumulativePage',
  components: {
    EnsembleChart,
  },
  mixins: [
    apexChartMixin,
  ],
  data() {
    return {
      chartId: 'milestone-cumulative-chart',
      xTooltip: 'Before end of period {value}',
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

      if (this.simulationPeriods === 1) {
        data.push({x: 0, y: 0});
      }

      for (let i = 0; i < this.simulationPeriods; i++) {
        const humanReadablePeriodNumber = i + 1;
        const cumulativeChance = this.getChanceOfAchievingMilestoneByPeriod(i);

        if (cumulativeChance !== null) {
          data.push({
            x: humanReadablePeriodNumber,
            y: cumulativeChance * 100,
          });
        }
      }
      return [
        {
          name: 'Cumulative likelihood of achieving milestone',
          data: data,
        },
      ];
    },
  },
};
</script>
