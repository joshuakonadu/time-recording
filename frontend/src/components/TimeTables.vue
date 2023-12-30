<script setup>
import { ref, watch, toRaw, computed } from "vue";
import TimeTable from "./TimeTable.vue";
import { DateTime } from "luxon";
import { useTimeTablesData } from "../composables/useTimeTablesData.js";
import { useUserStore } from "../stores/user.store";
import { useAlertStore } from "../stores/alert.store";
import { updateTimeRecord, getTimesByWorkspaceUser } from "../service";
import router from "../router";

const userStore = useUserStore();
const alertStore = useAlertStore();
const { groupedTimeTablesData, calculateAllTime } = useTimeTablesData();
const changedDataState = {
  index: null,
};

const initColumns = [
  {
    name: "from",
    label: "Von",
    field: "from",
    format: (val, row) =>
      DateTime.fromISO(val).toLocaleString(DateTime.TIME_24_SIMPLE),
  },
  {
    name: "to",
    label: "Bis",
    field: "to",
    format: (val, row) =>
      DateTime.fromISO(val).toLocaleString(DateTime.TIME_24_SIMPLE),
  },
  { name: "project", label: "Projekt", field: "project" },
  { name: "role", label: "Rolle", field: "role" },
  { name: "description", label: "Beschreibung", field: "description" },
];

const columns = computed(() => {
  return initColumns
    .filter(
      (obj) =>
        obj.name !== "project" || userStore.activeWorkspace.projectOption.length
    )
    .filter(
      (obj) =>
        obj.name !== "role" || userStore.activeWorkspace.roleOption.length
    );
});

const indexOfChangedIndex = (index) => {
  changedDataState.index = index;
};
const changedList = (data) => {
  updateChangedObject(toRaw(data));
};
const updateChangedObject = async (data) => {
  try {
    const updateData = await updateTimeRecord(
      toRaw(data[changedDataState.index])
    );
    data[changedDataState.index] = updateData.data;
    alertStore.success("Erfolgreich gespeichert");
  } catch (err) {
    alertStore.error("Speichern Fehlgeschlagen");
    const workspaceId = router.currentRoute.value.params?.id;
    const { data } = await getTimesByWorkspaceUser(workspaceId);
    userStore.setTimeTablesData(data);
  } finally {
    changedDataState.index = null;
  }
};
</script>
<template>
  <div class="container">
    <div class="q-mb-lg text-h5">Insgesamt: {{ calculateAllTime }}</div>
    <div v-for="(data, index) in groupedTimeTablesData" :key="data">
      <TimeTable
        :data="data"
        :day="index"
        :columns="columns"
        @changeIndex="indexOfChangedIndex"
        @changedList="changedList"
      />
    </div>
  </div>
</template>

<style></style>
