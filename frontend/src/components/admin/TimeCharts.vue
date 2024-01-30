<script setup>
import { ref } from "vue";
import useChartData from "../../composables/useChartData.js";
import { useTimeTablesData } from "../../composables/useTimeTablesData.js";
import { Bar, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { useUserStore } from "../../stores/user.store.js";
ChartJS.register(
  Title,
  Tooltip,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale
);

const userStore = useUserStore();
const dateLabels = ref("weekday");
userStore.setTimeRange("month");
const selectTimeRange = ref("Diesen Monat");
const { calculateAllTime } = useTimeTablesData();
const { chartOptions, barChartData } = useChartData(dateLabels);
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
      <q-select
        style="width: 300px"
        @update:model-value="(val) => changeTimeRange(val)"
        v-model="selectTimeRange"
        :options="selectTimeRangeOptions"
        label="Zeitraum"
      />
    </div>
    <div class="q-mb-lg" style="background: #ffffff; padding: 28px">
      <Bar id="my-chart-bar-id" :options="chartOptions" :data="barChartData" />
    </div>

    <div style="background: #ffffff; padding: 28px">
      <Line
        id="my-chart-line-id"
        :options="chartOptions"
        :data="barChartData"
      />
    </div>
  </div>
</template>
