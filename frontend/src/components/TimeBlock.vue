<script setup>
import { ref, computed } from 'vue'
import { DateTime } from "luxon"

const props = defineProps({
  time: {
    type: Object,
    default: DateTime.now()
  }
})

const emit = defineEmits(['change'])

const computedTime = computed({
    get(){
        return DateTime.fromISO(props.time).toLocaleString({ hour: '2-digit', minute: '2-digit' })
    },
    set(newValue){
        emit('change', DateTime.fromISO(newValue))
    }
})

</script>

<template>
  <div class="time-block">
    {{ computedTime }}
    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
        <q-time v-model="computedTime">
            <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
        </q-time>
    </q-popup-proxy>
  </div>
</template>

<style scoped>
.time-block{
    border: 2px solid;
    padding: 14px;
    font-size: 1.6rem;
    cursor: pointer;
}
</style>