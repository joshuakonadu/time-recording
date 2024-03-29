<script setup>
import { ref, computed, markRaw, onMounted } from "vue";
import { DateTime, Interval } from "luxon";
import { useUserStore, useAlertStore } from "../../stores";
import {
  adminAddNewTimeRecord,
  notifyNewTimeToAdmins,
  NotifyNewTimeToUser,
} from "../../helpers";
import AllDate from "../timerecord/AllDate.vue";

const props = defineProps({
  memberId: {
    type: String,
    required: true,
  },
});

const userStore = useUserStore();
const alertStore = useAlertStore();

const reactiveMemberId = computed(() => props.memberId);

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
  const workspaceId = userStore.activeWorkspace._id;
  const newData = {
    from: from.value,
    to: to.value,
    project: selectedProject.value,
    role: selectedRole.value,
    description: description.value,
    workspaceId,
    userId: reactiveMemberId.value,
  };
  try {
    const newTime = await adminAddNewTimeRecord(newData);
    alertStore.success("Neuer Eintrag erfolgreich");
    notifyNewTimeToAdmins(newTime);
    NotifyNewTimeToUser(newTime);
  } catch (err) {
    alertStore.error("Neuer Eintrag fehlgeschlagen", 3000);
  } finally {
    clearValue();
    from.value = to.value;
  }
};

const clearValue = () => {
  description.value = null;
  selectedProject.value = null;
  selectedRole.value = null;
};
</script>

<template>
  <div class="time-calculator admin align-end">
    <div class="input-container">
      <q-input v-model="description" autogrow label="Beschreibung" />
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
    <div class="flex-container flex-100 q-mt-xl">
      <AllDate
        @changeFrom="changeFrom"
        @changeTo="changeTo"
        :from="from"
        :to="to"
      />
      <div class="time-diff">
        <button @click="saveNewTimeEntry" type="button" class="add-time-btn">
          <span>{{ timeDiff }}H</span>
        </button>
      </div>
    </div>
  </div>
</template>
