<script setup>
import { computed, ref } from "vue";
import { DateTime } from "luxon";
import { timeMask } from "../helpers/timeHelpers";
import { useUserStore } from "../stores/user.store.js";

const props = defineProps({
  sumTime: {
    type: String,
    default: "0h",
  },
});

const userStore = useUserStore();
const reactiveSumTime = computed(() => props.sumTime);

const formatFrom = computed(
  () =>
    "Von  " +
    DateTime.fromISO(userStore.timeTablesDate.from).toLocaleString(
      DateTime.DATE_SHORT
    )
);

const formatTo = computed(
  () =>
    "Bis  " +
    DateTime.fromISO(userStore.timeTablesDate.to).toLocaleString(
      DateTime.DATE_SHORT
    )
);
</script>

<template>
  <div class="flex-container custom-flex q-py-lg">
    <div class="flex-container">
      <q-input
        standout
        style="max-width: 180px"
        class="q-mr-xl"
        v-model="formatFrom"
        readonly
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                today-btn
                :mask="timeMask"
                v-model="userStore.timeTablesDate.from"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input standout style="max-width: 160px" v-model="formatTo" readonly>
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                today-btn
                :mask="timeMask"
                v-model="userStore.timeTablesDate.to"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="text-h6">Insgesamt: {{ reactiveSumTime }}h</div>
  </div>
</template>

<style scoped>
.custom-flex {
  gap: 20px;
  justify-content: space-between;
  align-items: center;
}
</style>
