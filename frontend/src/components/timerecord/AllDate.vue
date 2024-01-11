<script setup>
import { DateTime } from "luxon";
import TimeClockCalendar from "./TimeClockCalendar.vue";

const props = defineProps({
  from: {
    type: String,
    default: DateTime.now().toString(),
  },
  to: {
    type: String,
    default: DateTime.now().toString(),
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
    <div class="time-from text-h5">Von</div>
    <TimeClockCalendar class="mr-sm" @change="changeFrom" :time="props.from" />
    <div class="time-to text-h5">Bis</div>
    <TimeClockCalendar @change="changeTo" :time="props.to" />
  </div>
</template>

<style scoped>
.custom-flex {
  align-items: center;
  gap: 40px;
}
</style>
