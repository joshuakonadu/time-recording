<script setup>
import { ref, computed, defineAsyncComponent } from "vue";
import { DateTime, Interval } from "luxon";
import { useUserStore } from "../../stores/user.store";
import { useAlertStore } from "../../stores/alert.store";
import { addNewTimeRecord } from "../../helpers/timeHelpers.js";
import router from "../../router";

const userStore = useUserStore();
const alertStore = useAlertStore();

const workspaceId = router.currentRoute.value.params?.id;

const dateModes = {
  "24h": defineAsyncComponent(() => import("./SameDate.vue")),
  all: defineAsyncComponent(() => import("./AllDate.vue")),
};

const activeDateMode = computed(() => {
  return dateModes[userStore.activeWorkspace.mode];
});

function getTimeNow() {
  return DateTime.now().toString();
}
const from = ref(getTimeNow());
const to = ref(getTimeNow());
const selectedProject = ref(null);
const selectedRole = ref(null);
const description = ref(null);

const changeFrom = (data) => {
  from.value = data;
};

const changeTo = (data) => {
  to.value = data;
};

const timeDiff = computed(() => {
  const minutesDiff = Interval.fromDateTimes(
    DateTime.fromISO(from.value),
    DateTime.fromISO(to.value)
  ).length("minute");
  if (isNaN(minutesDiff)) return "00:00";
  const hours = Math.floor(minutesDiff / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (Math.floor(minutesDiff) % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
});

const saveNewTimeEntry = async () => {
  if (!from.value || !to.value || !description.value) {
    alertStore.info("Bitte Beschreibung hinzufügen");
    return;
  }
  const newData = {
    from: from.value,
    to: to.value,
    project: selectedProject.value,
    role: selectedRole.value,
    description: description.value,
    workspaceId,
  };
  await addNewTimeRecord(newData);
  alertStore.success("Neuer Eintrag erfolgreich");
  clearValue();
};

const clearValue = () => {
  description.value = null;
  selectedProject.value = null;
  selectedRole.value = null;
};
</script>

<template>
  <div class="time-calculator q-mt-lg q-mb-xl container">
    <div class="input-container">
      <q-input v-model="description" label="Beschreibung" />
    </div>
    <div
      v-if="userStore.activeWorkspace.projectOption?.length"
      class="select-container q-mr-md ov-hidden"
    >
      <q-select
        v-model="selectedProject"
        :options="userStore.activeWorkspace.projectOption"
        label="Projekt"
      />
    </div>
    <div
      v-if="userStore.activeWorkspace.roleOption?.length"
      class="select-container q-mr-lg ov-hidden"
    >
      <q-select
        v-model="selectedRole"
        :options="userStore.activeWorkspace.roleOption"
        label="Rolle"
      />
    </div>
    <div class="flex-container flex-100 q-mt-xl q-mb-xl">
      <component
        :is="activeDateMode"
        @changeFrom="changeFrom"
        @changeTo="changeTo"
        :from="from"
        :to="to"
      />

      <div class="time-diff">
        <q-btn
          @click="saveNewTimeEntry"
          color="primary"
          icon-right="fa-solid fa-stamp"
          flat
          size="lg"
          :label="`${timeDiff}h buchen`"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.time-calculator {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border: 8px dashed $secondary;
  padding: 33px;
}

.time-from {
  font-size: 1rem;
  margin-right: 0.5em;
}

.time-to {
  font-size: 1rem;
  margin-right: 0.5em;
}
.mr-sm {
  margin-right: 0.5em;
}
.time-diff {
  font-size: 1rem;
}
.input-container {
  flex: auto;
  margin-right: 1.5em;
}
.select-container {
  width: 150px;
}

:deep(.q-field__control-container) {
  overflow: hidden;
}
:deep(.on-right) {
  margin-left: 10px;
}

.flex-100 {
  flex: 0 0 100%;
  justify-content: center;
  align-items: center;
}
</style>
