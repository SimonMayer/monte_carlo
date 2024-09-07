<template>
  <div class="home-page">
    <h3>{{ welcomeHeading }}</h3>
    <div v-if="isGenerated">
      <p>
        You have
        <template v-if="generatedInLastMinute">just generated an ensemble</template>
        <template v-else-if="generatedInLastHalfHour">a recently generated ensemble</template>
        <template v-else>an ensemble generated at <strong>{{ formattedGeneratedTime }}</strong></template>
        with <strong>{{ completedSimulationCount }}</strong> runs over <strong>{{ simulationPeriods }}</strong> periods.
      </p>

      <p>You may view the following charts:</p>
      <ul>
        <li>
          <router-link :to="$router.getRouteById('forecast-burn-up')">Forecast burn-up chart</router-link>
        </li>
      </ul>
      <hr/>
      <p>Alternatively, you may clear the previous ensemble and prepare a new one:</p>
      <button id="prepareNewEnsemble" @click="prepareNewEnsemble">Prepare new ensemble</button>
    </div>
    <div v-else>
      <p>It appears you haven't generated an ensemble yet.</p>
      <p>An ensemble is a collection of simulations that use random variations of historical data to predict potential
        future outcomes.</p>
      <button id="getStarted" @click="goToSimulationInputs">Get started</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'HomePage',
  computed: {
    ...mapGetters({
      completedSimulationCount: 'ensembleGenerator/completedSimulationCount',
      generatedTimestamp: 'ensembleGenerator/generatedTimestamp',
      isGenerated: 'ensembleGenerator/isGenerated',
      simulationPeriods: 'ensembleGenerator/simulationPeriods',
    }),
    generatedInLastMinute() {
      return (Date.now() - this.generatedTimestamp) < (60 * 1000);
    },
    generatedInLastHalfHour() {
      return (Date.now() - this.generatedTimestamp) < (30 * 60 * 1000);
    },
    formattedGeneratedTime() {
      return new Date(this.generatedTimestamp).toLocaleString();
    },
    welcomeHeading() {
      if (!this.isGenerated) {
        return 'Welcome!';
      } else if (this.generatedInLastMinute) {
        return 'Your ensemble is ready!';
      } else if (this.generatedInLastHalfHour) {
        return 'Recently generated ensemble';
      } else {
        return 'Welcome back!';
      }
    },
  },
  methods: {
    ...mapActions({
      clearEnsemble: 'ensembleGenerator/clearEnsemble',
    }),
    async prepareNewEnsemble() {
      await this.clearEnsemble();
      this.goToSimulationInputs();
    },
    goToSimulationInputs() {
      this.$router.push(this.$router.getRouteById('simulation-inputs'));
    },
  },
};
</script>
