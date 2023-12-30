<script setup>
import { onUnmounted } from "vue";
import AddTimeEntry from "../components/AddTimeEntry.vue";
import TimeTables from "../components/TimeTables.vue";
import WorkspaceActions from "../components/WorkspaceActions.vue";
import router from "../router";
import { getTimesByWorkspaceUser, getWorkspace } from "../service";
import { useUserStore } from "src/stores/user.store.js";
import { sortDate } from "../helpers/timeHelpers.js";

const userStore = useUserStore();

const workspaceId = router.currentRoute.value.params?.id;
const initializeData = async () => {
  const workspace = await getWorkspace(workspaceId);
  userStore.setActiveWorkspace(workspace.data);
  const { data } = await getTimesByWorkspaceUser(workspaceId);
  data.sort(sortDate);
  userStore.setTimeTablesData(data);
};
initializeData();

onUnmounted(() => {
  userStore.resetTimeData();
});
</script>

<template>
  <q-page>
    <h1 class="container text-h2">{{ userStore.activeWorkspace?.name }}</h1>
    <AddTimeEntry />
    <WorkspaceActions />
    <TimeTables />
  </q-page>
</template>
