<script setup>
import { computed, ref } from "vue";
import { DateTime } from "luxon";
import { timeMask } from "../../helpers";
import { useUserStore } from "../../stores";

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
  <div class="flex-container time-range custom-flex q-py-lg">
    <div class="flex-container custom-gap">
      <q-input
        standout
        class="custom-cursor"
        style="max-width: 180px"
        v-model="formatFrom"
        readonly
      >
        <template v-slot:append>
          <q-icon name="event" color="accent" class="cursor-pointer"> </q-icon>
        </template>
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
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
      </q-input>

      <q-input
        standout
        class="q-mr-lg custom-cursor"
        style="max-width: 180px"
        v-model="formatTo"
        readonly
      >
        <template v-slot:append>
          <q-icon name="event" color="accent" class="cursor-pointer"> </q-icon>
        </template>
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
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
      </q-input>
      <div
        v-if="userStore.activeWorkspace.projectOption?.length"
        class="select-wrapper"
      >
        <q-select
          v-model="userStore.selectedProjectFilter"
          :options="userStore.activeWorkspace.projectOption"
          label="Projekt"
          clearable
          filled
        />
      </div>
      <div
        v-if="userStore.activeWorkspace.roleOption?.length"
        class="select-wrapper"
      >
        <q-select
          v-model="userStore.selectedRoleFilter"
          :options="userStore.activeWorkspace.roleOption"
          label="Rolle"
          filled
          clearable
        />
      </div>
    </div>
    <div class="text-h6">Insgesamt: {{ reactiveSumTime }}h</div>
  </div>
</template>
