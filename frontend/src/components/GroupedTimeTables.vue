<script setup>
import { ref, watch, toRaw, computed } from "vue";
import TimeTable from "./table/TimeTable.vue";
import { DateTime } from "luxon";
import { useTimeTablesData } from "../composables/useTimeTablesData.js";
import { useUserStore, useAlertStore } from "../stores";
import { updateTimeRecord, getTimesByWorkspaceUser } from "../service";
import TimeRange from "./TimeRange.vue";
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
    style: "width: 140px; text-align: center;",
    headerStyle: "text-align: center;",
  },
  {
    name: "to",
    label: "Bis",
    field: "to",
    format: (val, row) =>
      DateTime.fromISO(val).toLocaleString(DateTime.TIME_24_SIMPLE),
    style: "width: 140px; text-align: center;",
    headerStyle: "text-align: center;",
  },
  {
    name: "project",
    label: "Projekt",
    field: "project",
    style:
      "max-width: 200px; text-align: center; text-overflow: ellipsis; overflow: hidden;",
    headerStyle: "text-align: center;",
  },
  {
    name: "role",
    label: "Rolle",
    field: "role",
    style:
      "max-width: 200px; text-align: center; text-overflow: ellipsis; overflow: hidden;",
    headerStyle: "text-align: center;",
  },
  {
    name: "description",
    label: "Beschreibung",
    field: "description",
    style:
      "max-width: 500px; text-overflow: ellipsis; overflow: hidden; text-align: center;",
    headerStyle: "text-align: center;",
  },
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
    await updateTimeRecord(toRaw(data[changedDataState.index]));
    alertStore.success("Erfolgreich gespeichert");
  } catch (err) {
    alertStore.error("Speichern Fehlgeschlagen", 3000);
    const workspaceId = router.currentRoute.value.params?.id;
    const { data } = await getTimesByWorkspaceUser(workspaceId);
    userStore.setTimeTablesData(data);
  } finally {
    changedDataState.index = null;
  }
};
</script>
<template>
  <div>
    <TimeRange :sumTime="calculateAllTime" />
    <template v-if="Object.keys(groupedTimeTablesData).length">
      <div v-for="(data, index) in groupedTimeTablesData" :key="data">
        <TimeTable
          :data="data"
          :day="index"
          :columns="columns"
          @changeIndex="indexOfChangedIndex"
          @changedList="changedList"
        />
      </div>
    </template>
    <template v-else>
      <h2 class="text-center text-h4">
        Keine Zeiteinträge für diesen Zeitraum
      </h2>
    </template>
  </div>
</template>

<style></style>
