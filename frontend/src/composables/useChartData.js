import { computed, watch } from "vue";
import { DateTime } from "luxon";
import { useUserStore } from "src/stores";
import { calculateTimeNumber, minutesInHoursMinutes } from "../helpers";
import { colors, chartLabels } from "../helpers";

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
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Stunden pro Wochentag",
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

  const chartOptionsProjectPie = computed(() => {
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
        title: {
          display: true,
          text: "Projekte",
        },
      },
    };
  });

  const chartOptionsRolePie = computed(() => {
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
        title: {
          display: true,
          text: "Rollen",
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
        backgroundColor: colors,
      },
    ];
    return {
      labels: chartLabels[labels],
      datasets: finalData,
    };
  });

  const pieChartProjectData = computed(() => {
    let index = 0;
    const indexMap = {};
    const labels = [];
    const data = [];
    userStore.timeTablesData.forEach((timeObj) => {
      if (!labels.includes(timeObj.project)) {
        labels.push(timeObj.project);
        indexMap[timeObj.project] = index;
        const calcTime = calculateTimeNumber(timeObj);
        data[index++] = calcTime;
      } else {
        data[indexMap[timeObj.project]] += calculateTimeNumber(timeObj);
      }
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
        },
      ],
    };
  });

  const pieChartRoleData = computed(() => {
    let index = 0;
    const indexMap = {};
    const labels = [];
    const data = [];
    userStore.timeTablesData.forEach((timeObj) => {
      if (!labels.includes(timeObj.role)) {
        labels.push(timeObj.role);
        indexMap[timeObj.role] = index;
        const calcTime = calculateTimeNumber(timeObj);
        data[index++] = calcTime;
      } else {
        data[indexMap[timeObj.role]] += calculateTimeNumber(timeObj);
      }
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
        },
      ],
    };
  });

  watch(dateLabels, (newVal) => {
    labels = newVal;
  });

  return {
    chartOptions,
    barChartData,
    pieChartProjectData,
    chartOptionsProjectPie,
    pieChartRoleData,
    chartOptionsRolePie,
  };
}
