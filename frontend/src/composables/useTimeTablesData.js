import { watch, reactive } from 'vue'
import { testData, groupDatesByDay } from "../helpers/timeHelpers.js"

const timeTablesData = reactive([]);

export function useTimeTablesData(){
  const groupedTimeTablesData = reactive({})

  const setTimeTablesData = (newData)=>{
    newData.forEach(element => {
      timeTablesData.push(element)
    });
  }

  setTimeout(() => {
    setTimeTablesData(testData)
  }, 3000);
  
  watch(timeTablesData, (newVal)=>{
    Object.keys(groupedTimeTablesData).forEach((key)=> delete groupedTimeTablesData[key])
    Object.assign(groupedTimeTablesData, groupDatesByDay(newVal))
  })
  return{
    timeTablesData,
    groupedTimeTablesData,
    setTimeTablesData
  }
}