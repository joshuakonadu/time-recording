<script setup>
import { computed, watch } from 'vue'
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

watch(()=>props.data,(newVal,oldVal)=>{
  console.log(newVal[0]);
},{
  deep:true
})
</script>

<template>
  <q-table
    :title="`${DateTime.fromISO(props.day).toLocaleString(DateTime.DATE_HUGE)} (${sumTime}h)`"
    :rows="props.data"
    :columns="columns"
    row-key="name"
    :hide-bottom="true"
    class="q-mb-lg"
  >
  <template v-slot:body="props">
    <q-tr :props="props">
      <q-td key="from" :props="props">
        {{ props.cols[0].format(props.row.from) }}
        <q-popup-edit v-model="props.row.from" title="Edit the Name" auto-save v-slot="scope">
          <q-time mask="YYYY-MM-DDTHH:mm" v-model="scope.value">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-edit>
      </q-td>
      <q-td key="to" :props="props">
        {{ props.cols[0].format(props.row.to) }}
        <q-popup-edit v-model="props.row.to" title="Edit the Name" auto-save v-slot="scope">
          <q-time mask="YYYY-MM-DDTHH:mm" v-model="scope.value">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-edit>
      </q-td>
      <q-td key="project" :props="props">
        {{ props.row.project }}
        <q-popup-edit v-model="props.row.project" auto-save v-slot="scope">
          <div class="text-italic text-primary q-mb-xs">
            My Custom Title
          </div>
          <q-input type="text" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
        </q-popup-edit>
      </q-td>
      <q-td key="role" :props="props">
        {{ props.row.role }}
        <q-popup-edit v-model="props.row.role" auto-save v-slot="scope">
          <div class="text-italic text-primary q-mb-xs">
            My Custom Title
          </div>
          <q-input type="text" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
        </q-popup-edit>
      </q-td>
      <q-td key="description" :props="props">
        {{ props.row.description }}
        <q-popup-edit v-model="props.row.description" auto-save v-slot="scope">
          <div class="text-italic text-primary q-mb-xs">
            My Custom Title
          </div>
          <q-input type="text" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
        </q-popup-edit>
      </q-td>
    </q-tr>
  </template>
  </q-table>
</template>

<style>

</style>