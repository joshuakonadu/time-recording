<script setup>
import { ref, computed } from "vue";
import { DateTime } from "luxon";
import TimeClock from "./TimeClock.vue";

const props = defineProps({
  from: {
    type: String,
    default: DateTime.now(),
  },
  to: {
    type: String,
    default: DateTime.now(),
  },
});

const emit = defineEmits(["changeFrom", "changeTo"]);

const changeFrom = (data) => {
  emit("changeFrom", data);
};
const changeTo = (data) => {
  emit("changeTo", data);
};
</script>

<template>
  <div class="flex-container custom-flex">
    <div class="time-from">Von</div>
    <TimeClock class="mr-sm" @change="changeFrom" :time="props.from" />
    <div class="time-to">Bis</div>
    <TimeClock class="q-mr-lg" @change="changeTo" :time="props.to" />
  </div>
</template>

<style scoped>
.custom-flex {
  align-items: center;
  gap: 16px;
}
</style>
