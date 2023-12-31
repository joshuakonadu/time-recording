import { watch, ref } from "vue";
import {
  groupDatesByDay,
  calculateTime,
  loadTimeTables,
} from "../helpers/timeHelpers.js";
import { useUserStore } from "src/stores/user.store.js";
import { useAlertStore } from "src/stores/alert.store.js";

export function useTimeTablesData() {
  const userStore = useUserStore();
  const alertStore = useAlertStore();
  const groupedTimeTablesData = ref(groupDatesByDay(userStore.timeTablesData));
  const calculateAllTime = ref(calculateTime(userStore.timeTablesData));
  watch(
    () => userStore.timeTablesData,
    (newVal) => {
      groupedTimeTablesData.value = groupDatesByDay(newVal);
      calculateAllTime.value = calculateTime(newVal);
    }
  );

  watch(
    () => userStore.timeTablesDate,
    async () => {
      try {
        await loadTimeTables();
        alertStore.success("Erfolgreich geladen", 1500);
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
