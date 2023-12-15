<script setup>
import { ref, watch } from "vue"
import TimeTable from "./TimeTable.vue"
import { DateTime } from "luxon"
import {testData, groupDatesByDay} from "../helpers/timeHelpers.js"

const columns = [
  { name: 'from', label: 'Von', field: 'from',format: (val, row) => DateTime.fromISO(val).toLocaleString(DateTime.TIME_24_SIMPLE) },
  { name: 'to', label: 'Bis', field: 'to', format: (val, row) => DateTime.fromISO(val).toLocaleString(DateTime.TIME_24_SIMPLE) },
  { name: 'project', label: 'Projekt', field: 'project' },
  { name: 'role', label: 'Rolle', field: 'role' },
  { name: 'description', label: 'Beschreibung', field: 'description' },
]

const groupedDates = ref(groupDatesByDay(testData))
</script>
<template>
  <div class="container">
    <div v-for="(data, index) in groupedDates" :key="data">
      <TimeTable 
        :data="data"
        :day="index"
        :columns="columns"
      />
    </div>
  </div>
</template>

<style>

</style>