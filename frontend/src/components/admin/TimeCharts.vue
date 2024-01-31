<script setup>
import { ref } from "vue";
import useChartData from "../../composables/useChartData.js";
import { useTimeTablesData } from "../../composables/useTimeTablesData.js";
import { Bar, Line, Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
} from "chart.js";
import { useUserStore } from "../../stores/user.store.js";
ChartJS.register(
  Title,
  Tooltip,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Legend
);

const userStore = useUserStore();
const dateLabels = ref("weekday");
userStore.setTimeRange("month");
const selectTimeRange = ref("Diesen Monat");
const barType = ref("bar");
const { calculateAllTime } = useTimeTablesData();
const {
  chartOptions,
  barChartData,
  pieChartProjectData,
  chartOptionsProjectPie,
  pieChartRoleData,
  chartOptionsRolePie,
} = useChartData(dateLabels);
const selectTimeRangeOptions = ["Diese Woche", "Diesen Monat", "Dieses Jahr"];

const changeTimeRange = (val) => {
  const selectedTime = val.split(" ")[1];
  switch (selectedTime) {
    case "Woche":
      userStore.setTimeRange("week");
      dateLabels.value = "weekday";
      break;
    case "Monat":
      userStore.setTimeRange("month");
      dateLabels.value = "weekday";
      break;
    case "Jahr":
      userStore.setTimeRange("year");
      dateLabels.value = "month";
      break;
  }
};
</script>

<template>
  <div>
    <div class="flex items-end justify-between q-mb-xl">
      <div>
        <span class="text-h5">Insgesamt: {{ calculateAllTime }}</span>
      </div>
      <div>
        <q-btn-toggle
          v-model="barType"
          class="my-custom-toggle"
          no-caps
          rounded
          unelevated
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="[
            { slot: 'bar', value: 'bar' },
            { slot: 'line', value: 'line' },
          ]"
        >
          <template v-slot:bar>
            <q-icon name="fa-solid fa-chart-simple">
              <q-tooltip> Bar Chart </q-tooltip>
            </q-icon>
          </template>

          <template v-slot:line>
            <q-icon name="fa-solid fa-chart-line">
              <q-tooltip> Line Chart </q-tooltip>
            </q-icon>
          </template>
        </q-btn-toggle>
      </div>
      <q-select
        style="width: 300px"
        @update:model-value="(val) => changeTimeRange(val)"
        v-model="selectTimeRange"
        :options="selectTimeRangeOptions"
        label="Zeitraum"
      />
    </div>
    <div
      v-if="barType === 'bar'"
      class="q-mb-lg"
      style="background: #ffffff; padding: 28px"
    >
      <Bar id="my-chart-bar-id" :options="chartOptions" :data="barChartData" />
    </div>
    <div
      v-else-if="barType === 'line'"
      class="q-mb-lg"
      style="background: #ffffff; padding: 28px"
    >
      <Line
        id="my-chart-line-id"
        :options="chartOptions"
        :data="barChartData"
      />
    </div>
    <div
      class="q-mb-lg flex justify-center"
      style="background: #ffffff; padding: 28px; max-height: 500px"
    >
      <Pie :data="pieChartProjectData" :options="chartOptionsProjectPie" />
    </div>

    <div
      class="q-mb-lg flex justify-center"
      style="background: #ffffff; padding: 28px; max-height: 500px"
    >
      <Pie :data="pieChartRoleData" :options="chartOptionsRolePie" />
    </div>
  </div>
</template>
