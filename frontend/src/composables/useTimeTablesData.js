import { watch, ref } from "vue";
import { testData, groupDatesByDay } from "../helpers/timeHelpers.js";

const timeTablesData = ref([]);

export function useTimeTablesData() {
  const groupedTimeTablesData = ref({});

  const setTimeTablesData = (newData) => {
    timeTablesData.value = newData;
  };
  const addNewData = (newData) => {
    //TODO POST NEW DATA TO API AND SET RETURNED VALUE TO timeTablesData
    timeTablesData.value = [newData, ...timeTablesData.value];
  };

  setTimeout(() => {
    setTimeTablesData(testData);
  }, 3000);

  watch(timeTablesData, (newVal) => {
    groupedTimeTablesData.value = groupDatesByDay(newVal);
  });
  return {
    timeTablesData,
    groupedTimeTablesData,
    setTimeTablesData,
    addNewData,
  };
}
