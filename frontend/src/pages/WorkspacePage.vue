<script setup>
import { onUnmounted } from "vue";
import AddTimeEntry from "../components/AddTimeEntry.vue";
import TimeTables from "../components/TimeTables.vue";
import WorkspaceActions from "../components/WorkspaceActions.vue";
import { getWorkspace } from "../service";
import { useUserStore } from "src/stores/user.store.js";
import { loadTimeTables } from "../helpers/timeHelpers.js";
import router from "../router";

const userStore = useUserStore();

const initializeData = async () => {
  const workspaceId = router.currentRoute.value.params?.id;
  const workspace = await getWorkspace(workspaceId);
  userStore.setActiveWorkspace(workspace.data);
  await loadTimeTables();
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
