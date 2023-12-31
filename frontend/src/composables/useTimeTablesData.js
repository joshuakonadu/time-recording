import { watch, ref } from "vue";
import { groupDatesByDay, calculateTime } from "../helpers/timeHelpers.js";
import { useUserStore } from "src/stores/user.store.js";

export function useTimeTablesData() {
  const userStore = useUserStore();
  const groupedTimeTablesData = ref(groupDatesByDay(userStore.timeTablesData));
  const calculateAllTime = ref(calculateTime(userStore.timeTablesData));
  watch(
    () => userStore.timeTablesData,
    (newVal) => {
      groupedTimeTablesData.value = groupDatesByDay(newVal);
      calculateAllTime.value = calculateTime(newVal);
    }
  );
  return {
    groupedTimeTablesData,
    calculateAllTime,
  };
}
