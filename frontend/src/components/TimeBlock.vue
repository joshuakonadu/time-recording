<script setup>
import { ref, computed } from 'vue'
import { DateTime } from "luxon"

const props = defineProps({
  time: {
    type: String,
    default: DateTime.now()
  },
  btnColor:{
    type: String,
    default: 'purple'
  }
})

const emit = defineEmits(['change'])

const computedTime = computed({
  get(){
    return DateTime.fromISO(props.time).toLocaleString({ hour: '2-digit', minute: '2-digit' })
  },
  set(newValue){
    emit('change', DateTime.fromISO(newValue).toString())
  }
})

</script>

<template>
  <q-btn class="time-block" round :color="props.btnColor" stack glossy icon="timer">
    {{ computedTime }}
    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
      <q-time v-model="computedTime">
        <div class="row items-center justify-end">
          <q-btn v-close-popup label="Close" color="primary" flat />
        </div>
      </q-time>
    </q-popup-proxy>
  </q-btn>
</template>

<style scoped>
.time-block{
  width: 64px;
  height: 64px;
}
</style>