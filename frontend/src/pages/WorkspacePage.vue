<template>
  <q-page>
    <TimeCalculator />
    <TimeTables />
  </q-page>
</template>

<script setup>
import TimeCalculator from "../components/TimeCalculator.vue";
import TimeTables from "../components/TimeTables.vue";
import router from "../router";
import { getTimesByWorkspaceUser, getWorkspace } from "../service";
import { useUserStore } from "src/stores/user.store.js";

const userStore = useUserStore();

const workspaceId = router.currentRoute.value.params?.id;
const initializeData = async () => {
  const workspace = await getWorkspace(workspaceId);
  userStore.setActiveWorkspace(workspace.data);
  const { data } = await getTimesByWorkspaceUser(workspaceId);
  userStore.setTimeTablesData(data);
};
initializeData();
</script>
