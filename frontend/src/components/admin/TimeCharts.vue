<script setup>
import { computed } from "vue";
import { calculateTimeNumber, minutesInHoursMinutes } from "../../helpers";
import { useUserStore } from "src/stores";
import { DateTime } from "luxon";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

const userStore = useUserStore();

const testLabel = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

const chartOptions = computed(() => {
  return {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (data) => {
            return `Zeit: ${minutesInHoursMinutes(data.raw)}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback(value) {
            return minutesInHoursMinutes(value);
          },
        },
      },
    },
  };
});

const barChartData = computed(() => {
  const data = [[]];
  const times = [...userStore.timeTablesData].reverse();
  times.forEach((timeObj) => {
    const weekdayIndex = DateTime.fromISO(timeObj.from).weekday - 1;
    const calculateTime = calculateTimeNumber(timeObj);
    const emptyIndex = data.findIndex((list) => {
      return list[weekdayIndex] === undefined;
    });
    if (emptyIndex >= 0) {
      data[emptyIndex][weekdayIndex] = calculateTime;
    } else {
      data.push([]);
      data.at(-1)[weekdayIndex] = calculateTime;
    }
  });

  const finalData = [];

  for (let i = 0; i < data.length; i++) {
    finalData.push({
      data: data[i],
    });
  }

  return {
    labels: testLabel,
    datasets: finalData,
  };
});
</script>

<template>
  <div style="background: #ffffff; padding: 28px">
    <Bar id="my-chart-id" :options="chartOptions" :data="barChartData" />
  </div>
</template>
