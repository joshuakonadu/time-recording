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
  <div class="flex-container all-date custom-flex">
    <div class="time-wrapper all-date">
      <div class="time-from text-h5">Von</div>
      <TimeClockCalendar
        class="mr-sm"
        @change="changeFrom"
        :time="props.from"
      />
    </div>
    <div class="time-wrapper all-date">
      <div class="time-to text-h5">Bis</div>
      <TimeClockCalendar @change="changeTo" :time="props.to" />
    </div>
  </div>
</template>
