<script setup>
import { computed } from 'vue'
import { DateTime, Interval } from "luxon"

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  day:{
    type: String,
    required: true
  }
})
const sumTime = computed(()=>{
  const sumAllminutes = props.data.reduce((acc,obj)=>{
    const from = DateTime.fromISO(obj.from)
    const to = DateTime.fromISO(obj.to)
    acc += Interval.fromDateTimes(from, to).length('minutes')
    return acc
  },0)
  const hours = (Math.floor(sumAllminutes/60)).toString().padStart(2,'0');
  const minutes = (Math.floor(sumAllminutes)%60).toString().padStart(2,'0');
  return `${hours}:${minutes}`
})
</script>
<template>
  <q-table
    :title="`${DateTime.fromISO(props.day).toLocaleString(DateTime.DATE_HUGE)} (${sumTime}h)`"
    :rows="data"
    :columns="columns"
    row-key="name"
    :hide-bottom="true"
    class="q-mb-lg"
  />
</template>

<style>

</style>