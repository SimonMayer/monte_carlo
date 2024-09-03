<template>
  <div class="dashboard">
    <div class="input-group">
      <label class="label-heading" for="milestone">Milestone:</label>
      <input
          id="milestone"
          type="number"
          v-bind:value="milestone"
          @input="updateMilestone"
      />
      <small>The desired number of completed units. e.g. 100 cakes baked, 27 product backlog items done, etc.</small>
    </div>

    <div class="input-group">
      <label class="label-heading" for="simulationPeriods">Simulation periods:</label>
      <input
          id="simulationPeriods"
          min="1"
          type="number"
          v-bind:value="simulationPeriods"
          @input="updateSimulationPeriods"
      />
      <small>
        The number of periods to be included within the simulations. A period is a unit of time, e.g. calendar day,
        working day, sprint, etc.
      </small>
    </div>

    <h3>Historical data</h3>
    <div class="input-group">
      <label class="label-heading">Choose input method:</label>
      <div>
        <label>
          <input
              :checked="!isHistoricalDataInputManually"
              type="radio"
              value="bulk"
              @input="updateHistoricalDataInputMethod"
          />
          Bulk Entry
        </label>
        <label>
          <input
              :checked="isHistoricalDataInputManually"
              type="radio"
              value="manual"
              @input="updateHistoricalDataInputMethod"
          />
          Manual Entry
        </label>
      </div>
      <small>
        Bulk entry is easier if you are pasting in a set of data, such as CSV. Manual entry makes it easier to keep
        track when you're entering each period separately.
      </small>
    </div>

    <div v-show="isHistoricalDataInputManually" class="input-group">
      <label class="label-heading" for="historicalRecordCount">Number of historical records:</label>
      <input
          id="historicalRecordCount"
          min="1"
          type="number"
          v-bind:value="historicalRecordCount"
          @input="updateHistoricalRecordCount"
      />
      <small>Specify how many periods of historical data you have.</small>
    </div>

    <div v-show="isHistoricalDataInputManually" class="input-group">
      <label class="label-heading">Enter units completed per period:</label>
      <ol :class="`digits-${historicalRecordCount.toString().length}`">
        <li v-for="(data, index) in historicalData" :key="index">
          <input
              type="number"
              v-bind:value="historicalData[index]"
              @input="updateHistoricalDataFromInput($event, index)"
          />
        </li>
      </ol>
      <small>
        Specify the number of units completed in each period. e.g. 100 cakes baked in period 1, 87 in period 2, etc.
      </small>
    </div>

    <div v-show="!isHistoricalDataInputManually" class="input-group">
      <label class="label-heading" for="historicalDataBulkEntry">Enter historical data:</label>
      <textarea
          id="historicalDataBulkEntry"
          v-bind:value="historicalDataAsText"
          @input="updateHistoricalDataFromText"
      ></textarea>
      <small>
        Enter the number of completed units per period, separated by commas, spaces or new lines. Example: 14, 12, 7, 11
      </small>
    </div>

    <div class="input-group">
      <button id="createEnsemble" @click="createEnsemble">Create Ensemble</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'DashboardPage',
  computed: {
    ...mapGetters(
        {
          historicalData: 'simulationInputs/historicalData',
          historicalDataAsText: 'simulationInputs/historicalDataAsText',
          historicalRecordCount: 'simulationInputs/historicalRecordCount',
          isHistoricalDataInputManually: 'simulationInputs/isHistoricalDataInputManually',
          milestone: 'simulationInputs/milestone',
          simulationPeriods: 'simulationInputs/simulationPeriods',
        },
    ),
  },
  methods: {
    ...mapActions({
      setHistoricalData: 'simulationInputs/setHistoricalData',
      setHistoricalDataFromText: 'simulationInputs/setHistoricalDataFromText',
      setHistoricalDataInputMethod: 'simulationInputs/setHistoricalDataInputMethod',
      setHistoricalRecordCount: 'simulationInputs/setHistoricalRecordCount',
      setMilestone: 'simulationInputs/setMilestone',
      setSimulationPeriods: 'simulationInputs/setSimulationPeriods',
      createEnsemble: 'ensembleGenerator/createEnsemble',
    }),
    updateHistoricalDataFromInput(event, index) {
      if (event.target.value === '') {
        event.target.value = 0;
      }

      const filteredValue = event.target.value.replace(/[^\-.0-9]/g, '');

      if (event.target.value !== filteredValue) {
        event.target.value = parseInt(filteredValue, 10);
      }

      this.historicalData[index] = event.target.value;
      this.setHistoricalData(this.historicalData);
    },
    updateMilestone(event) {
      this.setMilestone(event.target.value);
    },
    updateSimulationPeriods(event) {
      this.setSimulationPeriods(event.target.value);
    },
    updateHistoricalRecordCount(event) {
      this.setHistoricalRecordCount(event.target.value);
    },
    updateHistoricalDataFromText(event) {
      const filteredText = event.target.value.replace(/[^0-9\s\-.,;]/g, '');

      if (event.target.value !== filteredText) {
        event.target.value = filteredText;
      }

      this.setHistoricalDataFromText(event.target.value);
    },
    updateHistoricalDataInputMethod(event) {
      this.setHistoricalDataInputMethod(event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/responsive/mixins' as responsive;

.input-group {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 15px;

  .label-heading {
    font-weight: bold;
    margin-bottom: 5px;
  }

  input, textarea {
    background-color: color.$mutedVeryLight;
    padding: 5px;
    border: 1px solid color.$mutedLight;
    border-radius: 4px;
  }

  input[type=number] {
    width: 70px;
  }

  textarea {
    flex: 1;
    min-width: 95%;
  }

  small {
    margin-top: 5px;
    color: color.$mutedDark;
  }

  ol {
    &.digits-1 {
      padding-left: 12px;
    }

    &.digits-2 {
      padding-left: 20px;
    }

    &.digits-3 {
      padding-left: 28px;
    }

    &.digits-4 {
      padding-left: 36px;
    }

    > li::marker {
      color: color.$mutedDark;
    }

    li {
      margin-bottom: 5px;
    }
  }
}

@include responsive.breakpoint(medium) {
  .input-group {
    flex-direction: row;

    .label-heading {
      margin-bottom: 0;
    }

    label {
      flex-shrink: 0;
      width: 180px;
      margin-right: 10px;
    }

    textarea {
      min-width: 500px;
    }

    small {
      margin-left: 190px;
      flex-basis: 100%;
    }
  }
}
</style>
