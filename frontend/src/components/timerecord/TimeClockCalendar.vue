<script setup>
import { useQuasar } from "quasar";
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
const platform = useQuasar().platform.is;

const isFirefox = platform.name.includes("firefox");
const computedTime = computed({
  get() {
    return props.time;
  },
  set(newValue) {
    emit("change", DateTime.fromISO(newValue).toString());
  },
});

const clockTime = computed(() => {
  return DateTime.fromISO(props.time).toLocaleString(DateTime.DATETIME_MED);
});
</script>

<template>
  <q-btn :color="props.btnColor" stack flat size="lg" icon="calendar_month">
    {{ clockTime }}
    <q-popup-proxy
      class="flex-custom"
      :class="{ 'flex-container': !isFirefox }"
      cover
      transition-show="scale"
      transition-hide="scale"
    >
      <q-time class="q-mr-xs" :mask="timeMask" v-model="computedTime" flat />
      <q-date v-model="computedTime" :mask="timeMask" color="purple">
        <div class="row items-center justify-end">
          <q-btn v-close-popup label="Schliessen" color="primary" flat />
        </div>
      </q-date>
    </q-popup-proxy>
  </q-btn>
</template>
