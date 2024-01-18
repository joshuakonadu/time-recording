<script setup>
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
  <div class="flex-container same-date custom-flex">
    <div class="time-from text-h5">Von</div>
    <TimeClock class="mr-sm" @change="changeFrom" :time="props.from" />
    <div class="time-to text-h5">Bis</div>
    <TimeClock @change="changeTo" :time="props.to" />
  </div>
</template>
