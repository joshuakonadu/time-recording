<script setup>
import { ref, computed } from "vue";
import { DateTime } from "luxon";

const props = defineProps({
  time: {
    type: String,
    default: DateTime.now(),
  },
  btnColor: {
    type: String,
    default: "purple",
  },
});

const emit = defineEmits(["change"]);

const computedTime = computed({
  get() {
    return props.time;
  },
  set(newValue) {
    emit("change", DateTime.fromISO(newValue).toString());
  },
});

const clockTime = computed(() => {
  return DateTime.fromISO(props.time).toLocaleString({
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
});
</script>

<template>
  <q-btn
    class="time-clock"
    round
    :color="props.btnColor"
    stack
    glossy
    icon="timer"
  >
    {{ clockTime }}
    <q-popup-proxy
      class="flex-container flex-custom q-mt-md"
      cover
      transition-show="scale"
      transition-hide="scale"
    >
      <q-time
        class="q-mr-xs"
        mask="YYYY-MM-DDTHH:mm:ss"
        v-model="computedTime"
        flat
      />
      <q-date v-model="computedTime" mask="YYYY-MM-DDTHH:mm:ss" color="purple">
        <div class="row items-center justify-end">
          <q-btn v-close-popup label="Close" color="primary" flat />
        </div>
      </q-date>
    </q-popup-proxy>
  </q-btn>
</template>

<style scoped>
.time-clock {
  width: 64px;
  height: 64px;
}
</style>
