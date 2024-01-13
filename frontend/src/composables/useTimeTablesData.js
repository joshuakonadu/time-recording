import { watch, ref } from "vue";
import { groupDatesByDay, calculateTime, loadTimeTables } from "../helpers";
import { useUserStore, useAlertStore } from "src/stores";

export function useTimeTablesData() {
  const userStore = useUserStore();
  const alertStore = useAlertStore();
  const groupedTimeTablesData = ref(groupDatesByDay(userStore.timeTablesData));
  const calculateAllTime = ref(calculateTime(userStore.timeTablesData));
  watch(
    () => userStore.timeTablesData,
    (newVal) => {
      groupedTimeTablesData.value = groupDatesByDay(newVal);
    }
  );

  watch(
    () => userStore.timeTablesData,
    (newVal) => {
      calculateAllTime.value = calculateTime(newVal);
    },
    {
      deep: true,
    }
  );

  watch(
    () => userStore.selectedTimeRange,
    async () => {
      try {
        await loadTimeTables();
        alertStore.success("Erfolgreich geladen", 2500);
      } catch (err) {
        alertStore.error("Laden Fehlgeschlagen", 3000);
      }
    },
    {
      deep: true,
    }
  );

  return {
    groupedTimeTablesData,
    calculateAllTime,
  };
}
