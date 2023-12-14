<script setup>
import { ref, computed } from 'vue'
import TimeBlock from './TimeBlock.vue'
import { DateTime, Interval } from "luxon"

function getTimeNow(){
    return DateTime.now().toString();
}
const from = ref(getTimeNow())
const to = ref(getTimeNow())

const changeFrom = (data) =>{
  from.value = data;
}

const changeTo = (data) =>{
  to.value = data;
}

const timeDiff = computed(()=>{
  const minutesDiff = Interval.fromDateTimes(DateTime.fromISO(from.value),DateTime.fromISO(to.value)).length('minute');
  if(isNaN(minutesDiff)) return '00:00'
  const hours = (Math.floor(minutesDiff/60)).toString().padStart(2,'0');
  const minutes = (Math.floor(minutesDiff)%60).toString().padStart(2,'0');
  return `${hours}:${minutes}`
})

</script>

<template>
  <div class="time-calculator q-mt-lg q-mb-lg">
    <div class="time-from">Von</div>
    <TimeBlock class="mr-sm" @change="changeFrom" :time="from" />
    <div class="time-to">
      Bis
    </div>
    <TimeBlock class="mr-sm" @change="changeTo" :time="to" />

    <div class="time-diff">
      <span>{{timeDiff}}</span>
    </div>
  </div>
</template>

<style scoped>
.time-calculator{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.time-from{
    font-size: 1.6rem;
    margin-right: 0.5em;
}

.time-to{
    font-size: 1.6rem;
    margin-right: 0.5em;
}
.mr-sm{
    margin-right: 0.5em;
}
.time-diff{
    font-size: 1.6rem;
}
</style>