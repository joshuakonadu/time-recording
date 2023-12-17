<script setup>
import { ref, watch, toRaw } from "vue"
import TimeTable from "./TimeTable.vue"
import { DateTime } from "luxon"
import { useTimeTablesData } from "../composables/useTimeTablesData.js"

const { groupedTimeTablesData } = useTimeTablesData();
let changedIndex = null
let changedData = null

const columns = [
  { name: 'from', label: 'Von', field: 'from',format: (val, row) => DateTime.fromISO(val).toLocaleString(DateTime.TIME_24_SIMPLE) },
  { name: 'to', label: 'Bis', field: 'to', format: (val, row) => DateTime.fromISO(val).toLocaleString(DateTime.TIME_24_SIMPLE) },
  { name: 'project', label: 'Projekt', field: 'project' },
  { name: 'role', label: 'Rolle', field: 'role' },
  { name: 'description', label: 'Beschreibung', field: 'description' },
]

const indexOfChangedIndex = (index)=>{
  changedIndex = index
}
const changedList = (data)=>{
  updateChangedObject(toRaw(data))
}
const updateChangedObject = (data)=>{
  try{
    console.log(data[changedIndex]);
    //editTimeObject(data[changedIndex])
    //success notification
    changedIndex = null;
  } catch(err){
    console.error(err)
    //reload all data
  }
}
</script>
<template>
  <div class="container">
    <div v-for="(data, index) in groupedTimeTablesData" :key="data">
      <TimeTable 
        :data="data"
        :day="index"
        :columns="columns"
        @changeIndex="indexOfChangedIndex"
        @changedList="changedList"
      />
    </div>
  </div>
</template>

<style>

</style>