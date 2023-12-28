<script setup>
import { ref, computed } from "vue";
import TimeBlock from "./TimeBlock.vue";
import { DateTime, Interval } from "luxon";
import { useTimeTablesData } from "../composables/useTimeTablesData.js";
import { useUserStore } from "../stores/user.store";
import router from "../router";

const userStore = useUserStore();

const workspaceId = router.currentRoute.value.params?.id;

function getTimeNow() {
  return DateTime.now().toString();
}
const from = ref(getTimeNow());
const to = ref(getTimeNow());
const selectedProject = ref(null);
const selectedRole = ref(null);
const description = ref(null);

const { addNewData } = useTimeTablesData();

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

const saveNewTimeEntry = () => {
  if (!from.value || !to.value || !description.value) {
    //TODO: TOAST NOTIFICATION (WARNING)
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
  //TODO POST NEW DATA TO API AND GET THE NEW DATA FROM BACKEND
  addNewData(newData);
  //TODO TOAST NOTIFICATION (SUCCESS)
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
      v-if="userStore.activeWorkspace.projectOption.length"
      class="select-container q-mr-md ov-hidden"
    >
      <q-select
        v-model="selectedProject"
        :options="userStore.activeWorkspace.projectOption"
        label="Projekt"
      />
    </div>
    <div
      v-if="userStore.activeWorkspace.roleOption.length"
      class="select-container q-mr-lg ov-hidden"
    >
      <q-select
        v-model="selectedRole"
        :options="userStore.activeWorkspace.roleOption"
        label="Rolle"
      />
    </div>
    <div class="time-from">Von</div>
    <TimeBlock class="mr-sm" @change="changeFrom" :time="from" />
    <div class="time-to">Bis</div>
    <TimeBlock class="q-mr-lg" @change="changeTo" :time="to" />

    <div class="time-diff">
      <q-btn
        @click="saveNewTimeEntry"
        color="primary"
        icon-right="approval"
        size="lg"
        :label="`${timeDiff}h buchen`"
      />
    </div>
  </div>
</template>

<style scoped>
.time-calculator {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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
  margin-left: 5px;
}
</style>
