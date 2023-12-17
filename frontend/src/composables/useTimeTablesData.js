import { watch, ref } from 'vue'
import { testData, groupDatesByDay } from "../helpers/timeHelpers.js"

const timeTablesData = ref([]);

export function useTimeTablesData(){
  const groupedTimeTablesData = ref({})

  const setTimeTablesData = (newData)=>{
    timeTablesData.value = newData
  }

  setTimeout(() => {
    setTimeTablesData(testData)
  }, 3000);
  
  watch(timeTablesData, (newVal)=>{
    groupedTimeTablesData.value = groupDatesByDay(newVal)
  })
  return{
    timeTablesData,
    groupedTimeTablesData,
    setTimeTablesData
  }
}