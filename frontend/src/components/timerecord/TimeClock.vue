<script setup>
import { ref, computed } from "vue";
import { DateTime } from "luxon";
import { timeMask } from "../../helpers";

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
  return DateTime.fromISO(props.time).toLocaleString(DateTime.TIME_24_SIMPLE);
});
</script>

<template>
  <q-btn :color="props.btnColor" size="lg" stack flat icon="timer">
    {{ clockTime }}
    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
      <q-time :mask="timeMask" v-model="computedTime">
        <div class="row items-center justify-end">
          <q-btn v-close-popup label="Schliessen" color="primary" flat />
        </div>
      </q-time>
    </q-popup-proxy>
  </q-btn>
</template>
