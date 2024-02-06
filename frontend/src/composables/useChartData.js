import { computed, watch } from "vue";
import { DateTime } from "luxon";
import { useUserStore } from "src/stores";
import { calculateTimeNumber, minutesInHoursMinutes } from "../helpers";
import { chartLabels, shuffleColors } from "../helpers";

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
          text: `Stunden pro ${
            dateLabels.value === "month" ? "Monat" : "Wochentag"
          }`,
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
    const data = new Array(chartLabels[labels].length).fill(0);
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
    const finalData = [
      {
        data: data,
        backgroundColor: shuffleColors(),
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
      if (timeObj.project === null) {
        index = handleUnsetRoleOrProject({
          labels,
          data,
          indexMap,
          timeObj,
          index,
        });
      } else {
        index = handleRoleOrProject({
          data,
          labels,
          timeObj,
          prop: "project",
          indexMap,
          index,
        });
      }
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: shuffleColors(),
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
      if (timeObj.role === null) {
        index = handleUnsetRoleOrProject({
          labels,
          data,
          indexMap,
          timeObj,
          index,
        });
      } else {
        index = handleRoleOrProject({
          data,
          labels,
          timeObj,
          prop: "role",
          indexMap,
          index,
        });
      }
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: shuffleColors(),
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

const handleUnsetRoleOrProject = ({
  labels,
  data,
  indexMap,
  timeObj,
  index,
}) => {
  if (labels.includes("Nicht ausgewählt")) {
    data[indexMap["Nicht ausgewählt"]] += calculateTimeNumber(timeObj);
  } else {
    labels.push("Nicht ausgewählt");
    indexMap["Nicht ausgewählt"] = index;
    const calcTime = calculateTimeNumber(timeObj);
    data[index++] = calcTime;
  }
  return index;
};

const handleRoleOrProject = ({
  data,
  labels,
  timeObj,
  prop,
  indexMap,
  index,
}) => {
  if (!labels.includes(timeObj[prop])) {
    labels.push(timeObj[prop]);
    indexMap[timeObj[prop]] = index;
    const calcTime = calculateTimeNumber(timeObj);
    data[index++] = calcTime;
  } else {
    data[indexMap[timeObj[prop]]] += calculateTimeNumber(timeObj);
  }
  return index;
};
