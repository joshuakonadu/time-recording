import { watch, ref } from "vue";
import { groupDatesByDay } from "../helpers/timeHelpers.js";
import { useUserStore } from "src/stores/user.store.js";
import { addTimeRecord } from "src/service/timerecords.service.js";

export function useTimeTablesData() {
  const userStore = useUserStore();
  const groupedTimeTablesData = ref({});
  const addNewData = async (data) => {
    const apiData = await addTimeRecord(data);
    userStore.addNewTimeData(apiData.data);
  };
  watch(
    () => userStore.timeTablesData,
    (newVal) => {
      groupedTimeTablesData.value = groupDatesByDay(newVal);
    }
  );
  return {
    groupedTimeTablesData,
    addNewData,
  };
}
