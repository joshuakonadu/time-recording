import { computed, watch } from "vue";
import { DateTime } from "luxon";
import { useUserStore } from "src/stores";
import { calculateTimeNumber, minutesInHoursMinutes } from "../helpers";

const chartLabels = {
  weekday: [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ],
  month: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
};

export default function useChartData(dateLabels) {
  const userStore = useUserStore();
  let labels = dateLabels.value;
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
    const data = [];
    const times = [...userStore.timeTablesData].reverse();
    if (!times.length) {
      return {
        labels: chartLabels[labels],
        datasets: [],
      };
    }
    times.forEach((timeObj) => {
      const dateIndex = DateTime.fromISO(timeObj.from)[labels] - 1;
      const calculateTime = calculateTimeNumber(timeObj);
      data[dateIndex] =
        data[dateIndex] === undefined
          ? calculateTime
          : data[dateIndex] + calculateTime;
    });
    for (let i = 0; i < data.length; i++) {
      if (data[i] === undefined) {
        data[i] = 0;
      }
    }
    const finalData = [
      {
        data: data,
        backgroundColor: "#27aeef",
      },
    ];
    return {
      labels: chartLabels[labels],
      datasets: finalData,
    };
  });

  watch(dateLabels, (newVal) => {
    labels = newVal;
  });

  return {
    chartOptions,
    barChartData,
  };
}
