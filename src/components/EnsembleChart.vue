<template>
  <div :class="[
      'ensemble-chart',
      {
        'show-tooltip-small': showTooltip.includes('small'),
        'hide-tooltip-small': !showTooltip.includes('small'),
        'show-tooltip-medium': showTooltip.includes('medium'),
        'hide-tooltip-medium': !showTooltip.includes('medium'),
        'show-tooltip-large': showTooltip.includes('large'),
        'hide-tooltip-large': !showTooltip.includes('large'),
      }
  ]
">
    <details v-if="hasDataInSeries && (!requiresMilestoneAchievement || isMilestoneAchievementSimulated)">
      <summary><h3>{{ title }}</h3></summary>
      <small>
        The chart displays data based on an ensemble covering <strong>{{ simulationPeriods }}</strong> hypothetical
        future {{ simulationPeriods > 1 ? 'periods' : 'period' }}, and incorporating the specified milestone of
        <strong>{{ milestone }}</strong>. Using the provided historic data, potential outcomes were randomly selected
        and repeated over <strong>{{ completedSimulationCount }}</strong> simulation runs. A large number of runs helps
        improve the reliability of the results.
      </small>
    </details>
    <h3 v-else>{{ title }}</h3>
    <hr/>
    <div v-if="hasDataInSeries && (!requiresMilestoneAchievement || isMilestoneAchievementSimulated)"
         class="chart-container">
      <apexchart
          :options="optionsData"
          :series="seriesData"
          :type="type"
          class="chart"
          height="100%"
      ></apexchart>
    </div>
    <div v-else-if="requiresMilestoneAchievement && !isMilestoneAchievementSimulated" class="no-relevant-data-message">
      <h4>No relevant data to display</h4>
      <p>
        This chart cannot be generated because the milestone of <strong>{{ milestone }}</strong> was not reached within
        the specified <strong>{{ simulationPeriods }}</strong> simulated
        {{ simulationPeriods > 1 ? 'periods' : 'period' }}. As a result, no data is available for display.
      </p>
      <p>
        To generate meaningful results, you might either set a lower milestone or allow more simulated periods to see
        when the milestone is likely to be achieved.
      </p>
      <p>
        To proceed, please provide the required simulation inputs and then generate an ensemble.
        An ensemble is a collection of simulations that helps visualize the forecasted outcome over time.
      </p>
      <router-link :to="$router.getRouteById('simulation-inputs')">
        Go to Simulation Inputs
      </router-link>
    </div>
    <div v-else class="no-data-message">
      <h4>No data available</h4>
      <p>We don't have the necessary data to generate this visualization.</p>
      <p>
        To proceed, please provide the required simulation inputs and then generate an ensemble.
        An ensemble is a collection of simulations that helps visualize the forecasted outcome over time.
      </p>
      <router-link :to="$router.getRouteById('simulation-inputs')">
        Go to Simulation Inputs
      </router-link>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import ApexCharts from 'vue3-apexcharts';

export default {
  name: 'EnsembleChart',
  components: {
    apexchart: ApexCharts,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    optionsData: {
      type: Object,
      required: true,
    },
    seriesData: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      default: 'line',
    },
    requiresMilestoneAchievement: {
      type: Boolean,
      default: false,
    },
    showTooltip: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters({
      completedSimulationCount: 'ensembleGenerator/completedSimulationCount',
      isMilestoneAchievementSimulated: 'ensembleGenerator/isMilestoneAchievementSimulated',
      milestone: 'ensembleGenerator/milestone',
      simulationPeriods: 'ensembleGenerator/simulationPeriods',
    }),
    hasDataInSeries() {
      return this.seriesData.length > 0 &&
          this.seriesData.some(
              seriesItem => Array.isArray(seriesItem.data) && seriesItem.data.length > 0,
          );
    },
  },
};
</script>

<style lang="scss">
@use '@/assets/core/responsive/mixins' as responsive;

.ensemble-chart {
  .apexcharts-xaxistooltip-text {
    min-width: unset !important; // !important required to override element styling
  }

  .apexcharts-tooltip-y-group {
    white-space: pre-wrap; // https://github.com/apexcharts/apexcharts.js/issues/671
  }

  &.hide-tooltip-small {
    .apexcharts-tooltip {
      display: none;
    }
  }

  &.show-tooltip-small {
    .apexcharts-tooltip {
      display: flex;
    }
  }

  @include responsive.breakpoint(medium) {
    &.hide-tooltip-medium {
      .apexcharts-tooltip {
        display: none;
      }
    }

    &.show-tooltip-medium {
      .apexcharts-tooltip {
        display: flex;
      }
    }
  }

  @include responsive.breakpoint(large) {
    &.hide-tooltip-large {
      .apexcharts-tooltip {
        display: none;
      }
    }

    &.show-tooltip-large {
      .apexcharts-tooltip {
        display: flex;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@use '@/assets/core/responsive/mixins' as responsive;
@use '@/assets/core/typography/variables' as typography;

.ensemble-chart {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;

  details {
    width: 100%;

    summary {
      h3 {
        display: inline
      }
    }
  }

  hr {
    width: 100%;
    box-sizing: border-box;
  }

  .chart-container {
    width: 100%;
  }

  .chart {
    width: 100%;
    min-height: 240px;

    @include responsive.breakpoint(medium) {
      min-height: 400px;
    }

    @include responsive.breakpoint(large) {
      min-height: 560px;
    }
  }
}
</style>
